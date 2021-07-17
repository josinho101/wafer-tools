import * as PIXI from "pixi.js";
import { useRef, useEffect, useState } from "react";
import {
  getRandomColor,
  inside,
  removeEmptyRows,
  randomNumber,
  degreeToRadian,
} from "../../utils";
import { Typography } from "@material-ui/core";
import { useStyles } from "./style";
import { selectionType } from "../../appsettings";

const Wafer = (props) => {
  const {
    doReset,
    radiusDivision,
    angleDivision,
    circumference,
    selectionArea,
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
  const [dies, setDies] = useState([]);
  const [defects, setDefects] = useState([]);

  const canvasSize = 600;
  const scale = 1.7;
  const waferRadius = 150;
  const maxDefectsInDie = 50;
  const diePitch = {
    height: 10,
    width: 10,
  };

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
    generateDiesAndDefects();
  }, [doReset]);

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

    // draw die grid lines
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
          }
        }
      });
    });
    gridLines.endFill();
    stage.current.addChild(gridLines);

    console.log(selectionArea);
    // draw wafer defects
    let defectCounter = 0;
    const defectGraphics = new PIXI.Graphics();
    switch (selectionArea.selectionType) {
      case selectionType.full:
        // render full defects!!
        defects.forEach((defect) => {
          defectGraphics.beginFill(defect.color);
          defectGraphics.drawCircle(defect.x, defect.y, 1);
          defectGraphics.endFill();
          defectCounter++;
        });
        break;
      case selectionType.partial:
        // render defects based on the selection made in area selector
        selectionArea.areas.forEach((sector) => {
          const start = degreeToRadian(360 - sector.angle - angleDivision);
          const end = degreeToRadian(360 - sector.angle);
          const center = { x: canvasSize / 2, y: canvasSize / 2 };
          const sectorStart = { x: Math.cos(start), y: Math.sin(start) };
          const sectorEnd = { x: Math.cos(end), y: Math.sin(end) };
          const startRadiusSquared = Math.pow(sector.radius, 2);
          const endRadiusSquared = Math.pow(sector.radius + radiusDivision, 2);

          if (radiusDivision === 0 && angleDivision !== 0) {
            // no radius division selected! check for sectors with radius as wafer radius
            const radiusSquared = Math.pow(waferRadius, 2);
            defects.forEach((defect) => {
              const isInside = isInsideSector(
                { x: defect.x, y: defect.y },
                center,
                sectorStart,
                sectorEnd,
                radiusSquared
              );
              if (isInside) {
                defectGraphics.beginFill(defect.color);
                defectGraphics.drawCircle(defect.x, defect.y, 1);
                defectGraphics.endFill();
                defectCounter++;
              }
            });
          } else if (angleDivision === 0 && radiusDivision !== 0) {
            // no angle division. check if defects is between radius
            defects.forEach((defect) => {
              const isInsideRadius = isBetweenRadius(
                { x: defect.x, y: defect.y },
                center,
                startRadiusSquared,
                endRadiusSquared
              );
              if (isInsideRadius) {
                defectGraphics.beginFill(defect.color);
                defectGraphics.drawCircle(defect.x, defect.y, 1);
                defectGraphics.endFill();
                defectCounter++;
              }
            });
          } else {
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
                defectGraphics.drawCircle(defect.x, defect.y, 1);
                defectGraphics.endFill();
                defectCounter++;
              }
            });
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

  const generateDiesAndDefects = () => {
    // draw wafer grid lines
    const waferCenter = { x: canvasSize / 2, y: canvasSize / 2 };
    const topLeftX = waferCenter.x - waferRadius;
    const topLeftY = waferCenter.y - waferRadius;
    const rightBottomX = waferCenter.x + waferRadius;
    const rightBottomY = waferCenter.y + waferRadius;

    const dieInfo = {
      topLeftX,
      topLeftY,
      rightBottomX,
      rightBottomY,
      diePitch,
    };

    getDies(dieInfo, waferCenter).then((dieIndexes) => {
      let dieCounter = 0;
      const defectData = [];
      const dieData = removeEmptyRows(dieIndexes);

      dieData.forEach((row) => {
        row.forEach((die) => {
          if (die !== undefined) {
            const dx = die["dx"];
            const dy = die["dy"];
            if (dx !== undefined && dy !== undefined) {
              dieCounter++;

              // generate defects for a die based on maxDefects
              const maxDefects = randomNumber(0, maxDefectsInDie, true);
              let defectCounter = 0;
              while (defectCounter < maxDefects) {
                const defectX = randomNumber(1, diePitch.width);
                const defectY = randomNumber(1, diePitch.height);
                defectData.push({
                  x: dx + defectX,
                  y: dy + defectY,
                  color: getRandomColor(),
                });
                defectCounter++;
              }
            }
          }
        });
      });

      setDies(dieData);
      setDefects(defectData);
      setDieCount(dieCounter);
    });
  };

  const getDies = (dieInfo, center) => {
    const { topLeftX, topLeftY, rightBottomX, rightBottomY, diePitch } =
      dieInfo;
    const height = diePitch.height;
    const width = diePitch.width;

    const promise = new Promise((resolve, reject) => {
      let dieIndexes = [];
      let x = 0;
      let y = 0;
      setTimeout(() => {
        for (let dy = topLeftY; dy < rightBottomY; dy += height) {
          dieIndexes[y] = [];
          for (let dx = topLeftX; dx < rightBottomX; dx += width) {
            if (
              inside(dx, dy, width, height, center.x, center.y, waferRadius)
            ) {
              dieIndexes[y][x] = { x, y, dx, dy };
            } else {
              dieIndexes[y][x] = 0;
            }
            x++;
          }
          y++;
          x = 0;
        }
        resolve(dieIndexes);
      }, 0);
    });

    return promise;
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
