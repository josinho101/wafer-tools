import clsx from "clsx";
import { Paper, Grid, Typography } from "@material-ui/core";
import Wafer from "../wafer";
import { useStyles } from "./style";
import { useState, useEffect } from "react";
import WaferAreaSelector from "./selector";
import WaferAreaForm from "./form";
import { selectionType } from "../../appsettings";
import {
  generateDiesAndDefects,
  filterDefectsByArea,
} from "../../utils/waferhelper";

const WaferArea = () => {
  const classes = useStyles();
  const scale = 1.7;
  const waferRadius = 150;
  const waferDiameter = waferRadius * 2;
  const defectDiameter = 1;
  const maxDefectsInDie = 20;
  const canvasSize = waferRadius * 2 * scale;
  const diePitch = {
    height: 10,
    width: 10,
  };

  const [doReset, setDoReset] = useState(0);
  const [dies, setDies] = useState([]);
  const [dieCount, setDieCount] = useState(0);
  const [defects, setDefects] = useState([]);
  const [filteredDefects, setFilteredDefects] = useState([]);
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
    const [dies, defects, dieCount] = generateDiesAndDefects(
      canvasSize,
      waferRadius,
      defectDiameter,
      maxDefectsInDie,
      diePitch
    );
    setDies(dies);
    setDieCount(dieCount);
    setDefects(defects);
  }, [doReset, canvasSize]);

  useEffect(() => {
    // filter defects by selected areas
    const filteredItems = filterDefectsByArea(
      selectionArea,
      canvasSize,
      defects
    );
    setFilteredDefects(filteredItems);
  }, [selectionArea, defects, waferAreaOptions]);

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
          <div className={classes.waferLabelLeft}>
            <Typography
              className={classes.label}
            >{`Total defect count - ${defects.length}`}</Typography>
            <Typography
              className={classes.label}
            >{`Visible defect count - ${filteredDefects.length}`}</Typography>
            <Typography className={classes.label}>{`Hidden defect count - ${
              defects.length - filteredDefects.length
            }`}</Typography>
          </div>
          <Wafer
            dies={dies}
            scale={scale}
            diePitch={diePitch}
            canvasSize={canvasSize}
            defects={filteredDefects}
            waferRadius={waferRadius}
            defectDiameter={defectDiameter}
          />
          <div className={classes.waferLabelRight}>
            <Typography
              className={classes.label}
            >{`Scale - ${scale}`}</Typography>
            <Typography
              className={classes.label}
            >{`Die count - ${dieCount}`}</Typography>
            <Typography
              className={classes.label}
            >{`Die pitch X - ${diePitch.width} mm`}</Typography>
            <Typography
              className={classes.label}
            >{`Die pitch Y - ${diePitch.height} mm`}</Typography>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default WaferArea;
