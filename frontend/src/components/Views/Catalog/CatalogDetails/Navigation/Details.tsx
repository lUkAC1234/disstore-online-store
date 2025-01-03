import { PureComponent, ReactNode } from "react";
import styles from "./Navigation.module.scss"; 

interface DetailsProps {
  detailsText?: ReactNode; 
}

class DetailsSection extends PureComponent<DetailsProps> {
  render(): ReactNode {
    const { detailsText } = this.props;

    return (
      <section className={styles["details-section"]}>
        <div className={styles["details-container"]}>
          <h2 className={styles["details-title"]}>Product Details</h2>
          <div className={styles["details-content"]}>
          {detailsText ? (
              <div
                dangerouslySetInnerHTML={{ __html: String(detailsText) }}
              />
            ) : (
              <p>Пока что нету полной описании</p>
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default DetailsSection;
