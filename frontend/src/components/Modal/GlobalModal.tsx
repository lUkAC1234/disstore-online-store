// GlobalModal.tsx
import { ReactNode } from "react";
import { ProductModalContext } from "components/Context/ContextCollection";
import { withContextSelector } from "components/Context/ContextInjector";
import { ModalHandler } from "./Modal.utils";

interface GlobalModalProps {
  toggleModal: (callback: () => void) => void;
  setModalChildren: (children: ReactNode) => void;
  isModalActive: boolean;
  modalChildren: ReactNode;
}

class GlobalModal extends ModalHandler<GlobalModalProps> {
  handleClose = () => {
    const { isModalActive, setModalChildren, toggleModal } = this.props;
    if (isModalActive) {
      setModalChildren(null);
      toggleModal(() => {});
    }
  };

  render() {
    const { isModalActive, modalChildren } = this.props;
    if (!isModalActive) return null;
    return this.renderModal();
  }
}

export default withContextSelector(ProductModalContext, GlobalModal, (context) => ({
  toggleModal: context.toggleModal,
  setModalChildren: context.setModalChildren,
  isModalActive: context.isModalActive,
  modalChildren: context.modalChildren,
}));
