import clsx from "clsx";
import { useState, useEffect } from "react";
import { useStyles } from "./style";
import {
  Paper,
  Grid,
  Box,
  TextField,
  InputAdornment,
  Typography,
} from "@material-ui/core";
import Wafer from "./wafer";
import { generateDiesAndDefects2 } from "../../utils/waferhelper";
import { convertNmToMm } from "../../utils";

const SystemCoordinates = () => {
  const classes = useStyles();

  const scale = 0.85;
  const waferRadius = 150;
  const defectDiameter = 1;
  const maxDefectsInDie = 50;
  const canvasSize = waferRadius * 2 * scale;
  const diePitch = {
    height: 20,
    width: 20,
  };
  const [dies, setDies] = useState([]);
  const [defects, setDefects] = useState([]);
  const [doReset, setDoReset] = useState(0);
  const [dieOrigin, setDieOrigin] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const [dies, defects] = generateDiesAndDefects2(
      canvasSize,
      waferRadius,
      diePitch,
      dieOrigin
    );
    setDies(dies);
    setDefects(defects);
  }, [doReset, dieOrigin]);

  const onReset = () => {
    setDoReset(Date.now());
  };

  const onDieOriginYChange = (e) => {
    const value = e.target.value ?? 0;
    const y = convertNmToMm(value);
    setDieOrigin({ ...dieOrigin, y });
  };

  const onDieOriginXChange = (e) => {
    const value = e.target.value ?? 0;
    const x = convertNmToMm(value);
    setDieOrigin({ ...dieOrigin, x });
  };

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <Paper className={clsx(classes.paper, classes.waferPaper)}>
          <Box className={classes.wrapper}>
            <Box className={classes.innerWrapper}>
              <Wafer
                scale={scale}
                showQuadrants
                showDieOrigin
                dieOrigin={dieOrigin}
                dies={dies}
                defects={defects}
                diePitch={diePitch}
                canvasSize={canvasSize}
                waferRadius={waferRadius}
              />
            </Box>
            <Box className={clsx(classes.innerWrapper, classes.controlWrapper)}>
              <TextField
                onChange={onDieOriginXChange}
                defaultValue={dieOrigin.x}
                label="Die origin X"
                className={classes.dieOriginTextbox}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">μm</InputAdornment>
                  ),
                }}
              />
              <TextField
                onChange={onDieOriginYChange}
                defaultValue={dieOrigin.y}
                label="Die origin Y"
                className={clsx(classes.dieOriginTextbox, classes.marginTop16)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">μm</InputAdornment>
                  ),
                }}
              />
              <Box className={classes.countWrapper}>
                <Typography>Die count - {dies.length}</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SystemCoordinates;
