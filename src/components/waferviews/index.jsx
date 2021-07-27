import clsx from "clsx";
import Wafer from "../wafer";
import { useStyles } from "./style";
import { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  Tooltip,
  IconButton,
  Typography,
} from "@material-ui/core";
import { generateDiesAndDefects } from "../../utils/waferhelper";
import { waferViews } from "../../appsettings";
import { RotateLeft } from "@material-ui/icons";
import WaferComponent from "../wafer/wafercomponent";

const WaferViews = () => {
  const classes = useStyles();

  const scale = 1.5;
  const waferRadius = 150;
  const defectDiameter = 1.5;
  const maxDefectsInDie = 2;
  const canvasSize = waferRadius * 2 * scale;
  const diePitch = {
    height: 25,
    width: 25,
    chip: { width: 5, height: 2.5 },
  };

  const [dies, setDies] = useState([]);
  const [defects, setDefects] = useState([]);
  const [view, setView] = useState(waferViews.die);
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

  const onWaferViewChange = (e) => {
    setView(+e.target.value);
  };

  const onResetTriggered = () => {
    setDoReset(Date.now());
  };

  const getStackLabel = () => {
    let pre = "";
    if (view === waferViews.chip) {
      pre = "Chip";
    } else if (view === waferViews.die) {
      pre = "Die";
    }

    return pre + " stack view";
  };

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <Paper className={clsx(classes.paper, classes.waferPaper)}>
          <Box className={classes.wrapper}>
            <Box className={classes.labelWrapper}>
              <Typography className={classes.waferLabels}>
                Wafer size - {waferRadius * 2} mm
              </Typography>
              <Typography className={classes.waferLabels}>
                Wafer scale - {scale}
              </Typography>
              <Typography className={classes.waferLabels}>
                Defect count - {defects.length}
              </Typography>
              <Typography className={classes.waferLabels}>
                Die - {diePitch.width} x {diePitch.height} mm
              </Typography>
              <Typography className={classes.waferLabels}>
                Chip - {diePitch.chip.width} x {diePitch.chip.height} mm
              </Typography>
            </Box>
            <Wafer
              view={view}
              scale={scale}
              dies={dies}
              diePitch={diePitch}
              canvasSize={canvasSize}
              waferRadius={waferRadius}
              defectDiameter={defectDiameter}
              defects={defects}
            />
            <Box className={classes.rightWrapper}>
              <RadioGroup row value={view} onChange={onWaferViewChange}>
                <FormControlLabel
                  value={waferViews.die}
                  control={<Radio color="primary" size="small" />}
                  label="Die"
                  labelPlacement="right"
                />
                <FormControlLabel
                  value={waferViews.chip}
                  control={<Radio color="primary" size="small" />}
                  label="Chip"
                  labelPlacement="right"
                />
                <FormControlLabel
                  value={waferViews.none}
                  control={<Radio color="primary" size="small" />}
                  label="None"
                  labelPlacement="right"
                />
                <FormControlLabel
                  control={
                    <Tooltip title="Reset">
                      <IconButton aria-label="Reset" onClick={onResetTriggered}>
                        <RotateLeft />
                      </IconButton>
                    </Tooltip>
                  }
                />
              </RadioGroup>
              <Box className={classes.stackWrapper}>
                {view !== waferViews.none ? (
                  <Box>
                    <Typography className={classes.stackLabel}>
                      {getStackLabel()}
                    </Typography>
                    <WaferComponent
                      view={view}
                      diePitch={diePitch}
                      canvasSize={200}
                      defects={defects}
                      defectDiameter={defectDiameter + 1}
                    />
                  </Box>
                ) : null}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default WaferViews;
