import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(0.5),
    textAlign: "center",
    height: "88vh",
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
}));
