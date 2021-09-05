import { makeStyles } from "@material-ui/core";
import { BorderRight } from "@material-ui/icons";

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
    textAlign: "left",
    marginTop: theme.spacing(2),
  },
  controlGroup: {
    marginBottom: theme.spacing(3),
  },
  controlField: {
    textAlign: "left",
    width: theme.spacing(16),
    marginRight: theme.spacing(2),
  },
  circleShape: {
    height: 7,
    width: 7,
    borderRadius: "50%",
    display: "inline-block",
    marginRight: theme.spacing(1),
  },
  triangleShape: {
    width: 0,
    height: 0,
    borderLeft: "4px solid transparent",
    borderRight: "4px solid transparent",
    borderTop: "8px solid red",
  },
  shapeLabel: {
    fontSize: 10,
    marginLeft: theme.spacing(1),
  },
}));
