import * as PIXI from "pixi.js";
import { useRef, useEffect, useState } from "react";
import {
  getRandomColor,
  inside,
  removeEmptyRows,
  randomNumber,
} from "../../utils";
import { Typography } from "@material-ui/core";
import { useStyles } from "./style";

const Wafer = (props) => {
  const canvasSize = 600;
  const scale = 1.9;
  const waferRadius = 150;
  const maxDefectsInDie = 3;
  const { doReset } = props;

  const diePitch = {
    height: 10,
    width: 10,
  };

  const classes = useStyles();
  const stage = useRef();
  const rootRef = useRef();
  const renderer = useRef();
  const [dieCount, setDieCount] = useState(0);
  const [defectCount, setDefectCount] = useState(0);

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
  }, [doReset]);

  const draw = () => {
    const center = canvasSize / 2;
    stage.current = new PIXI.Container(0x000000, true);
    stage.current.scale.set(scale);
    stage.current.position.set(center, center);
    stage.current.pivot.set(center, center);

    const circle = new PIXI.Graphics();
    circle.beginFill(0xffffff);
    circle.drawCircle(center, center, waferRadius);
    circle.endFill();
    stage.current.addChild(circle);

    // draw wafer grid lines
    const waferCenter = { x: 300, y: 300 };
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
      const defects = [];
      const dies = removeEmptyRows(dieIndexes);

      const gridLines = new PIXI.Graphics();
      gridLines.lineStyle(0.28, 0x3d3d3d, 0.5);
      dies.forEach((row) => {
        row.forEach((die) => {
          if (die !== undefined) {
            const dx = die["dx"];
            const dy = die["dy"];
            if (dx !== undefined && dy !== undefined) {
              gridLines.drawRect(dx, dy, diePitch.width, diePitch.height);
              dieCounter++;

              // generate defects for a die based on maxDefects
              const maxDefects = randomNumber(0, maxDefectsInDie, true);
              let defectCounter = 0;
              while (defectCounter < maxDefects) {
                const defectX = randomNumber(1, diePitch.width);
                const defectY = randomNumber(1, diePitch.height);
                defects.push({ x: dx + defectX, y: dy + defectY });
                defectCounter++;
              }
            }
          }
        });
      });
      gridLines.endFill();

      const defectGraphics = new PIXI.Graphics();
      defects.forEach((defect) => {
        const color = getRandomColor();
        defectGraphics.beginFill(color);
        defectGraphics.drawCircle(defect.x, defect.y, 2);
        defectGraphics.endFill();
      });

      setDieCount(dieCounter);
      setDefectCount(defects.length);

      stage.current.addChild(gridLines);
      stage.current.addChild(defectGraphics);
      renderer.current.render(stage.current);
    });
  };

  const getDies = (dieInfo, center) => {
    const { topLeftX, topLeftY, rightBottomX, rightBottomY, diePitch } =
      dieInfo;
    const dieHeight = diePitch.height;
    const dieWidth = diePitch.width;

    const promise = new Promise((resolve, reject) => {
      let dieIndexes = [];
      let x = 0;
      let y = 0;
      setTimeout(() => {
        for (let dy = topLeftY; dy < rightBottomY; dy += dieHeight) {
          dieIndexes[y] = [];
          for (let dx = topLeftX; dx < rightBottomX; dx += dieWidth) {
            if (
              inside(
                dx,
                dy,
                dieWidth,
                dieHeight,
                center.x,
                center.y,
                waferRadius
              )
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
      <div className={classes.waferLabel}>
        <Typography className={classes.label}>{`Scale - ${scale}`}</Typography>
        <Typography
          className={classes.label}
        >{`Die count - ${dieCount}`}</Typography>
        <Typography
          className={classes.label}
        >{`Defect count - ${defectCount}`}</Typography>
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
