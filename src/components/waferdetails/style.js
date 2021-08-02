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
    alignItems: "center",
  },
  container: {
    overflow: "hidden",
  },
  waferWrapper: {
    display: "flex",
  },
  rightWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  leftControlHolder: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing(1),
    height: "10%",
  },
  marginRight8: {
    marginRight: theme.spacing(1),
  },
  minimapWrapper: {
    height: "17%",
  },
  labelWrapper: {
    height: "73%",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    placeContent: "flex-end",
  },
  waferLabels: {
    fontSize: 10,
  },
}));
