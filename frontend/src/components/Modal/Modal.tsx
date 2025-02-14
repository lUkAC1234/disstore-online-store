import styles from "./Modal.module.scss";
import { PropsWithChildren, PureComponent, ReactNode } from "react";

class Modal extends PureComponent<PropsWithChildren> {
  render(): ReactNode {
    return (
      <div className={styles["modal-wrapper"]}>
        <div className={styles["modal-container"]}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Modal;
