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
  waferProcessWrapper: {
    placeContent: "center",
  },
  waferHolder: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  waferGridItem: {
    border: "1px solid #ffffff38",
  },
  waferLabel: {
    fontSize: 10,
  },
  waferLabel2: {
    fontSize: 12,
  },
  gridColumn: {
    display: "flex",
    flexDirection: "column",
    placeContent: "center",
  },
  checkboxLabel: {
    fontSize: 10,
  },
  margin24: {
    margin: theme.spacing(3),
  },
  marginBottom16: {
    marginBottom: theme.spacing(2),
  },
}));
