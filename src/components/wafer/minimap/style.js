import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  container: {
    display: "grid",
    placeItems: "center",
    position: "relative",
    userSelect: "none",
    overflow: "hidden",
    outline: "1px solid #ffffff70",
  },
  shape: {
    border: "1px solid #cdcdcd",
    backgroundColor: "#e4ab0085",
  },
  wafer: {
    borderRadius: "50%",
  },
  overlay: {
    position: "absolute",
    userSelect: "none",
    opacity: 0.2,
    background: theme.palette.primary.main,
  },
}));
