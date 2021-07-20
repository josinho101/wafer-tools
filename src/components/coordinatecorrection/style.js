import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(0.5),
    textAlign: "center",
    height: "90vh",
  },
  waferPaper: {
    display: "flex",
    placeContent: "center",
  },
  container: {
    overflow: "hidden",
  },
  controlWrapper: {
    display: "flex",
    flexDirection: "column",
    placeContent: "center",
    marginLeft: theme.spacing(4),
  },
  margin8PTop: {
    marginTop: theme.spacing(1),
  },
  margin24PTop: {
    marginTop: theme.spacing(3),
  },
}));
