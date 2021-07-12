import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  Typography,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { useStyles } from "./style";
import { useState } from "react";
import { RotateLeft } from "@material-ui/icons/";

const WaferAreaForm = (props) => {
  const classes = useStyles();
  const { onSelectionChange, waferDiameter, onReset } = props;

  const [radius, setRadius] = useState(0);
  const [angle, setAngle] = useState(0);
  const [circumference, setCircumference] = useState(0);
  const [doInvert, setDoInvert] = useState(false);

  const onRadiusChange = (e) => {
    setRadius(e.target.value);
    onSelectionChange({
      radius: e.target.value,
      angle: angle,
      circumference: circumference,
      doInvert: doInvert,
    });
  };

  const onAngleChange = (e) => {
    setAngle(e.target.value);
    onSelectionChange({
      radius: radius,
      angle: e.target.value,
      circumference: circumference,
      doInvert: doInvert,
    });
  };

  const onCircumferenceChange = (e) => {
    setCircumference(e.target.value);
    onSelectionChange({
      radius: radius,
      angle: angle,
      circumference: e.target.value,
      doInvert: doInvert,
    });
  };

  const onInvertSelectionChange = (e) => {
    setDoInvert(e.target.checked);
    onSelectionChange({
      radius: radius,
      angle: angle,
      circumference: circumference,
      doInvert: e.target.checked,
    });
  };

  const onResetTriggered = () => {
    setAngle(0);
    setRadius(0);
    setCircumference(0);
    setDoInvert(false);

    onSelectionChange({
      radius: 0,
      angle: 0,
      circumference: 0,
      doInvert: false,
    });

    onReset(Date.now());
  };

  return (
    <div className={classes.formWrapper}>
      <div className={classes.buttonHolder}>
        <Tooltip title="Reset" aria-label="Reset">
          <IconButton
            onClick={onResetTriggered}
            aria-label="Reset"
            className={classes.margin}
          >
            <RotateLeft />
          </IconButton>
        </Tooltip>
      </div>
      <div className={classes.controlGroup}>
        <Typography>{`Wafer diameter : ${waferDiameter} mm`}</Typography>
      </div>
      <div className={classes.controlGroup}>
        <FormControl className={classes.formControl}>
          <InputLabel>Radius division</InputLabel>
          <Select
            value={radius}
            className={classes.select}
            onChange={onRadiusChange}
          >
            <MenuItem value={0}>0 mm</MenuItem>
            <MenuItem value={5}>5 mm</MenuItem>
            <MenuItem value={10}>10 mm</MenuItem>
            <MenuItem value={20}>20 mm</MenuItem>
            <MenuItem value={25}>25 mm</MenuItem>
            <MenuItem value={50}>50 mm</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel>Angle division</InputLabel>
          <Select
            value={angle}
            className={classes.select}
            onChange={onAngleChange}
          >
            <MenuItem value={0}>0°</MenuItem>
            <MenuItem value={5}>5°</MenuItem>
            <MenuItem value={10}>10°</MenuItem>
            <MenuItem value={20}>20°</MenuItem>
            <MenuItem value={30}>30°</MenuItem>
            <MenuItem value={45}>45°</MenuItem>
            <MenuItem value={60}>60°</MenuItem>
            <MenuItem value={90}>90°</MenuItem>
            <MenuItem value={180}>180°</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel>Outer circumference</InputLabel>
          <Select
            value={circumference}
            className={classes.select}
            onChange={onCircumferenceChange}
            MenuProps={{ classes: { paper: classes.selectMenuPaper } }}
          >
            <MenuItem value={0}>0 mm</MenuItem>
            <MenuItem value={1}>1 mm</MenuItem>
            <MenuItem value={2}>2 mm</MenuItem>
            <MenuItem value={3}>3 mm</MenuItem>
            <MenuItem value={4}>4 mm</MenuItem>
            <MenuItem value={5}>5 mm</MenuItem>
            <MenuItem value={6}>6 mm</MenuItem>
            <MenuItem value={7}>7 mm</MenuItem>
            <MenuItem value={8}>8 mm</MenuItem>
            <MenuItem value={9}>9 mm</MenuItem>
            <MenuItem value={10}>10 mm</MenuItem>
            <MenuItem value={11}>11 mm</MenuItem>
            <MenuItem value={12}>12 mm</MenuItem>
            <MenuItem value={13}>13 mm</MenuItem>
            <MenuItem value={14}>14 mm</MenuItem>
            <MenuItem value={15}>15 mm</MenuItem>
            <MenuItem value={16}>16 mm</MenuItem>
            <MenuItem value={17}>17 mm</MenuItem>
            <MenuItem value={18}>18 mm</MenuItem>
            <MenuItem value={19}>19 mm</MenuItem>
            <MenuItem value={20}>20 mm</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className={classes.controlGroup}>
        <FormControlLabel
          labelPlacement="end"
          label="Invert selection"
          className={classes.checkboxLabel}
          control={
            <Checkbox
              checked={doInvert}
              color="primary"
              onChange={onInvertSelectionChange}
            />
          }
        />
      </div>
    </div>
  );
};

export default WaferAreaForm;
