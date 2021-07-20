import { inside, removeEmptyRows, randomNumber, getRandomColor } from "./";

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

  return [dieData, defectData];
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
