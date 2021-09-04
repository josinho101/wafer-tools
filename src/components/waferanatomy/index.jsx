import clsx from "clsx";
import { useStyles } from "./style";
import { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import WaferStage from "./waferstage";

const WaferAnatomy = () => {
  const classes = useStyles();

  const [waferDiameter, setWaferDiameter] = useState(300);
  const [waferOrientation, setWaferOrientation] = useState(0);
  const [diePitchX, setDiePitchX] = useState(5000000);
  const [diePitchY, setDiePitchY] = useState(5000000);
  const [sampleCenterX, setSampleCenterX] = useState(150000000);
  const [sampleCenterY, setSampleCenterY] = useState(150000000);
  const [dieOriginX, setDieOriginX] = useState(0);
  const [dieOriginY, setDieOriginY] = useState(0);

  const onWaferDiameterChanged = (e) => {
    setWaferDiameter(e.target.value);
  };

  const onWaferOrientationChanged = (e) => {
    setWaferOrientation(e.target.value);
  };

  const onDiePitchXChanged = (e) => {
    setDiePitchX(e.target.value);
  };

  const onDiePitchYChanged = (e) => {
    setDiePitchY(e.target.value);
  };

  const onSampleCenterXChanged = (e) => {
    setSampleCenterX(e.target.value);
  };

  const onSampleCenterYChanged = (e) => {
    setSampleCenterY(e.target.value);
  };

  const onDieOriginXChanged = (e) => {
    setDieOriginX(e.target.value);
  };

  const onDieOriginYChanged = (e) => {
    setDieOriginY(e.target.value);
  };

  return (
    <Grid container className={clsx(classes.container)}>
      <Grid item xs={12}>
        <Paper className={clsx(classes.paper, classes.waferPaper)}>
          <Grid container className={classes.paneContainer}>
            <Grid item xs={9} className={classes.leftPane}>
              <WaferStage
                diameter={waferDiameter}
                orientation={waferOrientation}
                diePitch={{ x: diePitchX, y: diePitchY }}
                sampleCenter={{ x: sampleCenterX, y: sampleCenterY }}
                dieOrigin={{ x: dieOriginX, y: dieOriginY }}
              />
            </Grid>
            <Grid item xs={3} className={classes.rightPane}>
              <Box className={classes.controlGroup}>
                <TextField
                  type="number"
                  value={waferDiameter}
                  onChange={onWaferDiameterChanged}
                  label="Wafer diameter"
                  className={classes.controlField}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">mm</InputAdornment>
                    ),
                  }}
                />
                <FormControl className={classes.controlField}>
                  <InputLabel>Wafer Orientation</InputLabel>
                  <Select
                    value={waferOrientation}
                    onChange={onWaferOrientationChanged}
                  >
                    <MenuItem value={0}>0°</MenuItem>
                    <MenuItem value={90}>90°</MenuItem>
                    <MenuItem value={180}>180°</MenuItem>
                    <MenuItem value={270}>270°</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box className={classes.controlGroup}>
                <TextField
                  type="number"
                  value={diePitchX}
                  onChange={onDiePitchXChanged}
                  label="Die pitch X"
                  className={classes.controlField}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">nm</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="number"
                  value={diePitchY}
                  onChange={onDiePitchYChanged}
                  label="Die pitch Y"
                  className={classes.controlField}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">nm</InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box className={classes.controlGroup}>
                <TextField
                  type="number"
                  value={sampleCenterX}
                  onChange={onSampleCenterXChanged}
                  label="Sample center X"
                  className={classes.controlField}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">nm</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="number"
                  value={sampleCenterY}
                  onChange={onSampleCenterYChanged}
                  label="Sample center Y"
                  className={classes.controlField}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">nm</InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box className={classes.controlGroup}>
                <TextField
                  type="number"
                  value={dieOriginX}
                  onChange={onDieOriginXChanged}
                  label="Die origin X"
                  className={classes.controlField}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">nm</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="number"
                  value={dieOriginY}
                  onChange={onDieOriginYChanged}
                  label="Die origin Y"
                  className={classes.controlField}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">nm</InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default WaferAnatomy;
