import {
  inside,
  removeEmptyRows,
  randomNumber,
  getRandomColor,
  degreeToRadian,
} from "./";
import { selectionType, shapes } from "../appsettings";

export const rotate2D = (x, y, cx, cy, radian) => {
  const xp = (x - cx) * Math.cos(radian) - (y - cy) * Math.sin(radian) + cx;
  const yp = (x - cx) * Math.sin(radian) + (y - cy) * Math.cos(radian) + cy;

  return { x: xp, y: yp };
};

export const filterDefectsByArea = (
  selectionArea,
  canvasSize,
  defects,
  angleDivision
) => {
  let filteredDefects = [];
  switch (selectionArea.selectionType) {
    case selectionType.full:
      // render full defects!!
      filteredDefects = defects;
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
                filteredDefects.push(defect);
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
                filteredDefects.push(defect);
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
                filteredDefects.push(defect);
              }
            });
            break;
        }
      });
      break;
    case selectionType.none:
    default:
      // wafer area fully unselected. no need to render defects.
      filteredDefects = [];
      break;
  }

  return filteredDefects;
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

export const generateDiesAndDefects = (
  canvasSize,
  waferRadius,
  defectRadius,
  maxDefectsInDie,
  diePitch
) => {
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

  const dieIndexes = getDies(dieInfo, waferCenter, waferRadius);
  let dieCount = 0;
  const defectData = [];
  const dieData = removeEmptyRows(dieIndexes);

  const center = {
    x: canvasSize / 2,
    y: canvasSize / 2,
  };
  const r = waferRadius - 5;

  dieData.forEach((row) => {
    row.forEach((die) => {
      if (die !== undefined) {
        const dx = die["dx"];
        const dy = die["dy"];
        if (dx !== undefined && dy !== undefined) {
          dieCount++;
          // generate defects for a die based on maxDefects
          const maxDefects = randomNumber(0, maxDefectsInDie, true);
          let defectCounter = 0;
          while (defectCounter < maxDefects) {
            const x = randomNumber(1, diePitch.width) + dx;
            const y = randomNumber(1, diePitch.height) + dy;
            // check if defect is with in wafer circle. defect width & height to be 1 X 1
            const isInside = inside(
              x,
              y,
              defectRadius,
              defectRadius,
              center.x,
              center.y,
              r
            );
            if (isInside) {
              defectData.push({
                x: x,
                y: y,
                color: getRandomColor(),
              });
              defectCounter++;
            }
          }
        }
      }
    });
  });

  return [dieData, defectData, dieCount];
};

const getDies = (dieInfo, center, waferRadius) => {
  const { topLeftX, topLeftY, rightBottomX, rightBottomY, diePitch } = dieInfo;
  const height = diePitch.height;
  const width = diePitch.width;

  let dieIndexes = [];
  let x = 0;
  let y = 0;
  const doEnableDie = diePitch.width === waferRadius * 2;

  for (let dy = topLeftY; dy < rightBottomY; dy += height) {
    dieIndexes[y] = [];
    for (let dx = topLeftX; dx < rightBottomX; dx += width) {
      if (
        inside(dx, dy, width, height, center.x, center.y, waferRadius) ||
        doEnableDie
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

  return dieIndexes;
};
