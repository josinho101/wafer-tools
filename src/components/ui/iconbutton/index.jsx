import { IconButton as MuiIconBtn } from "@material-ui/core";
import { useStyles } from "./style";

const IconButton = ({ children, ...props }) => {
  const classes = useStyles();
  return (
    <MuiIconBtn {...props} classes={{ root: classes.iconButton }}>
      {children}
    </MuiIconBtn>
  );
};

export default IconButton;
