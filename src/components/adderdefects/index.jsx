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
} from "@material-ui/core";
import { generateDiesAndDefects2 } from "../../utils/waferhelper";
import WaferHolder from "./waferholder";
import { getDefects, getAdderDefects } from "./defecthelper";

const AdderDefects = () => {
  const classes = useStyles();

  const waferRadius = 150;
  const scale = 0.7;
  const canvasSize = waferRadius * 2 * scale;
  const outputScale = 1;
  const outputCanvasSize = waferRadius * 2 * outputScale;
  const diePitch = {
    height: 15,
    width: 15,
    chip: { width: 5, height: 2.5 },
  };
  const dieOrigin = { x: 0, y: 0 };

  const defects = getDefects();
  const [dies, setDies] = useState([]);
  const [viewWaferDies, setViewWaferDies] = useState([]);
  const [waferStackDefects, setWaferStackDefects] = useState(
    defects.W1P1.defects
  );
  const [selectedWafers, setSelectedWafers] = useState({ W1P1: true });
  const [tolerance, setTolerance] = useState(4000000);

  useEffect(() => {
    const [dies] = generateDiesAndDefects2(
      canvasSize,
      waferRadius,
      diePitch,
      dieOrigin
    );
    const [viewDies] = generateDiesAndDefects2(
      outputCanvasSize,
      waferRadius,
      diePitch,
      dieOrigin
    );
    setDies(dies);
    setViewWaferDies(viewDies);
  }, []);

  const getWaferIdentifierLabels = (process, waferNumber) => {
    return (
      <Box>
        <Typography className={classes.waferLabel}>
          Process: {process}
        </Typography>
        <Typography className={classes.waferLabel}>
          Wafer number: {waferNumber}
        </Typography>
      </Box>
    );
  };

  const getWaferLabels = (label) => {
    return (
      <Box>
        <Typography className={classes.waferLabel2}>{label}</Typography>
      </Box>
    );
  };

  const onActivate = (id) => {
    const newSelectedwafers = { ...selectedWafers };
    if (newSelectedwafers[id]) {
      delete newSelectedwafers[id];
    } else {
      newSelectedwafers[id] = true;
    }

    let stackDefects = [];
    const wafers = [];
    for (let key in newSelectedwafers) {
      wafers.push(defects[key]);
      stackDefects = [...stackDefects, ...defects[key].defects];
    }

    getAdderDefects(
      wafers,
      tolerance,
      viewWaferDies,
      outputCanvasSize,
      diePitch
    );
    setSelectedWafers(newSelectedwafers);
    setWaferStackDefects(stackDefects);
  };

  const onTolerenceChange = (e) => {
    const value = e.target.value ?? 0;
    setTolerance(value);
  };

  return (
    <Grid container className={clsx(classes.container)}>
      <Grid item xs={12}>
        <Paper className={clsx(classes.paper, classes.waferPaper)}>
          <Grid
            container
            className={clsx(classes.gridColumn, classes.container)}
          >
            <Grid item xs={3}>
              <Grid container className={classes.gridColumn}>
                <Grid item className={classes.waferGridItem}>
                  <WaferHolder
                    process={"P1"}
                    waferNumber={"W1"}
                    scale={scale}
                    dieOrigin={dieOrigin}
                    dies={dies}
                    defects={defects.W1P1.defects}
                    diePitch={diePitch}
                    canvasSize={canvasSize}
                    waferRadius={waferRadius}
                    labels={getWaferIdentifierLabels("P1", "W1")}
                  />
                </Grid>
                <Grid item className={classes.waferGridItem}>
                  <WaferHolder
                    process={"P3"}
                    waferNumber={"W1"}
                    scale={scale}
                    dieOrigin={dieOrigin}
                    dies={dies}
                    defects={defects.W1P3.defects}
                    diePitch={diePitch}
                    canvasSize={canvasSize}
                    waferRadius={waferRadius}
                    labels={getWaferIdentifierLabels("P3", "W1")}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Grid container className={classes.gridColumn}>
                <Grid item className={classes.waferGridItem}>
                  <WaferHolder
                    process={"P2"}
                    waferNumber={"W1"}
                    scale={scale}
                    dieOrigin={dieOrigin}
                    dies={dies}
                    defects={defects.W1P2.defects}
                    diePitch={diePitch}
                    canvasSize={canvasSize}
                    waferRadius={waferRadius}
                    labels={getWaferIdentifierLabels("P2", "W1")}
                  />
                </Grid>
                <Grid item className={classes.waferGridItem}>
                  <WaferHolder
                    process={"P4"}
                    waferNumber={"W1"}
                    scale={scale}
                    dieOrigin={dieOrigin}
                    dies={dies}
                    defects={defects.W1P4.defects}
                    diePitch={diePitch}
                    canvasSize={canvasSize}
                    waferRadius={waferRadius}
                    labels={getWaferIdentifierLabels("P4", "W1")}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid
                container
                className={clsx(classes.gridColumn, classes.margin24)}
              >
                <Grid item xs={12}>
                  <Box>
                    <TextField
                      label="Tolerance"
                      value={tolerance}
                      type="number"
                      className={classes.marginBottom16}
                      onChange={onTolerenceChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">μm</InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  <Box>
                    <FormControlLabel
                      labelPlacement="end"
                      label="W1-P1"
                      classes={{
                        label: classes.checkboxLabel,
                      }}
                      control={
                        <Checkbox
                          checked={selectedWafers["W1P1"] ?? false}
                          color="primary"
                          onChange={() => onActivate("W1P1")}
                          size="small"
                        />
                      }
                    />
                    <FormControlLabel
                      labelPlacement="end"
                      label="W1-P2"
                      classes={{
                        label: classes.checkboxLabel,
                      }}
                      control={
                        <Checkbox
                          checked={selectedWafers["W1P2"] ?? false}
                          color="primary"
                          onChange={() => onActivate("W1P2")}
                          size="small"
                        />
                      }
                    />
                    <FormControlLabel
                      labelPlacement="end"
                      label="W1-P3"
                      classes={{
                        label: classes.checkboxLabel,
                      }}
                      control={
                        <Checkbox
                          checked={selectedWafers["W1P3"] ?? false}
                          color="primary"
                          onChange={() => onActivate("W1P3")}
                          size="small"
                        />
                      }
                    />
                    <FormControlLabel
                      labelPlacement="end"
                      label="W1-P4"
                      classes={{
                        label: classes.checkboxLabel,
                      }}
                      control={
                        <Checkbox
                          checked={selectedWafers["W1P4"] ?? false}
                          color="primary"
                          onChange={() => onActivate("W1P4")}
                          size="small"
                        />
                      }
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{ maxWidth: "100%", display: "flex", marginTop: 32 }}
                >
                  <WaferHolder
                    defectDiameter={0.5}
                    scale={outputScale}
                    dieOrigin={dieOrigin}
                    dies={viewWaferDies}
                    defects={waferStackDefects}
                    diePitch={diePitch}
                    canvasSize={outputCanvasSize}
                    waferRadius={waferRadius}
                    labels={getWaferLabels("Wafer stack")}
                  />
                  <WaferHolder
                    defectDiameter={2}
                    scale={outputScale}
                    dieOrigin={dieOrigin}
                    dies={viewWaferDies}
                    defects={defects.W1P4.defects}
                    diePitch={diePitch}
                    canvasSize={outputCanvasSize}
                    waferRadius={waferRadius}
                    labels={getWaferLabels("Adder & carry-over")}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AdderDefects;
