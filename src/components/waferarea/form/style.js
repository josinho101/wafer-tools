import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  select: {
    width: 150,
    textAlign: "left",
  },
  selectMenuPaper: {
    maxHeight: 400,
  },
  formWrapper: {
    paddingTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  formControl: {
    marginRight: theme.spacing(2),
  },
  controlGroup: {
    paddingBottom: theme.spacing(2),
  },
  checkboxLabel: {
    userSelect: "none",
  },
  buttonHolder: {
    float: "right",
    marginTop: -10,
  },
}));
