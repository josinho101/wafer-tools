import clsx from "clsx";
import { Paper, Grid } from "@material-ui/core";
import Wafer from "../wafer";
import { useStyles } from "./style";
import { useState, useEffect } from "react";
import WaferAreaSelector from "./selector";
import WaferAreaForm from "./form";
import { selectionType } from "../../appsettings";
import { generateDiesAndDefects } from "../../utils/waferhelper";

const WaferArea = () => {
  const classes = useStyles();
  const scale = 1.7;
  const waferRadius = 150;
  const waferDiameter = waferRadius * 2;
  const defectDiameter = 1;
  const maxDefectsInDie = 50;
  const canvasSize = waferRadius * 2 * scale;
  const diePitch = {
    height: 10,
    width: 10,
  };

  const [doReset, setDoReset] = useState(0);
  const [dies, setDies] = useState([]);
  const [defects, setDefects] = useState([]);
  const [waferAreaOptions, setWaferAreaOptions] = useState({
    radius: 0,
    angle: 0,
    circumference: 0,
    doInvert: false,
  });
  const [selectionArea, setSelectionArea] = useState({
    selectionType: selectionType.full,
    areas: [],
  });

  useEffect(() => {
    const [dies, defects] = generateDiesAndDefects(
      canvasSize,
      waferRadius,
      defectDiameter,
      maxDefectsInDie,
      diePitch
    );
    setDies(dies);
    setDefects(defects);
  }, [doReset, canvasSize]);

  const onWaferAreaOptionChanged = (options) => {
    setWaferAreaOptions(options);
  };

  const onReset = (value) => {
    setDoReset(value);
    setSelectionArea({
      selectionType: selectionType.full,
      areas: [],
    });
  };

  const onSelectionChanged = (areas) => {
    setSelectionArea(areas);
  };

  return (
    <Grid container className={classes.container}>
      <Grid item xs={5}>
        <Paper className={classes.paper}>
          <WaferAreaForm
            onReset={onReset}
            waferDiameter={waferDiameter}
            onSelectionChange={onWaferAreaOptionChanged}
          />
          <WaferAreaSelector
            doReset={doReset}
            waferDiameter={waferDiameter}
            radiusDivision={waferAreaOptions.radius}
            angleDivision={waferAreaOptions.angle}
            circumference={waferAreaOptions.circumference}
            doInvert={waferAreaOptions.doInvert}
            onSelectionChanged={onSelectionChanged}
          />
        </Paper>
      </Grid>
      <Grid item xs={7}>
        <Paper className={clsx(classes.paper, classes.waferPaper)}>
          <Wafer
            dies={dies}
            defects={defects}
            scale={scale}
            diePitch={diePitch}
            canvasSize={canvasSize}
            waferRadius={waferRadius}
            defectDiameter={defectDiameter}
            selectionArea={{
              ...selectionArea,
              angleDivision: waferAreaOptions.angle,
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default WaferArea;
