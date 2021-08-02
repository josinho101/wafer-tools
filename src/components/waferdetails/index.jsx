import clsx from "clsx";
import Wafer from "../wafer";
import { useStyles } from "./style";
import { Paper, Grid, Box, Tooltip, Typography } from "@material-ui/core";
import { useState, useEffect } from "react";
import { generateDiesAndDefects } from "../../utils/waferhelper";
import {
  RotateLeft,
  AddRounded,
  RemoveRounded,
  PanToolRounded,
  TabUnselectedRounded,
} from "@material-ui/icons";
import IconButton from "../ui/iconbutton";
import Minimap from "../wafer/minimap";

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

  const onResetTriggered = () => {
    setDoReset(Date.now());
  };

  const handleZoomIn = () => {};

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <Paper className={clsx(classes.paper, classes.waferPaper)}>
          <Box className={classes.waferWrapper}>
            <Box>
              <Box className={classes.minimapWrapper}>
                <Minimap size={75} objectSize={300} overlayPosition={{}} />
              </Box>
              <Box className={classes.leftControlHolder}>
                <Tooltip title="Pan">
                  <IconButton
                    className={classes.marginRight8}
                    onClick={handleZoomIn}
                  >
                    <PanToolRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Select">
                  <IconButton onClick={handleZoomIn}>
                    <TabUnselectedRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
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
              </Box>
            </Box>
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
            <Box className={classes.rightWrapper}>
              <Tooltip title="Zoom In">
                <IconButton onClick={handleZoomIn}>
                  <AddRounded fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom Out">
                <IconButton onClick={handleZoomIn}>
                  <RemoveRounded fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reset">
                <IconButton aria-label="Reset" onClick={onResetTriggered}>
                  <RotateLeft fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default WaferDetails;
