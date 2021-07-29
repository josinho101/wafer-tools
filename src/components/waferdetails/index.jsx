import clsx from "clsx";
import Wafer from "../wafer";
import { useStyles } from "./style";
import { Paper, Grid, Box } from "@material-ui/core";
import { useState, useEffect } from "react";
import { generateDiesAndDefects } from "../../utils/waferhelper";

const WaferDetails = () => {
  const classes = useStyles();

  const scale = 1.5;
  const waferRadius = 150;
  const defectDiameter = 1.25;
  const maxDefectsInDie = 2;
  const canvasSize = waferRadius * 2 * scale;
  const diePitch = {
    height: 10,
    width: 10,
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
      diePitch,
      true
    );
    setDies(dies);
    setDefects(defects);
  }, [doReset]);

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <Paper className={clsx(classes.paper, classes.waferPaper)}>
          <Box>
            <Wafer
              scale={scale}
              dies={dies}
              diePitch={diePitch}
              canvasSize={canvasSize}
              waferRadius={waferRadius}
              defectDiameter={defectDiameter}
              defects={defects}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default WaferDetails;
