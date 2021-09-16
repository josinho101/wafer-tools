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
  center: {
    display: "flex",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 12,
  },
  wrapper: {
    display: "flex",
    flexDirection: "column-reverse",
  },
  marginBottom16: {
    marginBottom: theme.spacing(2),
  },
}));
