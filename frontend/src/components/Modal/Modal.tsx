import styles from "./Modal.module.scss";
import { ReactNode, PropsWithChildren, MouseEvent, PureComponent } from "react";

interface ModalProps extends PropsWithChildren {
  onClose?: () => void;
}

class Modal extends PureComponent<ModalProps> {
  stopPropagation = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  render(): ReactNode {
    const { onClose, children } = this.props;
    return (
      <div className={styles["portal-catalog-modal-container"]} onClick={onClose}>
        <div className={styles["portal-catalog-modal-wrapper"]} onClick={this.stopPropagation}>
          {onClose && (
            <button className={styles["close-portal-modal-button"]} type="button" onClick={onClose}>
              <svg
                width="1.5rem"
                height="1.5rem"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.28033 7.21967C7.98744 6.92678 7.51256 6.92678 7.21967 7.21967C6.92678 7.51256 6.92678 7.98744 7.21967 8.28033L10.9393 12L7.21967 15.7197C6.92678 16.0126 6.92678 16.4874 7.21967 16.7803C7.51256 17.0732 7.98744 17.0732 8.28033 16.7803L12 13.0607L15.7197 16.7803C16.0126 17.0732 16.4874 17.0732 16.7803 16.7803C17.0732 16.4874 17.0732 16.0126 16.7803 15.7197L13.0607 12L16.7803 8.28033C17.0732 7.98744 17.0732 7.51256 16.7803 7.21967C16.4874 6.92678 16.0126 6.92678 15.7197 7.21967L12 10.9393L8.28033 7.21967Z"
                  fill="#4E5155"
                />
              </svg>
            </button>
          )}
          {children}
        </div>
      </div>
    );
  }
}

export default Modal;
