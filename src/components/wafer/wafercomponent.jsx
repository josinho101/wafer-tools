import * as PIXI from "pixi.js";
import { useRef, useEffect } from "react";
import { waferViews } from "../../appsettings";

const WaferComponent = (props) => {
  const {
    diePitch,
    scale = 1,
    defects = [],
    canvasSize = 300,
    view = waferViews.die,
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
  }, [defects, view]);

  const getMaxComponentDimension = (canvasSize, diePitch, view) => {
    const buffer = 0;
    let height = diePitch.height;
    let width = diePitch.width;
    if (view === waferViews.chip) {
      height = diePitch.chip.height;
      width = diePitch.chip.width;
    }

    const scale = Math.min(canvasSize / width, canvasSize / height);

    return {
      width: scale * width - buffer,
      height: scale * height - buffer,
      componentScale: scale,
    };
  };

  const draw = () => {
    const { height, width, componentScale } = getMaxComponentDimension(
      canvasSize,
      diePitch,
      view
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

export default WaferComponent;
