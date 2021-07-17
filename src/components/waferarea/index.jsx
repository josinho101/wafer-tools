import * as PIXI from "pixi.js";
import { useRef, useEffect } from "react";
import { degreeToRadian } from "../../utils";
import { selectionType } from "../../appsettings";

const WaferAreaSelector = (props) => {
  const {
    doReset,
    radiusDivision,
    angleDivision,
    circumference,
    doInvert,
    waferDiameter,
    onSelectionChanged,
  } = props;

  const canvasSize = 300;
  const colors = {
    selected: 0xff7373,
    unselected: 0xffffff,
    border: 0x000000,
    green: 0x00ff00,
  };

  const stage = useRef();
  const rootRef = useRef();
  const renderer = useRef();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    isInitialLoad.current = true;
  }, [doReset]);

  useEffect(() => {
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
  }, [radiusDivision, angleDivision, circumference]);

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
    const areasSelected = [];
    for (let graphics of stage.current.children) {
      if (graphics.isSelected) {
        selectedCount++;
        areasSelected.push(graphics.measurements);
      }
    }

    let type = selectionType.none;
    if (selectedCount === stage.current.children.length) {
      type = selectionType.full;
    } else if (selectedCount !== 0) {
      type = selectionType.partial;
    }

    onSelectionChanged({
      selectionType: type,
      areas: areasSelected,
    });
  };

  const draw = () => {
    const center = canvasSize / 2;
    const waferRadius = waferDiameter / 2;

    stage.current = new PIXI.Container(0x000000, true);
    stage.current.position.set(center, center);
    stage.current.pivot.set(center, center);
    // flip stage vertically as PIXI drawing angle is clockwise
    stage.current.scale.y = -1;
    stage.current.interactive = true;

    // default view - draw single selected circle graphics
    if (radiusDivision === 0 && angleDivision === 0 && circumference === 0) {
      const graphics = getCircleGraphics(center, waferRadius);
      graphics.measurements = { radius: waferRadius };
      stage.current.addChild(graphics);
    } else if (radiusDivision !== 0 && angleDivision === 0) {
      // radius division is selected but angle division is not selected, we need to draw circles
      for (let radius = waferRadius; radius > 0; radius -= radiusDivision) {
        const graphics = getCircleGraphics(center, radius);
        graphics.measurements = { radius: radius - radiusDivision };
        stage.current.addChild(graphics);
      }
    } else if (radiusDivision === 0 && angleDivision !== 0) {
      // angle is selected but radius is not selected, need to draw arcs!
      const radius = waferDiameter / 2;
      for (let angle = 0; angle < 360; angle += angleDivision) {
        const start = degreeToRadian(angle);
        const end = degreeToRadian(angle + angleDivision);
        const graphics = getArcGraphics(center, radius, start, end);
        graphics.measurements = {
          angle,
          radius: radius - radiusDivision,
        };

        stage.current.addChild(graphics);
      }
    } else if (radiusDivision !== 0 && angleDivision !== 0) {
      // both radius and angle divisions selected. draw acrs!
      for (let radius = waferRadius; radius > 0; radius -= radiusDivision) {
        for (let angle = 0; angle < 360; angle += angleDivision) {
          const start = degreeToRadian(angle);
          const end = degreeToRadian(angle + angleDivision);
          const graphics = getArcGraphics(center, radius, start, end);
          graphics.measurements = {
            angle,
            radius: radius - radiusDivision,
          };

          stage.current.addChild(graphics);
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
