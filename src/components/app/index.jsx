import clsx from "clsx";
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  Paper,
  Grid,
  ThemeProvider,
} from "@material-ui/core";
import Wafer from "../wafer";
import { useStyles } from "./style";
import { theme } from "../../theme";
import { useState } from "react";
import WaferAreaSelector from "../waferarea";
import WaferAreaForm from "../waferarea/form";
import { selectionType } from "../../appsettings";

const App = () => {
  const classes = useStyles();
  const waferDiameter = 300;
  const [waferAreaOptions, setWaferAreaOptions] = useState({
    radius: 0,
    angle: 0,
    circumference: 0,
    doInvert: false,
  });
  const [doReset, setDoReset] = useState(0);
  const [selectionArea, setSelectionArea] = useState({
    selectionType: selectionType.full,
    areas: [],
  });

  const onWaferAreaOptionChanged = (options) => {
    setWaferAreaOptions(options);
  };

  const onReset = (value) => {
    setDoReset(value);
    setSelectionArea({
      selectionType: selectionType.full,
      areas: [],
    });
  };

  const onSelectionChanged = (areas) => {
    setSelectionArea(areas);
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h4">Wafer Area Selector</Typography>
          </Toolbar>
        </AppBar>
        <Grid container className={classes.container}>
          <Grid item xs={5}>
            <Paper className={classes.paper}>
              <WaferAreaForm
                onReset={onReset}
                waferDiameter={waferDiameter}
                onSelectionChange={onWaferAreaOptionChanged}
              />
              <WaferAreaSelector
                doReset={doReset}
                waferDiameter={waferDiameter}
                radiusDivision={waferAreaOptions.radius}
                angleDivision={waferAreaOptions.angle}
                circumference={waferAreaOptions.circumference}
                doInvert={waferAreaOptions.doInvert}
                onSelectionChanged={onSelectionChanged}
              />
            </Paper>
          </Grid>
          <Grid item xs={7}>
            <Paper className={clsx(classes.paper, classes.waferPaper)}>
              <Wafer
                doReset={doReset}
                selectionArea={selectionArea}
                radiusDivision={waferAreaOptions.radius}
                angleDivision={waferAreaOptions.angle}
                circumference={waferAreaOptions.circumference}
              />
            </Paper>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
};

export default App;
