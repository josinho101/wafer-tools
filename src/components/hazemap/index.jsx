import clsx from "clsx";
import { useStyles } from "./style";
import { Grid, Paper } from "@material-ui/core";
import HazeMap from "./hazemap";

const HazeMapView = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <Paper
          className={clsx(classes.paper, classes.waferPaper, classes.center)}
        >
          <HazeMap />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default HazeMapView;
