import { PureComponent, ReactNode } from "react";
import styles from "./AboutUs.module.scss";

class AboutUs extends PureComponent<AboutUsProps, AboutUsState> {
  async componentDidMount(): Promise<void> {
    if (document.documentElement.scrollTop > 0) {
      window.scrollTo({
        top: 0, 
        behavior: "smooth",
      });
    }
  }
  render(): ReactNode {
    return (
      <div className={styles["about-us-container"]}>
          
      </div>
    );
  }
}

export default AboutUs;