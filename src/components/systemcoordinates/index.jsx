import clsx from "clsx";
import { useState, useEffect } from "react";
import { useStyles } from "./style";
import { Paper, Grid } from "@material-ui/core";

const SystemCoordinates = () => {
  const classes = useStyles();

  const scale = 1;
  const waferRadius = 150;
  const defectDiameter = 3;
  const maxDefectsInDie = 50;
  const canvasSize = waferRadius * 2 * scale;
  const diePitch = {
    height: 50,
    width: 50,
  };

  const [dies, setDies] = useState([]);
  const [defects, setDefects] = useState([]);
  const [doReset, setDoReset] = useState(0);

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
  }, [doReset]);

  const onReset = () => {
    setDoReset(Date.now());
  };

  const generateDiesAndDefects = () => {};

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <Paper className={clsx(classes.paper, classes.waferPaper)}></Paper>
      </Grid>
    </Grid>
  );
};

export default SystemCoordinates;
