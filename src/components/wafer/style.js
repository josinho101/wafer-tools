import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  waferLabel: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    textAlign: "left",
    position: "absolute",
    bottom: "3vh",
  },
  label: {
    fontSize: 12,
  },
}));
