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
  },
  container: {
    overflow: "hidden",
  },
  waferLabelRight: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    textAlign: "left",
    position: "absolute",
    top: "10vh",
    right: "1vw",
  },
  waferLabelLeft: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    textAlign: "left",
    position: "absolute",
    top: "10vh",
  },
  label: {
    fontSize: 12,
    userSelect: "none",
  },
}));
