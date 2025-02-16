import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { ProductModalContext } from "./ContextCollection";

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
