import * as PIXI from "pixi.js";
import { useRef, useEffect, useState } from "react";
import { degreeToRadian } from "../../utils";
import { Typography } from "@material-ui/core";
import { useStyles } from "./style";
import { selectionType, shapes, colors } from "../../appsettings";

const Wafer = (props) => {
  const {
    selectionArea,
    diePitch,
    scale = 1,
    showQuadrants,
    defectDiameter = 1,
    dies = [],
    defects = [],
    canvasSize = 300,
    waferRadius = 150,
  } = props;

  const stage = useRef();
  const rootRef = useRef();
  const renderer = useRef();

  const classes = useStyles();

  const [dieCount, setDieCount] = useState(0);
  const [defectCount, setDefectCount] = useState({
    total: 0,
    visible: 0,
    hidden: 0,
  });

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
  }, [selectionArea, dies, defects]);

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

    // draw quadrants
    if (showQuadrants) {
      const center = { x: canvasSize / 2, y: canvasSize / 2 };
      const p1X = center.x;
      const p1Y = center.y - waferRadius;
      const p2X = center.x - waferRadius;
      const p2Y = center.y;

      const quadrantGraphics = new PIXI.Graphics();
      quadrantGraphics.lineStyle(0.25, colors.black);
      quadrantGraphics.moveTo(p1X, p1Y);
      quadrantGraphics.lineTo(p1X, p1Y + waferRadius * 2);
      quadrantGraphics.moveTo(p2X, p2Y);
      quadrantGraphics.lineTo(p2X + waferRadius * 2, p2Y);
      stage.current.addChild(quadrantGraphics);
    }

    // draw dies
    let dieCounter = 0;
    const gridLines = new PIXI.Graphics();
    gridLines.lineStyle(0.28, 0x3d3d3d, 0.5);
    dies.forEach((row) => {
      row.forEach((die) => {
        if (die !== undefined) {
          if (die["dx"] !== undefined && die["dy"] !== undefined) {
            gridLines.drawRect(
              die["dx"],
              die["dy"],
              diePitch.width,
              diePitch.height
            );
            dieCounter++;
          }
        }
      });
    });
    gridLines.endFill();
    stage.current.addChild(gridLines);
    setDieCount(dieCounter);

    // draw wafer defects
    let defectCounter = 0;
    const angleDivision = selectionArea.angleDivision;
    const defectGraphics = new PIXI.Graphics();
    switch (selectionArea.selectionType) {
      case selectionType.full:
        // render full defects!!
        defects.forEach((defect) => {
          defectGraphics.beginFill(defect.color);
          defectGraphics.drawCircle(defect.x, defect.y, defectDiameter);
          defectGraphics.endFill();
          defectCounter++;
        });
        break;
      case selectionType.partial:
        // render defects based on the selection made in area selector
        selectionArea.areas.forEach((area) => {
          const center = { x: canvasSize / 2, y: canvasSize / 2 };
          const start = degreeToRadian(360 - area.angle - angleDivision);
          const end = degreeToRadian(360 - area.angle);
          const sectorStart = { x: Math.cos(start), y: Math.sin(start) };
          const sectorEnd = { x: Math.cos(end), y: Math.sin(end) };
          const startRadiusSquared = Math.pow(area.radius.from, 2);
          const endRadiusSquared = Math.pow(area.radius.to, 2);

          switch (area.shape) {
            case shapes.circle:
              defects.forEach((defect) => {
                const isInsideRadius = isBetweenRadius(
                  { x: defect.x, y: defect.y },
                  center,
                  startRadiusSquared,
                  endRadiusSquared
                );
                if (isInsideRadius) {
                  defectGraphics.beginFill(defect.color);
                  defectGraphics.drawCircle(defect.x, defect.y, defectDiameter);
                  defectGraphics.endFill();
                  defectCounter++;
                }
              });
              break;
            case shapes.circleSector:
              defects.forEach((defect) => {
                const isInside = isInsideSector(
                  { x: defect.x, y: defect.y },
                  center,
                  sectorStart,
                  sectorEnd,
                  endRadiusSquared
                );
                if (isInside) {
                  defectGraphics.beginFill(defect.color);
                  defectGraphics.drawCircle(defect.x, defect.y, defectDiameter);
                  defectGraphics.endFill();
                  defectCounter++;
                }
              });
              break;
            case shapes.partialCircleSector:
              defects.forEach((defect) => {
                const isInsideRadius = isBetweenRadius(
                  { x: defect.x, y: defect.y },
                  center,
                  startRadiusSquared,
                  endRadiusSquared
                );
                const isInside = isInsideSector(
                  { x: defect.x, y: defect.y },
                  center,
                  sectorStart,
                  sectorEnd,
                  endRadiusSquared
                );
                if (isInside && isInsideRadius) {
                  defectGraphics.beginFill(defect.color);
                  defectGraphics.drawCircle(defect.x, defect.y, defectDiameter);
                  defectGraphics.endFill();
                  defectCounter++;
                }
              });
              break;
          }
        });
        break;
      case selectionType.none:
        // wafer area fulliy unselected. no need to render defects.
        break;
    }

    setDefectCount({
      total: defects.length,
      visible: defectCounter,
      hidden: defects.length - defectCounter,
    });
    stage.current.addChild(defectGraphics);
    renderer.current.render(stage.current);
  };

  const isBetweenRadius = (p, center, fromRadiusSquared, toRadiusSquared) => {
    const x = Math.pow(p.x - center.x, 2);
    const y = Math.pow(p.y - center.y, 2);
    const isGreaterThanFromRadius = x + y > fromRadiusSquared;
    const isLessThanToRadius = x + y < toRadiusSquared;

    return isGreaterThanFromRadius && isLessThanToRadius;
  };

  const isInsideSector = (
    point,
    center,
    sectorStart,
    sectorEnd,
    radiusSquared
  ) => {
    const relPoint = {
      x: point.x - center.x,
      y: point.y - center.y,
    };

    return (
      !areClockwise(sectorStart, relPoint) &&
      areClockwise(sectorEnd, relPoint) &&
      isWithinRadius(relPoint, radiusSquared)
    );
  };

  const areClockwise = (v1, v2) => {
    return -v1.x * v2.y + v1.y * v2.x > 0;
  };

  const isWithinRadius = (v, radiusSquared) => {
    return v.x * v.x + v.y * v.y <= radiusSquared;
  };

  return (
    <div>
      <div className={classes.waferLabelLeft}>
        <Typography
          className={classes.label}
        >{`Total defect count - ${defectCount.total}`}</Typography>
        <Typography
          className={classes.label}
        >{`Visible defect count - ${defectCount.visible}`}</Typography>
        <Typography
          className={classes.label}
        >{`Hidden defect count - ${defectCount.hidden}`}</Typography>
      </div>
      <div className={classes.waferLabelRight}>
        <Typography className={classes.label}>{`Scale - ${scale}`}</Typography>
        <Typography
          className={classes.label}
        >{`Die count - ${dieCount}`}</Typography>
        <Typography
          className={classes.label}
        >{`Die pitch X - ${diePitch.width} mm`}</Typography>
        <Typography
          className={classes.label}
        >{`Die pitch Y - ${diePitch.height} mm`}</Typography>
      </div>
      <div ref={rootRef} />
    </div>
  );
};

export default Wafer;
