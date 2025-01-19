import { PureComponent, ReactNode } from "react";
import styles from "./AboutUs.module.scss";

class AboutUs extends PureComponent<AboutUsProps, AboutUsState> {
  render(): ReactNode {
    return (
      <div className={styles["container"]}>
          About Us
      </div>
    );
  }
}

export default AboutUs;