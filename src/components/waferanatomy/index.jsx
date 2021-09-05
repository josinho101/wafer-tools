import clsx from "clsx";
import { useStyles } from "./style";
import { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Box,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
} from "@material-ui/core";
import WaferStage from "./waferstage";

const WaferAnatomy = () => {
  const classes = useStyles();

  const [waferDiameter, setWaferDiameter] = useState(300);
  const [waferOrientation, setWaferOrientation] = useState(0);
  const [diePitchX, setDiePitchX] = useState(5);
  const [diePitchY, setDiePitchY] = useState(5);
  const [sampleCenterX, setSampleCenterX] = useState(150);
  const [sampleCenterY, setSampleCenterY] = useState(150);
  const [dieOriginX, setDieOriginX] = useState(30);
  const [dieOriginY, setDieOriginY] = useState(30);

  const onWaferDiameterChanged = (e) => {
    setWaferDiameter(+e.target.value);
  };

  const onWaferOrientationChanged = (e) => {
    setWaferOrientation(+e.target.value);
  };

  const onDiePitchXChanged = (e) => {
    setDiePitchX(+e.target.value);
  };

  const onDiePitchYChanged = (e) => {
    setDiePitchY(+e.target.value);
  };

  const onSampleCenterXChanged = (e) => {
    setSampleCenterX(+e.target.value);
  };

  const onSampleCenterYChanged = (e) => {
    setSampleCenterY(+e.target.value);
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
                <FormControl className={classes.controlField}>
                  <InputLabel>Wafer diameter</InputLabel>
                  <Select
                    value={waferDiameter}
                    onChange={onWaferDiameterChanged}
                  >
                    <MenuItem value={200}>200</MenuItem>
                    <MenuItem value={300}>300</MenuItem>
                  </Select>
                </FormControl>
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
                      <InputAdornment position="end">mm</InputAdornment>
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
                      <InputAdornment position="end">mm</InputAdornment>
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
                      <InputAdornment position="end">mm</InputAdornment>
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
                      <InputAdornment position="end">mm</InputAdornment>
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
                      <InputAdornment position="end">mm</InputAdornment>
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
                      <InputAdornment position="end">mm</InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box style={{ textAlign: "left" }}>
                <FormControlLabel
                  style={{ marginLeft: 0 }}
                  label={
                    <span className={classes.shapeLabel}>
                      &nbsp;&nbsp;Wafer notch
                    </span>
                  }
                  control={<span className={classes.triangleShape}></span>}
                />
                <div>
                  <span
                    className={classes.circleShape}
                    style={{ backgroundColor: "#038c03" }}
                  ></span>
                  <span className={classes.shapeLabel}>Die origin</span>
                </div>
                <div>
                  <span
                    className={classes.circleShape}
                    style={{ backgroundColor: "#ff00ff" }}
                  ></span>
                  <span className={classes.shapeLabel}>Wafer center</span>
                </div>
                <div>
                  <span
                    className={classes.circleShape}
                    style={{ backgroundColor: "red" }}
                  ></span>
                  <span className={classes.shapeLabel}>
                    Sample coordinate center
                  </span>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default WaferAnatomy;
