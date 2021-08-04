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
  wrapper: {
    display: "flex",
    alignItems: "center",
  },
  dieOriginTextbox: {
    width: theme.spacing(15),
  },
  dieOriginLabel: {
    textAlign: "left",
  },
  innerWrapper: {
    height: "80%",
  },
  controlWrapper: {
    display: "flex",
    flexDirection: "column",
    marginLeft: theme.spacing(4),
  },
  marginTop16: {
    marginTop: theme.spacing(2),
  },
  countWrapper: {
    textAlign: "left",
    marginTop: theme.spacing(2),
  },
}));
