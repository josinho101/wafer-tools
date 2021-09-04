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
    flexDirection: "column",
    userSelect: "none",
  },
  container: {
    overflow: "hidden",
  },
  paneContainer: {
    height: "90vh",
  },
  leftPane: {
    marginTop: theme.spacing(2),
  },
  rightPane: {
    textAlign: "right",
    marginTop: theme.spacing(2),
  },
  controlGroup: {
    marginBottom: theme.spacing(3),
  },
  controlField: {
    width: theme.spacing(16),
    marginRight: theme.spacing(2),
  },
}));
