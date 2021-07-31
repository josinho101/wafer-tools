import * as PIXI from "pixi.js";
import { useRef, useEffect } from "react";
import { waferViews } from "../../appsettings";

const Chip = (props) => {
  const {
    diePitch,
    scale = 30,
    defects = [],
    canvasSize = 300,
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
  }, [defects]);

  const getMaxChipDimension = (canvasSize, diePitch) => {
    const height = diePitch.chip.height;
    const width = diePitch.chip.width;

    const scaleX = Math.min(canvasSize / width, canvasSize / height);

    return {
      width: width,
      height: height,
      scale: scaleX,
    };
  };

  const draw = () => {
    const chip = getMaxChipDimension(canvasSize, diePitch);
    const canvasMid = canvasSize / 2;
    const center = {
      x: canvasMid - chip.width / 2,
      y: canvasMid - chip.height / 2,
    };

    stage.current = new PIXI.Container(0x000000, true);
    stage.current.scale.set(scale);

    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(0, 0, chip.width, chip.height);
    graphics.endFill();
    stage.current.addChild(graphics);

    // draw wafer defects
    const defectGraphics = new PIXI.Graphics();
    defects.forEach((defect) => {
      const xRel = defect.xRel;
      const yRel = defect.yRel;
      const x = xRel - Math.floor(xRel / chip.width) * chip.width;
      const y = yRel - Math.floor(yRel / chip.height) * chip.height;
      defectGraphics.beginFill(defect.color);
      defectGraphics.drawCircle(x, y, defectDiameter / scale);
      defectGraphics.endFill();
    });
    stage.current.addChild(defectGraphics);

    renderer.current.render(stage.current);
  };

  return <div ref={rootRef} />;
};

export default Chip;
