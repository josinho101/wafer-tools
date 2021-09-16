import clsx from "clsx";
import { useStyles } from "./style";
import { Switch, FormControlLabel, Grid, Paper } from "@material-ui/core";
import HazeMap from "./hazemap";
import { useState } from "react";

const HazeMapView = () => {
  const classes = useStyles();
  const [greyScale, setGreyScale] = useState(false);

  const onChange = (e) => {
    setGreyScale((prev) => !prev);
  };

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <Paper
          className={clsx(
            classes.paper,
            classes.waferPaper,
            classes.center,
            classes.wrapper
          )}
        >
          <HazeMap greyScale={greyScale} />
          <FormControlLabel
            labelPlacement="end"
            label="Grey scale"
            className={classes.marginBottom16}
            classes={{
              label: classes.checkboxLabel,
            }}
            control={
              <Switch
                size="small"
                color="primary"
                onChange={onChange}
                checked={greyScale}
              />
            }
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default HazeMapView;
