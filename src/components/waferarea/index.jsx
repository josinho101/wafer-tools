import * as PIXI from "pixi.js";
import { useRef, useEffect } from "react";
import { degreeToRadian } from "../../utils";

const WaferAreaSelector = (props) => {
  const {
    radiusDivision,
    angleDivision,
    circumference,
    doInvert,
    waferDiameter,
  } = props;

  const canvasSize = 300;
  const colors = {
    selected: 0xff7373,
    unselected: 0xffffff,
    border: 0x000000,
  };

  const stage = useRef();
  const rootRef = useRef();
  const renderer = useRef();

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
    invertSelection(doInvert);
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
    });
  };

  const invertSelection = (invert) => {
    if (stage.current.children.length > 1) {
      for (let graphics of stage.current.children) {
        if (!graphics.isSelected) {
          graphics.tint = colors.selected;
        } else {
          graphics.tint = colors.unselected;
        }
        graphics.isSelected = !graphics.isSelected;
      }
      renderer.current.render(stage.current);
    }
  };

  const draw = () => {
    const center = canvasSize / 2;
    const waferRadius = waferDiameter / 2;

    stage.current = new PIXI.Container(0x000000, true);
    stage.current.interactive = true;

    // default view - draw single selected circle graphics
    if (radiusDivision === 0 && angleDivision === 0 && circumference === 0) {
      const circle = new PIXI.Graphics();
      circle.interactive = true;
      circle.buttonMode = true;
      circle.lineStyle(1, colors.border);
      circle.beginFill(colors.selected);
      circle.drawCircle(center, center, waferRadius);
      circle.endFill();

      stage.current.addChild(circle);
    } else if (radiusDivision !== 0 && angleDivision === 0) {
      // radius division is selected but angle division is not selected, we need to draw circles
      for (let radius = waferRadius; radius > 0; radius -= radiusDivision) {
        const circle = new PIXI.Graphics();
        circle.interactive = true;
        circle.buttonMode = true;
        circle.beginFill(colors.unselected);
        circle.lineStyle(1, colors.border);
        circle.drawCircle(center, center, radius);
        circle.endFill();
        addGraphicsClickHandler(circle);

        stage.current.addChild(circle);
      }
    } else if (radiusDivision === 0 && angleDivision !== 0) {
      // angle is selected but radius is not selected, need to draw arcs!
      const radius = waferDiameter / 2;
      for (let angle = 0; angle < 360; angle += angleDivision) {
        const start = degreeToRadian(angle);
        const end = degreeToRadian(angle + angleDivision);

        const graphics = new PIXI.Graphics();
        graphics.interactive = true;
        graphics.buttonMode = true;
        graphics.beginFill(colors.unselected);
        graphics.lineStyle(1, colors.border, 0.5);
        graphics.arc(center, center, radius, start, end);
        graphics.lineTo(center, center);
        addGraphicsClickHandler(graphics);

        stage.current.addChild(graphics);
      }
    } else if (radiusDivision !== 0 && angleDivision !== 0) {
      // both radius and angle divisions selected. draw acrs!
      for (let radius = waferRadius; radius > 0; radius -= radiusDivision) {
        for (let angle = 0; angle < 360; angle += angleDivision) {
          const start = degreeToRadian(angle);
          const end = degreeToRadian(angle + angleDivision);

          const graphics = new PIXI.Graphics();
          graphics.interactive = true;
          graphics.buttonMode = true;
          graphics.beginFill(colors.unselected);
          graphics.lineStyle(1, colors.border, 0.5);
          graphics.arc(center, center, radius, start, end);
          graphics.lineTo(center, center);
          addGraphicsClickHandler(graphics);

          stage.current.addChild(graphics);
        }
      }
    }

    renderer.current.render(stage.current);
  };

  return <div ref={rootRef} />;
};

export default WaferAreaSelector;
