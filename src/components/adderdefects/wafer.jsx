import * as PIXI from "pixi.js";
import { useRef, useEffect } from "react";
import { colors, waferViews } from "../../appsettings";
import { convertNmToMm } from "../../utils";

const Wafer = (props) => {
  const {
    diePitch,
    scale = 1,
    defectDiameter = 1,
    dies = [],
    defects = [],
    canvasSize = 300,
    waferRadius = 150,
    view = waferViews.die,
    dieOrigin = { x: 0, y: 0 },
    angle = 0,
    showQuadrants,
    showQuadrantColors,
    showDieIndexs,
    showDieOrigin,
    showWaferCenter,
  } = props;

  const stage = useRef();
  const rootRef = useRef();
  const renderer = useRef();

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
  }, [canvasSize]);

  useEffect(() => {
    draw();
  }, [dies, defects, view]);

  const draw = () => {
    const center = canvasSize / 2;
    stage.current = new PIXI.Container(0x000000, true);
    stage.current.scale.set(scale);
    stage.current.position.set(center, center);
    stage.current.pivot.set(center, center);

    // draw wafer circle
    const circle = new PIXI.Graphics();
    circle.beginFill(0xffffff);
    circle.drawCircle(center, center, waferRadius);
    circle.endFill();
    stage.current.addChild(circle);

    if (view !== waferViews.none) {
      let dieWidth = diePitch.width;
      let dieHeight = diePitch.height;

      if (angle === 90 || angle === 270) {
        dieWidth = diePitch.height;
        dieHeight = diePitch.width;
      }

      const gridLines = new PIXI.Graphics();
      gridLines.lineStyle(0.4, 0x3d3d3d, 0.5);
      dies.forEach((die) => {
        gridLines.beginFill(showQuadrantColors ? die.color : 0xffffff);
        gridLines.drawRect(die.dx, die.dy, dieWidth, dieHeight);
        if (showDieIndexs) {
          const text = new PIXI.Text(`(${die.xIndex},${die.yIndex})`, {
            fontFamily: "Arial",
            fontSize: 5,
            fontWeight: "bold",
          });
          text.position.x = die.dx + dieWidth / 2 - text.width / 2;
          text.position.y = die.dy + dieHeight / 2 - text.height / 2;
          gridLines.addChild(text);
        }
      });
      gridLines.endFill();
      stage.current.addChild(gridLines);
    }

    // draw quadrants
    if (showQuadrants) {
      const center = { x: canvasSize / 2, y: canvasSize / 2 };
      const p1X = center.x;
      const p1Y = center.y - waferRadius;
      const p2X = center.x - waferRadius;
      const p2Y = center.y;

      const quadrantGraphics = new PIXI.Graphics();
      quadrantGraphics.lineStyle(0.75, 0x000000);
      quadrantGraphics.moveTo(p1X, p1Y);
      quadrantGraphics.lineTo(p1X, p1Y + waferRadius * 2);
      quadrantGraphics.moveTo(p2X, p2Y);
      quadrantGraphics.lineTo(p2X + waferRadius * 2, p2Y);
      stage.current.addChild(quadrantGraphics);
    }

    if (showDieOrigin) {
      let centerX = center - dieOrigin.x;
      let centerY = center - dieOrigin.y;

      if (angle === 90 || angle === 270) {
        centerX = center + dieOrigin.y;
        centerY = center + dieOrigin.x;
      }

      switch (angle) {
        case 0:
          centerX = center - dieOrigin.x;
          centerY = center - dieOrigin.y;
          break;
        case 90:
          centerX = center + dieOrigin.y;
          centerY = center - dieOrigin.x;
          break;
        case 180:
          centerX = center + dieOrigin.x;
          centerY = center + dieOrigin.y;
          break;
        case 270:
          centerX = center - dieOrigin.y;
          centerY = center + dieOrigin.x;
          break;
      }

      const dieOriginGraphics = new PIXI.Graphics();
      dieOriginGraphics.beginFill(0x0000ff);
      dieOriginGraphics.drawCircle(centerX, centerY, 1.5);
      dieOriginGraphics.endFill();
      stage.current.addChild(dieOriginGraphics);
    }

    if (showWaferCenter) {
      const centerCircle = new PIXI.Graphics();
      centerCircle.beginFill(0x000000);
      centerCircle.drawCircle(center, center, 1.5);
      centerCircle.endFill();
      stage.current.addChild(centerCircle);
    }

    // draw wafer defects
    const defectGraphics = new PIXI.Graphics();
    defects.forEach((defect) => {
      const die = dies.filter(
        (item) => item.xIndex === defect.xIndex && item.yIndex === defect.yIndex
      )[0];
      if (die) {
        const x = die.dx + convertNmToMm(defect.xRel);
        const y = die.dy - convertNmToMm(defect.yRel) + diePitch.height;
        defectGraphics.beginFill(defect.color);
        defectGraphics.drawCircle(x, y, defectDiameter);
        defectGraphics.endFill();

        defectGraphics.lineStyle(0.5, 0x000000);
        const tolerance = 1;
        const tLeft = { x: x - tolerance, y: y - tolerance }; // top left
        const tRight = { x: x + tolerance, y: y - tolerance }; // top right
        const bLeft = { x: x - tolerance, y: y + tolerance }; // bottom left
        const bRight = { x: x + tolerance, y: y + tolerance }; // bottom right
        defectGraphics.drawRect(
          tLeft.x,
          tLeft.y,
          tRight.x - tLeft.x,
          bLeft.y - tLeft.y
        );
        // defectGraphics.drawCircle(x, y, tolerance);
        defectGraphics.endFill();
      }
    });
    stage.current.addChild(defectGraphics);

    renderer.current.render(stage.current);
  };

  return <div ref={rootRef} />;
};

export default Wafer;
