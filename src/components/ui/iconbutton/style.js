import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  iconButton: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    borderRadius: 2,
    border: `2px solid grey`,
    marginBottom: theme.spacing(1),
  },
}));
