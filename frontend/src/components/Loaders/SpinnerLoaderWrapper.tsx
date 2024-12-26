import { PureComponent, ReactNode } from "react";
import SpinnerLoader from "./SpinnerLoader";
import "./SpinnerLoaderWrapper.scss";

export interface SpinnerLoaderWrapperProps {
  destroy?: boolean;
  fixedPosition?: boolean;
  relativeCentered?: boolean;
}

class SpinnerLoaderWrapper extends PureComponent<SpinnerLoaderWrapperProps> {
  get fixedCentered(): string {
    if (this.props.fixedPosition) {
      return "spinner-loader-wrapper--fixed";
    }
  }

  get relativeCentered(): string {
    if (this.props.relativeCentered) {
      return "spinner-loader-wrapper--relative-centered";
    }
  }

  get destroy(): string {
    if (this.props.destroy) {
      return "spinner-loader-wrapper--destroyed";
    }
  }

  get spinnerLoaderWrapperClass(): string {
    return `spinner-loader-wrapper ${this.fixedCentered} ${this.relativeCentered} ${this.destroy}`;
  }

  render(): ReactNode {
    return (
      <div className={this.spinnerLoaderWrapperClass}>
        <SpinnerLoader />
      </div>
    );
  }
}

export default SpinnerLoaderWrapper;
