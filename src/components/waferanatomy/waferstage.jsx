import * as PIXI from "pixi.js";
import { useRef, useEffect } from "react";
import { convertNmToMm } from "../../utils";

const WaferStage = (props) => {
  const { diameter, orientation, diePitch, sampleCenter, dieOrigin } = props;

  const stage = useRef();
  const rootRef = useRef();
  const renderer = useRef();

  const canvasWidth = 900;
  const canvasHeight = 520;
  const scale = 1;
  const radius = diameter / 2;

  useEffect(() => {
    PIXI.settings.RESOLUTION = 1;
    renderer.current = PIXI.autoDetectRenderer(canvasWidth, canvasHeight, {
      backgroundColor: 0xffffff,
      antialias: true,
    });

    rootRef.current.appendChild(renderer.current.view);

    return () => {
      renderer.current.destroy(true);
      renderer.current = null;
    };
  }, [canvasWidth, canvasHeight]);

  useEffect(() => {
    draw();
  }, [diameter, orientation, diePitch, sampleCenter, dieOrigin]);

  const draw = () => {
    const sampleCoordinateCenter = { x: canvasWidth / 2, y: canvasHeight / 2 };
    const waferCenter = {
      x: sampleCoordinateCenter.x + convertNmToMm(sampleCenter.x),
      y: sampleCoordinateCenter.y - convertNmToMm(sampleCenter.y),
    };

    // sampleCoordinateCenter correction
    const buffer = 50;
    if (sampleCoordinateCenter.y < waferCenter.y + radius * 2) {
      sampleCoordinateCenter.x = sampleCoordinateCenter.x - buffer;
      sampleCoordinateCenter.y = sampleCoordinateCenter.y + buffer;
      waferCenter.x = sampleCoordinateCenter.x + convertNmToMm(sampleCenter.x);
      waferCenter.y = sampleCoordinateCenter.y - convertNmToMm(sampleCenter.y);
    }

    stage.current = new PIXI.Container(0xffffff, true);
    stage.current.scale.set(scale);
    stage.current.position.set(
      sampleCoordinateCenter.x,
      sampleCoordinateCenter.y
    );
    stage.current.pivot.set(sampleCoordinateCenter.x, sampleCoordinateCenter.y);

    // sample coordinate center
    const sampleCenterGraphics = new PIXI.Graphics();
    sampleCenterGraphics.beginFill(0xff0000);
    sampleCenterGraphics.drawCircle(
      sampleCoordinateCenter.x,
      sampleCoordinateCenter.y,
      3
    );
    sampleCenterGraphics.endFill();
    stage.current.addChild(sampleCenterGraphics);

    // draw sample coordinate quadrants
    const quadrants = new PIXI.Graphics();
    quadrants.lineStyle(0.5, 0x000000);
    quadrants.moveTo(sampleCoordinateCenter.x, 0);
    quadrants.lineTo(sampleCoordinateCenter.x, sampleCoordinateCenter.y * 2);
    quadrants.moveTo(0, sampleCoordinateCenter.y);
    quadrants.lineTo(sampleCoordinateCenter.x * 2, sampleCoordinateCenter.y);
    stage.current.addChild(quadrants);

    // wafer center
    const waferCenterGraphics = new PIXI.Graphics();
    waferCenterGraphics.beginFill(0xff00ff);
    waferCenterGraphics.drawCircle(waferCenter.x, waferCenter.y, 2);
    waferCenterGraphics.endFill();
    stage.current.addChild(waferCenterGraphics);

    // wafer
    const wafer = new PIXI.Graphics();
    wafer.lineStyle(0.75, 0x3d3d3d);
    wafer.drawCircle(waferCenter.x, waferCenter.y, radius);
    wafer.endFill();
    stage.current.addChild(wafer);

    renderer.current.render(stage.current);
  };

  return <div ref={rootRef} />;
};

export default WaferStage;
