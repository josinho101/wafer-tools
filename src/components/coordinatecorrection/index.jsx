import clsx from "clsx";
import Wafer from "../wafer";
import { useState, useEffect } from "react";
import { useStyles } from "./style";
import {
  Paper,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { RotateLeft } from "@material-ui/icons/";
import { degreeToRadian, convertNmToMm } from "../../utils";
import { generateDiesAndDefects, rotate2D } from "../../utils/waferhelper";

const CoordinateCorrection = () => {
  const classes = useStyles();

  const scale = 1.5;
  const waferRadius = 150;
  const defectDiameter = 3;
  const maxDefectsInDie = 50;
  const canvasSize = waferRadius * 2 * scale;
  const diePitch = {
    height: 300,
    width: 300,
  };

  const [doReset, setDoReset] = useState(0);
  const [dies, setDies] = useState([]);
  const [defects, setDefects] = useState([]);
  const [correctedDefects, setCorrectedDefects] = useState([]);
  const [offsetX, setXOffset] = useState("");
  const [offsetY, setYOffset] = useState("");
  const [rotateAngle, setRotateAngle] = useState("");
  const [showCorrection, setShowCorrection] = useState(false);

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
    setCorrectedDefects(defects);
  }, [doReset]);

  useEffect(() => {
    if (showCorrection) {
      const defectData = getCorrectedDefectCoordinates();
      setCorrectedDefects(defectData);
    } else {
      if (defects.length) {
        setCorrectedDefects(defects);
      }
    }
  }, [showCorrection]);

  const onXOffsetChange = (e) => {
    setXOffset(e.target.value);
  };

  const onYOffsetChange = (e) => {
    setYOffset(e.target.value);
  };

  const onRotateAngleChange = (e) => {
    setRotateAngle(e.target.value);
  };

  const onReset = () => {
    setDoReset(Date.now());
  };

  const onCoordinateCorrectionClicked = () => {
    const defectData = getCorrectedDefectCoordinates();
    setCorrectedDefects(defectData);
    setShowCorrection(true);
  };

  const onShowCorrection = (e) => {
    setShowCorrection((prev) => !prev);
  };

  const getCorrectedDefectCoordinates = () => {
    const center = { x: canvasSize / 2, y: canvasSize / 2 };
    const defectData = [];
    defects.forEach((defect) => {
      const result = rotate2D(
        defect.x + convertNmToMm(offsetX),
        defect.y + convertNmToMm(offsetY),
        center.x,
        center.y,
        degreeToRadian(rotateAngle)
      );
      defectData.push({ ...defect, x: result.x, y: result.y });
    });

    return defectData;
  };

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <Paper className={clsx(classes.paper, classes.waferPaper)}>
          <div
            style={{
              display: "flex",
              placeContent: "center",
              flexFlow: "wrap",
            }}
          >
            <Wafer
              dies={dies}
              scale={scale}
              showQuadrants
              diePitch={diePitch}
              canvasSize={canvasSize}
              waferRadius={waferRadius}
              defects={correctedDefects}
              defectDiameter={defectDiameter}
            />
            <div className={classes.controlWrapper}>
              <div style={{ display: "flex" }}>
                <div>
                  <Tooltip title="Reset" aria-label="Reset">
                    <IconButton
                      onClick={onReset}
                      aria-label="Reset"
                      className={classes.margin}
                    >
                      <RotateLeft />
                    </IconButton>
                  </Tooltip>
                </div>
                <div style={{ display: "flex", marginLeft: "16px" }}>
                  <FormControlLabel
                    label="Show correction"
                    control={
                      <Switch
                        size="small"
                        color="primary"
                        onChange={onShowCorrection}
                        checked={showCorrection}
                      />
                    }
                  />
                </div>
              </div>
              <TextField
                required
                label="X Offset (μm)"
                value={offsetX}
                onChange={onXOffsetChange}
                className={classes.margin8PTop}
              />
              <TextField
                required
                label="Y Offset (μm)"
                value={offsetY}
                onChange={onYOffsetChange}
                className={classes.margin8PTop}
              />
              <TextField
                required
                label="Rotate angle (degree)"
                value={rotateAngle}
                onChange={onRotateAngleChange}
                className={classes.margin8PTop}
              />
              <Button
                variant="contained"
                color="primary"
                className={classes.margin24PTop}
                onClick={onCoordinateCorrectionClicked}
              >
                Correct Coordinates
              </Button>
            </div>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CoordinateCorrection;
