import * as PIXI from "pixi.js";
import { useRef, useEffect } from "react";
import { degreeToRadian, removeDuplicatesFrom2DArray } from "../../../utils";
import { selectionType, shapes, colors } from "../../../appsettings";

const WaferAreaSelector = (props) => {
  const {
    doReset,
    radiusDivision,
    angleDivision,
    circumference: perimeter,
    doInvert,
    waferDiameter,
    onSelectionChanged,
  } = props;

  const canvasSize = 300;

  const stage = useRef();
  const rootRef = useRef();
  const renderer = useRef();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    isInitialLoad.current = true;
  }, [doReset]);

  useEffect(() => {
    PIXI.settings.RESOLUTION = 1;
    renderer.current = PIXI.autoDetectRenderer(canvasSize, canvasSize, {
      transparent: true,
      antialias: true,
    });

    rootRef.current.appendChild(renderer.current.view);

    return () => {
      renderer.current.destroy(true);
      renderer.current = null;
    };
  }, []);

  useEffect(() => {
    draw();
  }, [radiusDivision, angleDivision, perimeter]);

  useEffect(() => {
    if (!isInitialLoad.current) {
      invertSelection(doInvert);
    }
    isInitialLoad.current = false;
  }, [doInvert]);

  const addGraphicsClickHandler = (graphics) => {
    graphics.on("click", () => {
      if (!graphics.isSelected) {
        graphics.tint = colors.selected;
      } else {
        graphics.tint = colors.unselected;
      }
      graphics.isSelected = !graphics.isSelected;
      renderer.current.render(stage.current);
      updateAreaSelection();
    });
  };

  const invertSelection = (invert) => {
    for (let graphics of stage.current.children) {
      if (!graphics.isSelected) {
        graphics.tint = colors.selected;
      } else {
        graphics.tint = colors.unselected;
      }
      graphics.isSelected = !graphics.isSelected;
    }
    renderer.current.render(stage.current);
    updateAreaSelection();
  };

  const updateAreaSelection = () => {
    let selectedCount = 0;
    let areasSelected = [];
    for (let graphics of stage.current.children) {
      if (graphics.isSelected) {
        selectedCount++;
        areasSelected.push(graphics.properties);
      }
    }

    let type = selectionType.none;
    if (selectedCount === stage.current.children.length) {
      type = selectionType.full;
    } else if (selectedCount !== 0) {
      type = selectionType.partial;
    }

    if (type === selectionType.partial) {
      // console.log("before simplification", areasSelected);
      areasSelected = simplifySelection(areasSelected);
      // console.log("after simplification", areasSelected);
    }

    onSelectionChanged({
      selectionType: type,
      areas: areasSelected,
    });
  };

  const simplifySelection = (areas) => {
    let simplifiedAreas = [];
    areas = JSON.parse(JSON.stringify(areas));

    if ((radiusDivision !== 0 || perimeter !== 0) && angleDivision === 0) {
      // only radius or perimeter division selected.
      simplifiedAreas = simplifySelectionsByRadius(areas);
    } else if (angleDivision !== 0 && radiusDivision === 0 && perimeter === 0) {
      // only angle division selected.
      simplifiedAreas = simplifySelectionsByAngle(areas);
    } else {
      // angle and radius/perimeter division selected.
      // since we can have parimeter division, radius won't be always in same interval.

      /**
       * Algorithm steps
       *
       * 1. Group all selections by radius
       * 2. Check if selection areas in a radius group can form a circle.
       *    2.1 - If we can form a cicle, then add a circle shape to simplified list
       *    2.2 - remove all selection areas that form a cicle in previous step
       * 3. Try grouping all cicles formed in step 2.
       * 4. Try grouping selection areas by continus angle which cant be formed
       *    as circle in step 2, to a max of 180 degree
       */

      let ranges = areas.map((area) => {
        return { from: area.radius.from, to: area.radius.to };
      });
      // remove duplicate ranges and sort in ASC order of range.
      ranges = removeDuplicatesFrom2DArray(ranges);

      ranges.forEach((radiusRange) => {
        // check if we have all parts selected in a radius range which form a circle.
        const parts = areas.filter(
          (item) =>
            item.radius.from === radiusRange.from &&
            item.radius.to === radiusRange.to
        );
        if (parts.length === 360 / angleDivision) {
          // this will form a circle. remove parts from areas.
          areas = areas.filter(
            (item) =>
              item.radius.from !== radiusRange.from &&
              item.radius.to !== radiusRange.to
          );
          // add a circle shape with this radius range
          simplifiedAreas.push({
            shape: shapes.circle,
            radius: { from: radiusRange.from, to: radiusRange.to },
          });
        }
      });

      // try grouping circles formed in step 1
      if (simplifiedAreas.length) {
        simplifiedAreas = simplifySelectionsByRadius(simplifiedAreas);
      }

      // try simplifying rest of areas which can't form a circle.
      ranges.forEach((radiusRange) => {
        const parts = areas.filter(
          (item) =>
            item.radius.from === radiusRange.from &&
            item.radius.to === radiusRange.to
        );

        if (parts.length) {
          const simplifiedByAngle = simplifySelectionsByAngle(parts);
          simplifiedAreas.push(...simplifiedByAngle);
        }
      });
    }

    return simplifiedAreas;
  };

  const simplifySelectionsByRadius = (areas) => {
    // sort based on asc order of "from radius"
    const sortedAreas = areas.sort((a, b) => a.radius.from - b.radius.from);
    const simplifiedAreas = [];
    let prev = sortedAreas[0];
    simplifiedAreas.push(prev);

    for (const area of sortedAreas) {
      const prevUpperBound = prev.radius.to;
      const newLowerBound = area.radius.from;
      const newUpperBound = area.radius.to;

      if (prevUpperBound >= newLowerBound) {
        prev.radius.to = Math.max(prevUpperBound, newUpperBound);
      } else {
        prev = area;
        simplifiedAreas.push(prev);
      }
    }

    return simplifiedAreas;
  };

  const simplifySelectionsByAngle = (areas) => {
    // sort based on asc order of "from angle"
    const sortedAreas = areas.sort((a, b) => a.angle.from - b.angle.from);
    const simplifiedAreas = [];
    let prev = sortedAreas[0];
    simplifiedAreas.push(prev);

    for (const area of sortedAreas) {
      const prevLowerBound = prev.angle.from;
      const prevUpperBound = prev.angle.to;
      const newLowerBound = area.angle.from;
      const newUpperBound = area.angle.to;

      if (
        prevUpperBound >= newLowerBound &&
        Math.max(prevUpperBound, newUpperBound) - prevLowerBound <= 180
      ) {
        prev.angle.to = Math.max(prevUpperBound, newUpperBound);
      } else {
        prev = area;
        simplifiedAreas.push(prev);
      }
    }

    return simplifiedAreas;
  };

  const draw = () => {
    const center = canvasSize / 2;
    const waferRadius = waferDiameter / 2;

    stage.current = new PIXI.Container(0x000000, true);
    // flip stage vertically as PIXI drawing angle is clockwise
    stage.current.scale.y = -1;
    stage.current.interactive = true;
    stage.current.pivot.set(center, center);
    stage.current.position.set(center, center);

    if (radiusDivision === 0 && angleDivision === 0 && perimeter === 0) {
      // none selected! default view - draw single selected circle graphics
      const graphics = getCircleGraphics(center, waferRadius);
      graphics.properties = {
        shape: shapes.circle,
        radius: { from: 0, to: waferRadius },
      };
      stage.current.addChild(graphics);
    } else if (radiusDivision !== 0 && angleDivision === 0 && perimeter === 0) {
      // radius selected, angle and perimeter not selected, we need to draw circles
      for (let radius = waferRadius; radius > 0; radius -= radiusDivision) {
        const graphics = getCircleGraphics(center, radius);
        graphics.properties = {
          shape: shapes.circle,
          radius: { from: radius - radiusDivision, to: radius },
        };
        stage.current.addChild(graphics);
      }
    } else if (angleDivision !== 0 && radiusDivision === 0 && perimeter === 0) {
      // angle is selected but radius and perimeter not selected, need to draw arcs!
      const radius = waferDiameter / 2;
      for (let angle = 0; angle < 360; angle += angleDivision) {
        const start = degreeToRadian(angle);
        const end = degreeToRadian(angle + angleDivision);
        const graphics = getArcGraphics(center, radius, start, end);
        graphics.properties = {
          angle: { from: angle, to: angle + angleDivision },
          shape: shapes.circleSector,
          radius: { from: radius - radiusDivision, to: radius },
        };

        stage.current.addChild(graphics);
      }
    } else if (radiusDivision !== 0 && angleDivision !== 0 && perimeter === 0) {
      // both radius and angle divisions selected not perimeter. draw acrs!
      for (let radius = waferRadius; radius > 0; radius -= radiusDivision) {
        for (let angle = 0; angle < 360; angle += angleDivision) {
          const start = degreeToRadian(angle);
          const end = degreeToRadian(angle + angleDivision);
          const graphics = getArcGraphics(center, radius, start, end);
          graphics.properties = {
            angle: { from: angle, to: angle + angleDivision },
            shape: shapes.partialCircleSector,
            radius: { from: radius - radiusDivision, to: radius },
          };

          stage.current.addChild(graphics);
        }
      }
    } else if (perimeter !== 0 && radiusDivision === 0 && angleDivision === 0) {
      // permimeter selected, radius and angle division not selected
      let min = waferRadius - perimeter;
      for (let radius = waferRadius; radius >= min; radius -= perimeter) {
        const graphics = getCircleGraphics(center, radius);
        const from = radius === min ? 0 : radius - perimeter;
        graphics.properties = {
          shape: shapes.circle,
          radius: { from: from, to: radius },
        };
        stage.current.addChild(graphics);
      }
    } else if (perimeter !== 0 && radiusDivision !== 0 && angleDivision === 0) {
      // angle not selected. radius and perimeter division selected. draw circles!
      const pCircleRadius = waferRadius - perimeter; // perimeter circle radius
      for (let radius = waferRadius; radius > 0; radius -= radiusDivision) {
        const rMax = radius; // max radius
        const rMin = radius - radiusDivision; // min radius
        const drawPerimeter = pCircleRadius < rMax && pCircleRadius > rMin;
        const fromRadius = drawPerimeter ? pCircleRadius : rMin;

        const graphics = getCircleGraphics(center, radius);
        graphics.properties = {
          shape: shapes.circle,
          radius: { from: fromRadius, to: radius },
        };
        stage.current.addChild(graphics);

        if (drawPerimeter) {
          const graphics = getCircleGraphics(center, pCircleRadius);
          graphics.properties = {
            shape: shapes.circle,
            radius: { from: rMin, to: pCircleRadius },
          };
          stage.current.addChild(graphics);
        }
      }
    } else if (radiusDivision === 0 && angleDivision !== 0 && perimeter !== 0) {
      // angle and perimeter division selected. draw arcs!
      const pCircleRadius = waferRadius - perimeter; // perimeter circle radius
      for (let r = waferRadius; r >= pCircleRadius; r -= perimeter) {
        const fromRadius = r === waferRadius ? pCircleRadius : 0;
        const toRadius = r === waferRadius ? r : pCircleRadius;

        for (let angle = 0; angle < 360; angle += angleDivision) {
          const start = degreeToRadian(angle);
          const end = degreeToRadian(angle + angleDivision);
          const graphics = getArcGraphics(center, r, start, end);
          graphics.properties = {
            angle: { from: angle, to: angle + angleDivision },
            shape: shapes.partialCircleSector,
            radius: { from: fromRadius, to: toRadius },
          };

          stage.current.addChild(graphics);
        }
      }
    } else if (radiusDivision !== 0 && angleDivision !== 0 && perimeter !== 0) {
      // all options selected. draw acrs!
      const pCircleRadius = waferRadius - perimeter; // perimeter circle radius
      for (let radius = waferRadius; radius > 0; radius -= radiusDivision) {
        const rMax = radius; // max radius
        const rMin = radius - radiusDivision; // min radius
        const drawPerimeter = pCircleRadius < rMax && pCircleRadius > rMin;
        const fromRadius = drawPerimeter ? pCircleRadius : rMin;

        for (let angle = 0; angle < 360; angle += angleDivision) {
          const start = degreeToRadian(angle);
          const end = degreeToRadian(angle + angleDivision);

          const graphics = getArcGraphics(center, radius, start, end);
          graphics.properties = {
            angle: { from: angle, to: angle + angleDivision },
            shape: shapes.partialCircleSector,
            radius: { from: fromRadius, to: radius },
          };
          stage.current.addChild(graphics);

          if (drawPerimeter) {
            const graphics = getArcGraphics(center, pCircleRadius, start, end);
            graphics.properties = {
              angle: { from: angle, to: angle + angleDivision },
              shape: shapes.partialCircleSector,
              radius: { from: rMin, to: pCircleRadius },
            };
            stage.current.addChild(graphics);
          }
        }
      }
    }

    onSelectionChanged({
      selectionType: selectionType.full,
      areas: [],
    });
    renderer.current.render(stage.current);
  };

  const getCircleGraphics = (center, radius) => {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(colors.unselected);
    graphics.lineStyle(1, colors.border);
    graphics.drawCircle(center, center, radius);
    graphics.endFill();
    graphics.interactive = true;
    graphics.buttonMode = true;
    graphics.isSelected = true;
    graphics.tint = colors.selected;
    addGraphicsClickHandler(graphics);

    return graphics;
  };

  const getArcGraphics = (center, radius, start, end) => {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(colors.unselected);
    graphics.lineStyle(1, colors.border, 0.5);
    graphics.arc(center, center, radius, start, end);
    graphics.lineTo(center, center);
    graphics.endFill();
    graphics.interactive = true;
    graphics.buttonMode = true;
    graphics.isSelected = true;
    graphics.tint = colors.selected;
    addGraphicsClickHandler(graphics);

    return graphics;
  };

  return <div ref={rootRef} />;
};

export default WaferAreaSelector;
