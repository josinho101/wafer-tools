import clsx from "clsx";
import { useStyles } from "./style";
import { Paper, Grid } from "@material-ui/core";

const WaferDetails = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <Paper className={clsx(classes.paper, classes.waferPaper)}></Paper>
      </Grid>
    </Grid>
  );
};

export default WaferDetails;
