import clsx from "clsx";
import { useStyles } from "./style";

const Minimap = (props) => {
  const classes = useStyles();
  const { size, objectSize, overlayPosition, className } = props;
  const { top, left, height, width } = overlayPosition;
  const scale = size / objectSize;
  const style = { width: size, height: size };

  return (
    <div className={className}>
      <div className={clsx(classes.container)} style={style}>
        <div className={clsx(classes.shape, classes.wafer)} style={style} />
        <div
          className={classes.overlay}
          style={{
            top: top * scale,
            left: left * scale,
            width: width * scale,
            height: height * scale,
          }}
        />
      </div>
    </div>
  );
};

export default Minimap;
