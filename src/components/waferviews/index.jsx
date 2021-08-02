import clsx from "clsx";
import Wafer from "../wafer";
import Chip from "../wafer/chip";
import Die from "../wafer/die";
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
  Typography,
} from "@material-ui/core";
import { generateDiesAndDefects } from "../../utils/waferhelper";
import { waferViews } from "../../appsettings";
import { RotateLeft } from "@material-ui/icons";
import IconButton from "../ui/iconbutton";

const WaferViews = () => {
  const classes = useStyles();

  const scale = 1.3;
  const waferRadius = 150;
  const defectDiameter = 2;
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
      diePitch,
      true
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
            <Box>
              <Box className={classes.resetWrapper}>
                <Tooltip title="Reset">
                  <IconButton aria-label="Reset" onClick={onResetTriggered}>
                    <RotateLeft fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <RadioGroup
                row
                value={view}
                className={classes.radioControlGroup}
                onChange={onWaferViewChange}
              >
                <FormControlLabel
                  value={waferViews.die}
                  control={<Radio color="primary" size="small" />}
                  label="Die"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value={waferViews.chip}
                  control={<Radio color="primary" size="small" />}
                  label="Chip"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value={waferViews.none}
                  control={<Radio color="primary" size="small" />}
                  label="None"
                  labelPlacement="end"
                />
              </RadioGroup>
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
            </Box>
            <Box className={classes.rightWrapper}>
              <Box className={classes.stackWrapper}>
                <Box>
                  <Typography className={classes.stackLabel}>
                    Die stack view
                  </Typography>
                  <Die
                    viewMode={view}
                    diePitch={diePitch}
                    canvasSize={175}
                    defects={defects}
                    defectDiameter={defectDiameter}
                  />
                </Box>
              </Box>
              <Box className={classes.stackWrapper}>
                <Box>
                  <Typography className={classes.stackLabel}>
                    Chip stack view
                  </Typography>
                  <Chip
                    diePitch={diePitch}
                    canvasSize={150}
                    defects={defects}
                    defectDiameter={defectDiameter}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default WaferViews;
