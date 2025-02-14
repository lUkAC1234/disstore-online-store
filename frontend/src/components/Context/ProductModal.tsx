import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { ProductModalContext } from "./ContextCollection";
import { createPortal } from "react-dom";

export interface ProductModalState {
  isModalActive: boolean;
  modalChildren: ReactNode;
}

export interface ProductModalActions extends ProductModalState {
  toggleModal: (callback: () => void) => void;
  setModalChildren: (children: ReactNode) => void;
}

export interface ProductModalProps extends PropsWithChildren {}

class ProductModalProvider extends PureComponent<ProductModalProps, ProductModalState> {
  state: Readonly<ProductModalState> = {
    isModalActive: false,
    modalChildren: null,
  };

  get portalContent(): ReactNode {
    return this.state.isModalActive
      ? createPortal(this.state.modalChildren, document.body)
      : null;
  }

  render(): ReactNode {
    return (
      <ProductModalContext.Provider
        value={{
          ...this.state,
          toggleModal: this.toggleModal,
          setModalChildren: this.setModalChildren,
        }}
      >
        {this.props.children}

      </ProductModalContext.Provider>
    );
  }

  toggleModal = (callback: () => void): void => {
    this.setState(
      (prevState => ({
        ...prevState,
        isModalActive: !prevState.isModalActive,
      })),
      callback,
    );
  }

  setModalChildren = (children: ReactNode): void => {
    this.setState(
      (prevState => ({
        ...prevState,
        modalChildren: children,
      }))
    );
  }
}

export default ProductModalProvider;
