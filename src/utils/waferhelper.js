import {
  inside,
  removeEmptyRows,
  randomNumber,
  randomDecimal,
  getRandomColor,
  degreeToRadian,
  isPrimeNumber,
  convertNmToMm,
} from "./";
import { selectionType, shapes } from "../appsettings";

export const rotate2D = (x, y, cx, cy, radian) => {
  const xp = (x - cx) * Math.cos(radian) - (y - cy) * Math.sin(radian) + cx;
  const yp = (x - cx) * Math.sin(radian) + (y - cy) * Math.cos(radian) + cy;

  return { x: xp, y: yp };
};

export const filterDefectsByArea = (selectionArea, canvasSize, defects) => {
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
        const start = degreeToRadian(360 - area.angle?.to);
        const end = degreeToRadian(360 - area.angle?.from);
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

export const generateDiesAndDefects2 = (
  canvasSize,
  waferRadius,
  diePitch,
  dieOrigin
) => {
  const dies = [];
  const center = {
    x: canvasSize / 2,
    y: canvasSize / 2,
  };
  const dieWidth = diePitch.width;
  const dieHeight = diePitch.height;
  const doEnableDie = diePitch.width === waferRadius * 2;
  const maxY = Math.floor(waferRadius / dieHeight);
  const maxX = Math.floor(waferRadius / dieWidth);

  // top right quadrant
  for (let y = 1; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      const dx = center.x + x * dieWidth - dieOrigin.x;
      const dy = center.y - y * dieHeight - dieOrigin.y;
      if (
        inside(dx, dy, dieWidth, dieHeight, center.x, center.y, waferRadius) ||
        doEnableDie
      ) {
        dies.push({ dx, dy, xIndex: x, yIndex: y - 1 });
      }
    }
  }

  // top left quadrant
  for (let y = 1; y <= maxY; y++) {
    for (let x = 1; x <= maxX; x++) {
      const dx = center.x - x * dieWidth - dieOrigin.x;
      const dy = center.y - y * dieHeight - dieOrigin.y;
      if (
        inside(dx, dy, dieWidth, dieHeight, center.x, center.y, waferRadius) ||
        doEnableDie
      ) {
        dies.push({ dx, dy, xIndex: -x, yIndex: y - 1 });
      }
    }
  }

  // bottom right quadrant
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      const dx = center.x + x * dieWidth - dieOrigin.x;
      const dy = center.y + y * dieHeight - dieOrigin.y;
      if (
        inside(dx, dy, dieWidth, dieHeight, center.x, center.y, waferRadius) ||
        doEnableDie
      ) {
        dies.push({ dx, dy, xIndex: x, yIndex: -y - 1 });
      }
    }
  }

  // bottom right quadrant
  for (let y = 0; y <= maxY; y++) {
    for (let x = 1; x <= maxX; x++) {
      const dx = center.x - x * dieWidth - dieOrigin.x;
      const dy = center.y + y * dieHeight - dieOrigin.y;
      if (
        inside(dx, dy, dieWidth, dieHeight, center.x, center.y, waferRadius) ||
        doEnableDie
      ) {
        dies.push({ dx, dy, xIndex: -x, yIndex: -y - 1 });
      }
    }
  }

  return [dies, []];
};

export const generateDiesAndDefects = (
  canvasSize,
  waferRadius,
  defectRadius,
  maxDefectsInDie,
  diePitch,
  enablePrimeNumberCheckOnDieIndex = false
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

  const dieIndexes = getGridIndexes(dieInfo, waferCenter, waferRadius);
  let dieCount = 0;
  const defectData = [];
  const dieData = removeEmptyRows(dieIndexes);
  const radius = waferRadius - 5; // draw defects within margin of wafer radius

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
          let doReduce = true;
          if (enablePrimeNumberCheckOnDieIndex) {
            // check if die count is prime number (reduce number of defects being generated)
            doReduce = isPrimeNumber(dieCount);
          }
          while (defectCounter < maxDefects && doReduce) {
            const x = randomDecimal(0, diePitch.width);
            const y = randomDecimal(0, diePitch.height);
            const defectDx = x + dx;
            const defectDy = y + dy;
            // check if defect is with in wafer circle.
            const isInside = inside(
              defectDx,
              defectDy,
              defectRadius,
              defectRadius,
              waferCenter.x,
              waferCenter.y,
              radius
            );
            if (isInside) {
              defectData.push({
                x: defectDx,
                y: defectDy,
                xRel: x,
                yRel: y,
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

const getGridIndexes = (dieInfo, center, waferRadius) => {
  const { topLeftX, topLeftY, rightBottomX, rightBottomY, diePitch } = dieInfo;
  let height = diePitch.height;
  let width = diePitch.width;
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
