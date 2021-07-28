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
  wrapper: {
    display: "flex",
    placeContent: "center",
  },
  resetWrapper: {
    textAlign: "right",
  },
  stackWrapper: {
    textAlign: "left",
    marginTop: theme.spacing(5),
    marginRight: theme.spacing(4),
  },
  stackLabel: {
    marginBottom: theme.spacing(1),
    fontSize: 12,
  },
  rightWrapper: {
    marginLeft: theme.spacing(4),
    display: "flex",
    alignItems: "center",
  },
  waferLabels: {
    fontSize: 12,
  },
  labelWrapper: {
    textAlign: "left",
    marginRight: theme.spacing(2),
  },
  radioControlGroup: {
    display: "flex",
    placeContent: "center",
    marginBottom: theme.spacing(2),
  },
}));
