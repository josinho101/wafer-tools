import { convertNmToMm, convertMicroMeterToMm } from "../../utils";

export const getDefects = () => {
  const defects1 = [
    { xIndex: 1, yIndex: 1, xRel: 4125000, yRel: 2725269, color: 0x8546e3 },
    { xIndex: 3, yIndex: 5, xRel: 6825600, yRel: 7725169, color: 0x8546e3 },
    { xIndex: -4, yIndex: 7, xRel: 6525600, yRel: 4726169, color: 0x8546e3 },
  ];
  const defects2 = [
    { xIndex: 1, yIndex: 1, xRel: 7125000, yRel: 2725269, color: 0xff0000 },
    { xIndex: 3, yIndex: 5, xRel: 8525600, yRel: 7725169, color: 0xff0000 },
    { xIndex: -4, yIndex: 7, xRel: 8025600, yRel: 4726169, color: 0xff0000 },
    { xIndex: -4, yIndex: -4, xRel: 2527600, yRel: 2826169, color: 0xff0000 },
  ];
  const defects3 = [
    { xIndex: 1, yIndex: 1, xRel: 4125000, yRel: 1725269, color: 0x0652ed },
    { xIndex: 3, yIndex: 5, xRel: 3525600, yRel: 8725169, color: 0x0652ed },
    { xIndex: -4, yIndex: 7, xRel: 6525600, yRel: 2726169, color: 0x0652ed },
    { xIndex: -4, yIndex: -4, xRel: 7527600, yRel: 9826169, color: 0x0652ed },
    { xIndex: 5, yIndex: -4, xRel: 3227500, yRel: 5726169, color: 0x0652ed },
  ];
  const defects4 = [
    { xIndex: 1, yIndex: 1, xRel: 4125000, yRel: 2725269, color: 0xff00f7 },
    { xIndex: 1, yIndex: 1, xRel: 9125000, yRel: 9725269, color: 0xff00f7 },
    { xIndex: 4, yIndex: 5, xRel: 5525600, yRel: 7725169, color: 0xff00f7 },
    { xIndex: -3, yIndex: 7, xRel: 6525600, yRel: 4726169, color: 0xff00f7 },
    { xIndex: -4, yIndex: 7, xRel: 6525600, yRel: 4726169, color: 0xff00f7 },
    { xIndex: -4, yIndex: -4, xRel: 7527600, yRel: 4826169, color: 0xff00f7 },
    { xIndex: 6, yIndex: -4, xRel: 7227500, yRel: 3726169, color: 0xff00f7 },
    { xIndex: 2, yIndex: -6, xRel: 6827500, yRel: 5366169, color: 0xff00f7 },
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

const getDefectFilter = (defect, die, center, diePitch, tolerance) => {
  const x = die.dx + convertNmToMm(defect.xRel) - center.x;
  const y = die.dy - convertNmToMm(defect.yRel) + diePitch.height - center.y;

  const tLeft = { x: x - tolerance, y: y - tolerance }; // top left
  const tRight = { x: x + tolerance, y: y - tolerance }; // top right
  const bLeft = { x: x - tolerance, y: y + tolerance }; // bottom left
  const bRight = { x: x + tolerance, y: y + tolerance }; // bottom right

  let fromRadius, toRadius, fromAngle, toAngle;

  if (Math.sign(defect.xIndex) >= 0 && Math.sign(defect.yIndex) >= 0) {
    // 1st quadrant
    fromRadius = getRadius(Math.abs(bLeft.x), Math.abs(bLeft.y));
    toRadius = getRadius(Math.abs(tRight.x), Math.abs(tRight.y));
    fromAngle = getAngle(bRight.x, bRight.y);
    toAngle = getAngle(tLeft.x, tLeft.y);
  } else if (Math.sign(defect.xIndex) < 0 && Math.sign(defect.yIndex) >= 0) {
    // 2nd quadrant
    fromRadius = getRadius(Math.abs(bRight.x), Math.abs(bRight.y));
    toRadius = getRadius(Math.abs(tLeft.x), Math.abs(tLeft.y));
    fromAngle = getAngle(tRight.x, tRight.y);
    toAngle = getAngle(bLeft.x, bLeft.y);
  } else if (Math.sign(defect.xIndex) < 0 && Math.sign(defect.yIndex) < 0) {
    // 3rd quadrant
    fromRadius = getRadius(Math.abs(tRight.x), Math.abs(tRight.y));
    toRadius = getRadius(Math.abs(bLeft.x), Math.abs(bLeft.y));
    fromAngle = getAngle(tLeft.x, tLeft.y);
    toAngle = getAngle(bRight.x, bRight.y);
  } else if (Math.sign(defect.xIndex) >= 0 && Math.sign(defect.yIndex) < 0) {
    // 4th quadrant
    fromRadius = getRadius(Math.abs(tLeft.x), Math.abs(tLeft.y));
    toRadius = getRadius(Math.abs(bRight.x), Math.abs(bRight.y));
    fromAngle = getAngle(bLeft.x, bLeft.y);
    toAngle = getAngle(tRight.x, tRight.y);
  }

  return { fromRadius, toRadius, fromAngle, toAngle };
};

export const updateAdderDefects = (
  wafers,
  tolerance,
  dies,
  canvasSize,
  diePitch
) => {
  if (!wafers.length) return [];

  const center = {
    x: canvasSize / 2,
    y: canvasSize / 2,
  };

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
      const radius = getRadius(Math.abs(x), Math.abs(y)); // r = √(x^2 + y^2)
      const angle = getAngle(x, y); // for better understanding converting radian to angle. No need in real application.

      defect.radius = radius;
      defect.angle = angle;

      const x1 = die.dx + convertNmToMm(defect.xRel) - center.x;
      const y1 =
        die.dy - convertNmToMm(defect.yRel) + diePitch.height - center.y;

      defect.x = x1;
      defect.y = y1;
    });

    // sort defects based on radius and angle
    wafer.defects.sort((a, b) =>
      a.radius === b.radius ? a.angle - b.angle : a.radius - b.radius
    );
  });

  console.log(wafers);

  // if we have only one wafer then all defects will be considered as adder defect.
  if (wafers.length === 1) {
    wafers[0].defects.forEach((defect) => {
      defect.adder = true;
    });

    return wafers[0].defects;
  } else {
    // Sort wafers based on "result timestamp of test results".
    wafers.sort((a, b) => a.order - b.order); // for PoC soring with order

    // get last inspection result based on result timestamp
    const lastResult = wafers[wafers.length - 1];
    const remainingResults = wafers.slice(0, wafers.length - 1);
    tolerance = convertMicroMeterToMm(tolerance);

    // get all defects from other processes.
    const remainingDefects = [];
    remainingResults.forEach((wafer) => {
      remainingDefects.push(...wafer.defects);
    });

    lastResult.defects.forEach((defect) => {
      const die = dies.filter(
        (die) => die.xIndex === defect.xIndex && die.yIndex === defect.yIndex
      )[0];

      const x1Rel = convertNmToMm(defect.xRel);
      const y1Rel = convertNmToMm(defect.yRel);
      const x1 = Math.abs(die.dx + x1Rel - center.x);
      const y1 = die.dy - Math.abs(y1Rel + diePitch.height - center.y);

      console.log(
        `Current defect - xIndex:${defect.xIndex}, yIndex:${defect.yIndex}, Radius:${defect.radius}, Angle:${defect.angle},`
      );

      const filtered = remainingDefects.filter((d) => {
        const die = dies.filter(
          (die) => die.xIndex === d.xIndex && die.yIndex === d.yIndex
        )[0];
        const x2Rel = convertNmToMm(d.xRel);
        const y2Rel = convertNmToMm(d.yRel);
        const x2 = Math.abs(die.dx + x2Rel - center.x);
        const y2 = die.dy - Math.abs(y2Rel + diePitch.height - center.y);

        const dx = Math.pow(x2 - x1, 2);
        const dy = Math.pow(y2 - y1, 2);
        const distance = Math.sqrt(dx + dy);
        d.distance = distance;
        console.log(distance);
        return distance <= tolerance;
      });

      // if we cant find any other defect close to original defect
      // within tolerance, mark this defect as adder defect.
      if (!filtered.length) {
        defect.adder = true;
      } else {
        // find a closest defect to the origial defect. that will the cary-over for that defect.
        filtered.sort((a, b) => a.distance - b.distance); // sort filtered items by distance desc and get first item.
      }

      console.log("Filtered defects:", filtered);
    });

    console.log("**************************");

    return lastResult.defects;
  }
};
