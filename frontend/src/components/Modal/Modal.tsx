import styles from "./Modal.module.scss";
import { PropsWithChildren, PureComponent, ReactNode } from "react";

class Modal extends PureComponent<PropsWithChildren> {
  render(): ReactNode {
    return (
      <div className={styles["portal-catalog-modal-container"]}>
        <div className={styles["portal-catalog-modal-wrapper"]}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Modal;
