import { CSSProperties, PureComponent, ReactNode } from "react";
import SpinnerLoader from "./SpinnerLoader";
import "./SpinnerLoaderWrapper.scss";

export interface SpinnerLoaderWrapperProps {
  destroy?: boolean;
  fixedPosition?: boolean;
  relativeCentered?: boolean;
  smallWrapper?: boolean;
  whiteLoader?: boolean;
  withBackground?: boolean;
  wrapperStyle?: CSSProperties;
}

class SpinnerLoaderWrapper extends PureComponent<SpinnerLoaderWrapperProps> {
  get fixedCentered(): string {
    return this.props.fixedPosition ? "spinner-loader-wrapper--fixed" : "";
  }

  get smallWrapper(): string {
    return this.props.smallWrapper ? "spinner-loader-wrapper--small" : "";
  }

  get whiteLoader(): string {
    return this.props.whiteLoader ? "spinner-loader-wrapper--white" : "";
  }

  get relativeCentered(): string {
    return this.props.relativeCentered ? "spinner-loader-wrapper--relative-centered" : "";
  }

  get destroy(): string {
    return this.props.destroy ? "spinner-loader-wrapper--destroyed" : "";
  }
  
  get withBackground(): string {
    return this.props.withBackground ? "spinner-loader-wrapper--with-background" : "";
  }

  get spinnerLoaderWrapperClass(): string {
    return `spinner-loader-wrapper ${this.fixedCentered} ${this.relativeCentered} ${this.destroy} ${this.smallWrapper} ${this.whiteLoader} ${this.withBackground}`;
  }

  render(): ReactNode {
    const wrapperStyle = this.props.wrapperStyle || {}; 
    return (
      <div className={this.spinnerLoaderWrapperClass} style={wrapperStyle}>
        <SpinnerLoader />
      </div>
    );
  }
}

export default SpinnerLoaderWrapper;
