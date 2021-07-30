import * as PIXI from "pixi.js";
import { useRef, useEffect } from "react";
import { waferViews } from "../../appsettings";

const Die = (props) => {
  const {
    diePitch,
    scale = 1,
    defects = [],
    canvasSize = 300,
    viewMode = waferViews.die,
    defectDiameter,
  } = props;

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
  }, [canvasSize]);

  useEffect(() => {
    draw();
  }, [defects, viewMode]);

  const getMaxComponentDimension = (canvasSize, diePitch) => {
    let height = diePitch.height;
    let width = diePitch.width;

    const scale = Math.min(canvasSize / width, canvasSize / height);

    return {
      width: scale * width,
      height: scale * height,
      componentScale: scale,
    };
  };

  const draw = () => {
    const { height, width, componentScale } = getMaxComponentDimension(
      canvasSize,
      diePitch
    );
    const canvasMid = canvasSize / 2;
    const center = {
      x: canvasMid - width / 2,
      y: canvasMid - height / 2,
    };

    stage.current = new PIXI.Container(0x000000, true);
    stage.current.scale.set(scale);
    stage.current.position.set(canvasMid, canvasMid);
    stage.current.pivot.set(canvasMid, canvasMid);

    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(center.x, 0, width, height);
    graphics.endFill();
    stage.current.addChild(graphics);

    // render chip grid if view mode is chip
    if (viewMode === waferViews.chip) {
      const maxColumns = diePitch.width / diePitch.chip.width;
      const maxRows = diePitch.height / diePitch.chip.height;
      const gridLines = new PIXI.Graphics();
      gridLines.lineStyle(0.28, 0x3d3d3d, 0.5);

      for (let i = 0; i < maxColumns; i++) {
        for (let j = 0; j < maxRows; j++) {
          const x = i * diePitch.chip.width;
          const y = j * diePitch.chip.height;
          gridLines.drawRect(
            x * componentScale,
            y * componentScale,
            diePitch.chip.width * componentScale,
            diePitch.chip.height * componentScale
          );
        }
      }

      gridLines.endFill();
      stage.current.addChild(gridLines);
    }

    // draw wafer defects
    const defectGraphics = new PIXI.Graphics();
    defects.forEach((defect) => {
      const x = defect.xRel * componentScale;
      const y = defect.yRel * componentScale;
      defectGraphics.beginFill(defect.color);
      defectGraphics.drawCircle(x, y, defectDiameter);
      defectGraphics.endFill();
    });
    stage.current.addChild(defectGraphics);

    renderer.current.render(stage.current);
  };

  return <div ref={rootRef} />;
};

export default Die;
