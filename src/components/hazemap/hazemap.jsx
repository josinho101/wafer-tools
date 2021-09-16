import * as PIXI from "pixi.js";
import { useRef, useEffect } from "react";
import { convertNmToMm } from "../../utils";
import { hazeData } from "./hazedata";

const HazeMap = (props) => {
  const { greyScale, scale = 1, canvasSize = 300, radius = 150 } = props;

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
  }, [greyScale]);

  const draw = () => {
    const center = canvasSize / 2;
    stage.current = new PIXI.Container(0x000000, true);
    stage.current.scale.set(scale);
    stage.current.position.set(center, center);
    stage.current.pivot.set(center, center);

    // draw wafer circle
    const circle = new PIXI.Graphics();
    circle.beginFill(0xffffff);
    circle.drawCircle(center, center, radius);
    circle.endFill();
    stage.current.addChild(circle);

    const colors = [
      0x000000, 0xf6e3f6, 0xff0000, 0xc95caa, 0xeac6ec, 0x3338c1, 0x60b0ea,
      0xcbf99f, 0xf8f59f, 0xe5c091, 0xeaada7, 0xa2f5e9, 0x80dffb, 0x5feebe,
      0x80ebd2, 0xffffff,
    ];

    /*const colors = [
      0x000000, 0x5f54ff, 0x58caff, 0x64f1ff, 0xa4fefe, 0x4cffcb, 0x20ff7f,
      0xc1ff42, 0xfaff51, 0xffba6e, 0xff9da6, 0xff0000, 0xff46dd, 0xf79bff,
      0xffe1ff, 0xffffff,
    ];*/

    const HazeHeader = [
      7, 13, 19, 25, 31, 38, 44, 50, 57, 63, 69, 75, 82, 88, 94, 101, 106, 113,
      119, 126, 132, 138, 144, 151, 157, 163, 170, 176, 182, 188, 194, 201, 207,
      213, 219, 226, 232, 239, 245, 252, 258, 263, 270, 277, 283, 289, 295, 301,
      308, 314, 320, 327, 333, 339, 345, 351, 358, 364, 370, 377, 383, 390, 396,
      402, 408, 415, 420, 427, 433, 439, 446, 452, 458, 465, 471, 477, 483, 490,
      496, 502, 508, 515, 521, 527, 534, 540, 546, 552, 559, 565, 571, 578, 584,
      590, 596, 603, 609, 615, 622, 628, 634, 640, 647, 653, 659, 665, 672, 679,
      685, 691, 698, 704, 710, 716, 723, 729, 735, 742, 748, 754, 760, 767, 773,
      779, 785, 791, 798, 804, 810, 816, 823, 829, 835, 842, 848, 854, 860, 867,
      873, 879, 885, 892,
    ];

    const LastR = 142;
    const HG_Size = 1050;
    const HazeROffset = 0;
    const divt = 226800 * 16;
    const angl_of = 0;
    const sem_angl = 0;
    const HCH_MAX = 16;
    const NR_MODE = 0;
    const NR_BIT_SHIFT = 0;
    const EnMode = 0; // get from binary file

    let hazeDataIndex = 0;
    let iBitShift = 0;

    if (NR_MODE == EnMode) {
      iBitShift = NR_BIT_SHIFT;
    }

    const pointGraphics = new PIXI.Graphics();
    if (greyScale) {
      const colorMatrix = new PIXI.filters.ColorMatrixFilter();
      pointGraphics.filters = [colorMatrix];
      colorMatrix.greyscale(0.37);
    }

    for (let li = 0; li < LastR; li++) {
      const Pos_R = (li + HazeROffset) * HG_Size;
      const Div_T = divt / HazeHeader[li];

      for (let i = 0; i < HazeHeader[li]; i++) {
        const Pos_T = ((i * Div_T) / divt) * 2 * Math.PI;

        const data = hazeData[hazeDataIndex];
        const ch = colors[data % 16];
        hazeDataIndex++;

        let x = (Pos_R / 1000) * Math.cos(Pos_T + sem_angl - angl_of);
        let y = (Pos_R / 1000) * Math.sin(Pos_T + sem_angl - angl_of);

        x = x ? x : 0;
        y = y ? y : 0;

        // add radius to x and y points
        x += 150;
        y += 150;

        pointGraphics.beginFill(ch);
        pointGraphics.drawRect(x, y, 1, 1);
        // pointGraphics.drawCircle(x, y, 1);
        pointGraphics.endFill();
      }
    }

    stage.current.addChild(pointGraphics);

    renderer.current.render(stage.current);
  };

  return <div ref={rootRef} />;
};

export default HazeMap;
