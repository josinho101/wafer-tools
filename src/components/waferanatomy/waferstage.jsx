import * as PIXI from "pixi.js";
import { useRef, useEffect } from "react";
import { convertNmToMm, degreeToRadian, inside } from "../../utils";

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

    const dieOriginX = waferCenter.x - (sampleCenter.x - dieOrigin.x);
    const dieOriginY = waferCenter.y + (sampleCenter.y - dieOrigin.y);

    const dies = generateDies(
      { width: canvasWidth, height: canvasHeight },
      diameter,
      diePitch,
      { x: dieOriginX, y: dieOriginY },
      waferCenter
    );

    stage.current = new PIXI.Container(0xffffff, true);
    stage.current.scale.set(scale);
    stage.current.position.set(
      sampleCoordinateCenter.x,
      sampleCoordinateCenter.y
    );
    stage.current.pivot.set(sampleCoordinateCenter.x, sampleCoordinateCenter.y);

    const dieGraphics = new PIXI.Graphics();
    dieGraphics.lineStyle(0.28, 0x3d3d3d, 0.5);

    dies.forEach((die) => {
      dieGraphics.beginFill(die.color);
      dieGraphics.drawRect(die.dx, die.dy, diePitch.x, diePitch.y);
      if (diePitch.x >= 25 && diePitch.y >= 25) {
        const text = new PIXI.Text(`(${die.xIndex},${die.yIndex})`, {
          fontFamily: "Arial",
          fontSize: 8,
          fontWeight: "bold",
        });
        text.position.x = die.dx + diePitch.x / 2 - text.width / 2;
        text.position.y = die.dy + diePitch.y / 2 - text.height / 2;
        dieGraphics.addChild(text);
      }
    });
    dieGraphics.endFill();
    stage.current.addChild(dieGraphics);

    // draw sample coordinate quadrants
    const quadrants = new PIXI.Graphics();
    quadrants.lineStyle(0.5, 0x000000);
    quadrants.moveTo(sampleCoordinateCenter.x, 0);
    quadrants.lineTo(sampleCoordinateCenter.x, sampleCoordinateCenter.y * 5);
    quadrants.moveTo(0, sampleCoordinateCenter.y);
    quadrants.lineTo(sampleCoordinateCenter.x * 5, sampleCoordinateCenter.y);
    stage.current.addChild(quadrants);

    // sample coordinate center
    const sampleCenterGraphics = new PIXI.Graphics();
    sampleCenterGraphics.beginFill(0xff0000);
    sampleCenterGraphics.drawCircle(
      sampleCoordinateCenter.x,
      sampleCoordinateCenter.y,
      2
    );
    sampleCenterGraphics.endFill();
    stage.current.addChild(sampleCenterGraphics);

    // wafer center
    const waferCenterGraphics = new PIXI.Graphics();
    waferCenterGraphics.beginFill(0x0000ff);
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

    // draw die origin quadrants
    const dieOriginQuadrants = new PIXI.Graphics();
    dieOriginQuadrants.lineStyle(0.5, 0x000000);
    dieOriginQuadrants.moveTo(dieOriginX, 0);
    dieOriginQuadrants.lineTo(dieOriginX, dieOriginY * 10);
    dieOriginQuadrants.moveTo(0, dieOriginY);
    dieOriginQuadrants.lineTo(dieOriginX * 10, dieOriginY);
    stage.current.addChild(dieOriginQuadrants);

    // draw die origin
    const dieOriginGraphics = new PIXI.Graphics();
    dieOriginGraphics.beginFill(0x038c03);
    dieOriginGraphics.drawCircle(dieOriginX, dieOriginY, 2);
    dieOriginGraphics.endFill();
    stage.current.addChild(dieOriginGraphics);

    renderer.current.render(stage.current);
  };

  const generateDies = (
    canvasSize,
    waferDiameter,
    diePitch,
    dieOrigin,
    center
  ) => {
    const dies = [];
    const dieWidth = diePitch.x;
    const dieHeight = diePitch.y;
    // const doEnableDie = diePitch.width === waferDiameter * 2;
    const waferRadius = waferDiameter / 2;
    const maxY = Math.floor(waferDiameter / dieHeight);
    const maxX = Math.floor(waferDiameter / dieWidth);
    const max = Math.max(maxX, maxY);

    // top left quadrant
    for (let x = 0; x < max; x++) {
      const dy = dieOrigin.y - dieHeight * (x + 1);
      for (let y = 0; y < max; y++) {
        const dx = dieOrigin.x + dieWidth * y;
        if (
          inside(dx, dy, dieWidth, dieHeight, center.x, center.y, waferRadius)
        ) {
          dies.push({ dx, dy, xIndex: x, yIndex: y, color: 0xfcf0ed });
        }
      }
    }

    // bottom right
    for (let y = 0; y < max; y++) {
      const dy = dieOrigin.y + dieHeight * y;
      for (let x = 0; x < max; x++) {
        const dx = dieOrigin.x + dieWidth * x;
        if (
          inside(dx, dy, dieWidth, dieHeight, center.x, center.y, waferRadius)
        ) {
          dies.push({ dx, dy, xIndex: x, yIndex: -y - 1, color: 0xedfcf5 });
        }
      }
    }

    // top left
    for (let y = 0; y < max; y++) {
      const dy = dieOrigin.y - dieHeight * (y + 1);
      for (let x = 0; x < max; x++) {
        const dx = dieOrigin.x - dieWidth * (x + 1);
        if (
          inside(dx, dy, dieWidth, dieHeight, center.x, center.y, waferRadius)
        ) {
          dies.push({ dx, dy, xIndex: -x - 1, yIndex: y, color: 0xfafced });
        }
      }
    }

    // bottom left
    for (let y = 0; y < max; y++) {
      const dy = dieOrigin.y + dieHeight * y;
      for (let x = 0; x < max; x++) {
        const dx = dieOrigin.x - dieWidth * (x + 1);
        if (
          inside(dx, dy, dieWidth, dieHeight, center.x, center.y, waferRadius)
        ) {
          dies.push({
            dx,
            dy,
            xIndex: -x - 1,
            yIndex: -y - 1,
            color: 0xedeefc,
          });
        }
      }
    }

    return dies;
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
