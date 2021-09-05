import * as PIXI from "pixi.js";
import { useRef, useEffect } from "react";
import { convertNmToMm, degreeToRadian } from "../../utils";

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
    const sampleCoordinateCenter = getSampleCoordinateCenter();
    const waferCenter = {
      x: sampleCoordinateCenter.x + sampleCenter.x,
      y: sampleCoordinateCenter.y - sampleCenter.y,
    };

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
    quadrants.lineTo(sampleCoordinateCenter.x, sampleCoordinateCenter.y * 5);
    quadrants.moveTo(0, sampleCoordinateCenter.y);
    quadrants.lineTo(sampleCoordinateCenter.x * 5, sampleCoordinateCenter.y);
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

    // draw notch based on orientation
    const notchGraphics = getNotch(orientation, radius, waferCenter);
    stage.current.addChild(notchGraphics);

    const dieOriginX = waferCenter.x - (sampleCenter.x - dieOrigin.x);
    const dieOriginY = waferCenter.y + (sampleCenter.y - dieOrigin.y);

    // draw die origin
    const dieOriginGraphics = new PIXI.Graphics();
    dieOriginGraphics.beginFill(0x038c03);
    dieOriginGraphics.drawCircle(dieOriginX, dieOriginY, 3);
    dieOriginGraphics.endFill();
    stage.current.addChild(dieOriginGraphics);

    // draw die origin quadrants
    const dieOriginQuadrants = new PIXI.Graphics();
    dieOriginQuadrants.lineStyle(0.5, 0x000000);
    dieOriginQuadrants.moveTo(dieOriginX, 0);
    dieOriginQuadrants.lineTo(dieOriginX, dieOriginY * 5);
    dieOriginQuadrants.moveTo(0, dieOriginY);
    dieOriginQuadrants.lineTo(dieOriginX * 5, dieOriginY);
    stage.current.addChild(dieOriginQuadrants);

    renderer.current.render(stage.current);
  };

  const getSampleCoordinateCenter = () => {
    const buffer = 100;
    const sampleCoordinateCenter = { x: canvasWidth / 2, y: canvasHeight / 2 };

    if (Math.sign(sampleCenter.x) > 0 && Math.sign(sampleCenter.y) > 0) {
      // 1st
      sampleCoordinateCenter.x = sampleCoordinateCenter.x - buffer;
      sampleCoordinateCenter.y = sampleCoordinateCenter.y + buffer;
    } else if (Math.sign(sampleCenter.x) > 0 && Math.sign(sampleCenter.y) < 0) {
      // 4th
      sampleCoordinateCenter.x = sampleCoordinateCenter.x - buffer;
      sampleCoordinateCenter.y = sampleCoordinateCenter.y - buffer;
    } else if (Math.sign(sampleCenter.x) < 0 && Math.sign(sampleCenter.y) > 0) {
      // 2nd
      sampleCoordinateCenter.x = sampleCoordinateCenter.x + buffer;
      sampleCoordinateCenter.y = sampleCoordinateCenter.y + buffer;
    } else if (Math.sign(sampleCenter.x) < 0 && Math.sign(sampleCenter.y) < 0) {
      // 3rd
      sampleCoordinateCenter.x = sampleCoordinateCenter.x + buffer;
      sampleCoordinateCenter.y = sampleCoordinateCenter.y - buffer;
    }

    return sampleCoordinateCenter;
  };

  const getNotch = (orientation, radius, waferCenter) => {
    const triangleWidth = 8;
    const triangleHeight = triangleWidth;
    const triangleHalfway = triangleWidth / 2;

    let xPos = 0;
    let yPos = 0;
    const triangle = new PIXI.Graphics();
    triangle.beginFill(0xff0000, 1);

    switch (orientation) {
      case 0:
        xPos = waferCenter.x - triangleHalfway;
        yPos = waferCenter.y - radius;
        triangle.position.set(xPos, yPos);
        triangle.moveTo(triangleWidth, 0);
        triangle.lineTo(triangleHalfway, triangleHeight);
        triangle.lineTo(0, 0);
        triangle.lineTo(triangleHalfway, 0);
        break;
      case 90:
        xPos = waferCenter.x + radius;
        yPos = waferCenter.y + triangleHalfway;
        triangle.position.set(xPos, yPos);
        triangle.moveTo(0, triangleWidth);
        triangle.lineTo(triangleHeight, triangleHalfway);
        triangle.lineTo(0, 0);
        triangle.lineTo(0, triangleHalfway);
        triangle.rotation = degreeToRadian(180);
        break;
      case 180:
        xPos = waferCenter.x + triangleHalfway;
        yPos = waferCenter.y + radius;
        triangle.position.set(xPos, yPos);
        triangle.moveTo(triangleWidth, 0);
        triangle.lineTo(triangleHalfway, triangleHeight);
        triangle.lineTo(0, 0);
        triangle.lineTo(triangleHalfway, 0);
        triangle.rotation = degreeToRadian(180);
        break;
      case 270:
        xPos = waferCenter.x - radius;
        yPos = waferCenter.y - triangleHalfway;
        triangle.position.set(xPos, yPos);
        triangle.moveTo(0, triangleWidth);
        triangle.lineTo(triangleHeight, triangleHalfway);
        triangle.lineTo(0, 0);
        triangle.lineTo(0, triangleHalfway);
        break;
    }

    triangle.endFill();

    return triangle;
  };

  return <div ref={rootRef} />;
};

export default WaferStage;
