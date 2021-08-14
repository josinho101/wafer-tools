import Wafer from "./wafer";
import { useStyles } from "./style";
import { Box, Typography } from "@material-ui/core";

const WaferHolder = (props) => {
  const classes = useStyles();
  const {
    scale,
    dieOrigin,
    dies,
    defects,
    diePitch,
    canvasSize,
    waferRadius,
    labels,
    defectDiameter = 3,
  } = props;

  return (
    <Box className={classes.waferHolder}>
      <Wafer
        showWaferCenter
        scale={scale}
        dieOrigin={dieOrigin}
        dies={dies}
        defects={defects}
        diePitch={diePitch}
        canvasSize={canvasSize}
        waferRadius={waferRadius}
        defectDiameter={defectDiameter}
      />
      {labels}
    </Box>
  );
};

export default WaferHolder;
