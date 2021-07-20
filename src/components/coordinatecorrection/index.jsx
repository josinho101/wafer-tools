import clsx from "clsx";
import Wafer from "../wafer";
import { useState, useEffect } from "react";
import { useStyles } from "./style";
import { Paper, Grid, TextField, Button } from "@material-ui/core";
import { selectionType } from "../../appsettings";
import { generateDiesAndDefects } from "../../utils/waferhelper";

const CoordinateCorrection = () => {
  const classes = useStyles();

  const scale = 1.2;
  const waferRadius = 150;
  const defectDiameter = 3;
  const maxDefectsInDie = 50;
  const canvasSize = waferRadius * 2 * scale;
  const diePitch = {
    height: 300,
    width: 300,
  };
  const selectionArea = {
    selectionType: selectionType.full,
    areas: [],
  };

  const [doReset, setDoReset] = useState(0);
  const [dies, setDies] = useState([]);
  const [defects, setDefects] = useState([]);

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
              defects={defects}
              scale={scale}
              showQuadrants
              diePitch={diePitch}
              canvasSize={canvasSize}
              waferRadius={waferRadius}
              defectDiameter={defectDiameter}
              selectionArea={selectionArea}
            />
            <div className={classes.controlWrapper}>
              <TextField
                required
                label="X Offset (μm)"
                className={classes.margin8PTop}
              />
              <TextField
                required
                label="Y Offset (μm)"
                className={classes.margin8PTop}
              />
              <TextField
                required
                label="Rotate angle (degree)"
                className={classes.margin8PTop}
              />
              <Button
                variant="contained"
                color="primary"
                className={classes.margin24PTop}
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
