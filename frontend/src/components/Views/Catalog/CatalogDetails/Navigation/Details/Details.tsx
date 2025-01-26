import styles from "./Details.module.scss"; 
import NavigationError from "../../NavigationError/NavigationError";
import { PureComponent, ReactNode } from "react";

interface DetailsProps {
  detailsText?: ReactNode; 
}

class DetailsSection extends PureComponent<DetailsProps> {
  render(): ReactNode {
    const { detailsText } = this.props;

    return (
      <section className={styles["details-section"]}>
        <div className={styles["details-container"]}>
          {detailsText ? (
              <div
                className={styles["details-content-wrapper"]}
                dangerouslySetInnerHTML={{ __html: String(detailsText) }}
              />
            ) : (
              <NavigationError error={"Пока что нету полной описании"} />
            )}
          </div>
      </section>
    );
  }
}

export default DetailsSection;
