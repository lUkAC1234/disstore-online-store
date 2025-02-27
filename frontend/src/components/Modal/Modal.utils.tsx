import { Component, ReactNode } from "react";
import { createPortal } from "react-dom";
import Modal from "./Modal";
import { ProductModalActions } from "components/Context/ProductModalContext";

export interface ModalHandlerProps extends ProductModalActions {
  isAuthenticated?: boolean;
}

export class ModalHandler<P extends ModalHandlerProps, S = {}> extends Component<P, S> {
  private _modalBuilder: (() => ReactNode) | null = null;
  private _hasUnauth: boolean = false;

  componentDidMount(): void {
    window.addEventListener("keydown", this.onEscapeHandler);
  }

  componentDidUpdate(prevProps: P): void {
    if (
      this.props.isModalActive &&
      prevProps.isAuthenticated !== this.props.isAuthenticated &&
      this._modalBuilder
    ) {
      if (!this._hasUnauth && this.props.isAuthenticated) {
        this.closeModal();
      } else {
        this.props.setModalChildren(this._modalBuilder());
      }
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener("keydown", this.onEscapeHandler);
  }

  onEscapeHandler = (evt: KeyboardEvent): void => {
    if (evt.key === "Escape" && this.props.isModalActive) {
      this.closeModal();
    }
  };

 
  openModal = (authenticated: ReactNode, unauthenticated?: ReactNode): void => {
    this._hasUnauth = unauthenticated !== undefined;
    this._modalBuilder = () => {
      if (this._hasUnauth) {
        return this.props.isAuthenticated ? authenticated : unauthenticated!;
      }
      return authenticated;
    };

    if (!this.props.isModalActive) {
      this.props.setModalChildren(this._modalBuilder());
      this.props.toggleModal(() => {});
    } else {
      this.props.setModalChildren(this._modalBuilder());
    }
  };

  closeModal = (): void => {
    this._modalBuilder = null;
    this._hasUnauth = false;
    if (this.props.isModalActive) {
      this.props.setModalChildren(null);
      this.props.toggleModal(() => {});
    } else {
      this.props.setModalChildren(null);
    }
  };

  renderModal(): ReactNode {
    if (!this.props.isModalActive) return null;
    return createPortal(
      <Modal onClose={this.closeModal}>
        {this.props.modalChildren}
      </Modal>,
      document.body
    );
  }

  render(): ReactNode {
    return this.renderModal();
  }
}
