import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(0.5),
    textAlign: "center",
    height: "90vh",
  },
  selectMenuPaper: {
    maxHeight: 400,
  },
  formWrapper: {
    paddingTop: theme.spacing(2),
  },
  formControl: {
    marginRight: theme.spacing(2),
  },
  waferPaper: {
    display: "flex",
    placeContent: "center",
    flexDirection: "column",
  },
  container: {
    overflow: "hidden",
  },
  appbar: {
    height: theme.spacing(5),
    marginBottom: theme.spacing(1),
  },
  toolbar: {
    minHeight: theme.spacing(5),
  },
  appTitle: {
    fontWeight: 700,
  },
}));
