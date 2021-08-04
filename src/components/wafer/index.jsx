import * as PIXI from "pixi.js";
import { useRef, useEffect } from "react";
import { colors, waferViews } from "../../appsettings";

const Wafer = (props) => {
  const {
    diePitch,
    scale = 1,
    showQuadrants,
    defectDiameter = 1,
    dies = [],
    defects = [],
    canvasSize = 300,
    waferRadius = 150,
    view = waferViews.die,
  } = props;

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
  }, [dies, defects, view]);

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

    // draw grid lines based on wafer view
    if (view !== waferViews.none) {
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

              // draw chips based on dimension
              if (view === waferViews.chip) {
                const maxColumns = diePitch.width / diePitch.chip.width;
                const maxRows = diePitch.height / diePitch.chip.height;

                for (let i = 0; i < maxColumns; i++) {
                  for (let j = 0; j < maxRows; j++) {
                    gridLines.drawRect(
                      die["dx"] + i * diePitch.chip.width,
                      die["dy"] + j * diePitch.chip.height,
                      diePitch.chip.width,
                      diePitch.chip.height
                    );
                  }
                }
              }
            }
          }
        });
      });
      gridLines.endFill();
      stage.current.addChild(gridLines);
    }

    // draw wafer defects
    const defectGraphics = new PIXI.Graphics();
    defects.forEach((defect) => {
      defectGraphics.beginFill(defect.color);
      defectGraphics.drawCircle(defect.x, defect.y, defectDiameter);
      defectGraphics.endFill();
    });
    stage.current.addChild(defectGraphics);

    renderer.current.render(stage.current);
  };

  return <div ref={rootRef} />;
};

export default Wafer;
