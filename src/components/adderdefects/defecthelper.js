import { convertNmToMm, radianToDegree } from "../../utils";

export const getDefects = () => {
  const defects1 = [
    { xIndex: 1, yIndex: 1, xRel: 2125000, yRel: 2725269, color: 0xed068e },
    { xIndex: 3, yIndex: 5, xRel: 5525600, yRel: 7725169, color: 0xed068e },
    { xIndex: -4, yIndex: 7, xRel: 6525600, yRel: 4726169, color: 0xed068e },
    // { xIndex: 8, yIndex: 3, xRel: 0, yRel: 15000000, color: 0xed068e },
    //{ xIndex: -6, yIndex: -6, xRel: 0, yRel: 0, color: 0xed068e },
  ];
  // const defects2 = [
  //   { xIndex: 1, yIndex: 1, xRel: 3125000, yRel: 4725269, color: 0x02a102 },
  //   { xIndex: 3, yIndex: 5, xRel: 6525600, yRel: 6725169, color: 0x02a102 },
  //   { xIndex: -4, yIndex: 7, xRel: 3525600, yRel: 2726169, color: 0x02a102 },
  //   { xIndex: -4, yIndex: -4, xRel: 2527600, yRel: 2826169, color: 0x02a102 },
  // ];
  const defects2 = [
    { xIndex: 1, yIndex: 1, xRel: 2125000, yRel: 2725269, color: 0x02a102 },
    { xIndex: 3, yIndex: 5, xRel: 5525600, yRel: 7725169, color: 0x02a102 },
    { xIndex: -4, yIndex: 7, xRel: 6525600, yRel: 4726169, color: 0x02a102 },
    { xIndex: -4, yIndex: -4, xRel: 2527600, yRel: 2826169, color: 0x02a102 },
  ];
  const defects3 = [
    { xIndex: 1, yIndex: 1, xRel: 4125000, yRel: 1725269, color: 0x0652ed },
    { xIndex: 3, yIndex: 5, xRel: 3525600, yRel: 8725169, color: 0x0652ed },
    { xIndex: -4, yIndex: 7, xRel: 6525600, yRel: 2726169, color: 0x0652ed },
    { xIndex: -4, yIndex: -4, xRel: 7527600, yRel: 9826169, color: 0x0652ed },
    { xIndex: 5, yIndex: -4, xRel: 3227500, yRel: 5726169, color: 0x0652ed },
  ];
  const defects4 = [
    { xIndex: 1, yIndex: 1, xRel: 9125000, yRel: 9725269, color: 0xe86100 },
    { xIndex: 4, yIndex: 5, xRel: 5525600, yRel: 7725169, color: 0xe86100 },
    { xIndex: -3, yIndex: 7, xRel: 6525600, yRel: 4726169, color: 0xe86100 },
    { xIndex: -4, yIndex: -4, xRel: 7527600, yRel: 4826169, color: 0xe86100 },
    { xIndex: 6, yIndex: -4, xRel: 7227500, yRel: 3726169, color: 0xe86100 },
    { xIndex: 2, yIndex: -6, xRel: 6827500, yRel: 5366169, color: 0xe86100 },
  ];

  return {
    W1P1: { order: 1, defects: defects1 },
    W1P2: { order: 2, defects: defects2 },
    W1P3: { order: 3, defects: defects3 },
    W1P4: { order: 4, defects: defects4 },
  };
};

const getAngle = (x, y) => {
  const radian = Math.atan2(y, x);
  let angle = radian * (180 / Math.PI);
  angle = 360 - (angle <= 0 ? angle + 360 : angle);
  return angle;
};

const getRadius = (x, y) => {
  const xSqrd = Math.pow(x, 2);
  const ySqrd = Math.pow(y, 2);
  const radius = Math.sqrt(xSqrd + ySqrd);
  return radius;
};

export const getAdderDefects = (
  wafers,
  tolerance,
  dies,
  canvasSize,
  diePitch
) => {
  const adderDefects = [];
  const center = {
    x: canvasSize / 2,
    y: canvasSize / 2,
  };

  if (!wafers.length) return;

  // remove ref from base objects
  wafers = JSON.parse(JSON.stringify(wafers));

  // find radius and angle of each defects in wafer.
  // IT SHOULD BE PRECOMPUTED earlier so that we can avoid this step.
  wafers.forEach((wafer) => {
    wafer.defects.forEach((defect) => {
      // find die of this defect to get top left point (dx, dy)
      const die = dies.filter(
        (die) => die.xIndex === defect.xIndex && die.yIndex === defect.yIndex
      )[0];
      const x = die.dx + convertNmToMm(defect.xRel) - center.x;
      const y =
        die.dy - convertNmToMm(defect.yRel) + diePitch.height - center.y;

      // find radius and angle of defect from wafer center.
      const radius = getRadius(x, y); // r = √(x^2 + y^2)
      const angle = getAngle(x, y); // for better understanding converting radian to angle. No need in real application.

      defect.radius = radius;
      defect.angle = angle;
    });

    // sort defects based on radius and angle
    wafer.defects.sort((a, b) =>
      a.radius === b.radius ? a.angle - b.angle : a.radius - b.radius
    );
  });

  // if we have only one wafer then all defects will be considered as adder defect.
  if (wafers.length === 1) {
    wafers[0].defects.forEach((defect) => {
      defect.adder = true;
      adderDefects.push(defect);
    });
  } else {
    // Sort wafers based on "result timestamp of test results".
    wafers.sort((a, b) => a.order - b.order); // for PoC soring with order

    // get last inspection result based on result timestamp
    const lastResult = wafers[wafers.length - 1];
    const remainingResults = wafers.slice(0, wafers.length - 1);
    tolerance = convertNmToMm(tolerance);

    lastResult.defects.forEach((defect) => {
      // get defects with in tolerance limit from other process to check for carry-over
      // find die of this defect to get top left point (dx, dy)
      const die = dies.filter(
        (die) => die.xIndex === defect.xIndex && die.yIndex === defect.yIndex
      )[0];
      const x = die.dx + convertNmToMm(defect.xRel) - center.x;
      const y =
        die.dy - convertNmToMm(defect.yRel) + diePitch.height - center.y;

      // find rectangle coordinates by making defect as center to filter defects of other inspections.
      const topLeft = { x: x - tolerance, y: y - tolerance };
      const topRight = { x: topLeft.x + 2 * tolerance, y: topLeft.y };
      const bottomLeft = { x: topLeft.x, y: topLeft.y + 2 * tolerance };
      const bottomRight = {
        x: topLeft.x + 2 * tolerance,
        y: topLeft.y + 2 * tolerance,
      };

      const angleFilter = {
        start: getAngle(topRight.x, topRight.y),
        end: getAngle(bottomLeft.x, bottomLeft.y),
      };

      // find start and end radius for filtering defects
      const fromRadius = getRadius(topLeft.x, topLeft.y);
      const toRadius = getRadius(bottomRight.x, bottomRight.y);

      console.log(
        `Current defect - xIndex:${defect.xIndex}, yIndex:${defect.yIndex}, Radius:${defect.radius}, Angle:${defect.angle},`
      );
      console.log(`Radius filter - from: ${fromRadius}, to: ${toRadius}`);
      console.log(
        `Angle filter - from: ${angleFilter.start}, to: ${angleFilter.end}`
      );

      remainingResults.forEach((wafer) => {
        const defects = wafer.defects.filter((defect) => {
          return (
            defect.radius >= fromRadius &&
            defect.radius <= toRadius &&
            defect.angle >= angleFilter.start &&
            defect.angle <= angleFilter.end
          );
        });
        if (defects.length) {
          console.log(defects);
        } else {
          console.log(wafer.defects);
        }
        // wafer.defects.forEach((defect) => {
        //   console.log(
        //     `xIndex:${defect.xIndex}, yIndex:${defect.yIndex}, Radius:${defect.radius}, Angle:${defect.angle},`
        //   );
        // });
      });

      // console.log("Radius filter from:", fromRadius);
      // console.log("Radius filter to:", toRadius);
      // console.log("Angle filter:", angleFilter.start, angleFilter.end);
      // console.log(
      //   "defect radius:",
      //   defect.radius,
      //   "defect angle:",
      //   defect.angle
      // );
      console.log("**********************");
    });
  }

  return adderDefects;
};
