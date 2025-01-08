import "rc-slider/assets/index.css";
// import "rc-tooltip/assets/bootstrap.css";
import "./RangeSliderDual.scss";
import Slider from "rc-slider";
import { PureComponent, ReactNode } from "react";

interface RangeSliderDualProps {
  min: number;
  max: number;
  step: number;
  values: number[];
  setValues: (values: number[]) => void;
}

class RangeSliderDual extends PureComponent<RangeSliderDualProps> {
  render(): ReactNode {
    const {
      min,
      max,
      step,
      values,
      setValues,
    } = this.props;

    return (
      <Slider
        keyboard
        range
        min={min}
        max={max}
        step={step}
        value={values}
        onChange={(value: number[]) => setValues(value)}
      />
    );
  }
}

export default RangeSliderDual;
