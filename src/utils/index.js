export const getRandomColor = () => {
  let letters = "0123456789ABCDEF";
  let color = "0x";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const inside = (x, y, w, h, cx, cy, r) => {
  let r2 = r * r;
  return (
    dist(x, y, cx, cy) < r2 &&
    dist(x + w, y, cx, cy) < r2 &&
    dist(x, y + h, cx, cy) < r2 &&
    dist(x + w, y + h, cx, cy) < r2
  );
};

const dist = (x, y, cx, cy) => {
  return (x - cx) * (x - cx) + (y - cy) * (y - cy);
};

export const removeEmptyRows = (array) => {
  const newArray = array.map((row) => row.filter((col) => col !== 0 && col));
  return newArray.filter((row) => row.length > 0);
};

export const randomNumber = (min, max, includeZero) => {
  if (includeZero) {
    return Math.floor(Math.random() * max);
  }

  return Math.random() * (max - min) + min;
};

export const degreeToRadian = (angle) => +(angle * (Math.PI / 180));

export const uuid = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

export const convertNmToMm = (nanoMeter) => nanoMeter / 1000000;
