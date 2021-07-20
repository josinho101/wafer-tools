import { Box } from "@material-ui/core";
import { useStyles } from "./style";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box className={classes.box}>{children}</Box>}
    </div>
  );
};

export default TabPanel;
