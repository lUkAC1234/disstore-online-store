// GlobalModal.tsx
import { ReactNode } from "react";
import { ProductModalContext } from "components/Context/ContextCollection";
import { withContextSelector } from "components/Context/ContextInjector";
import { ModalHandler, ModalHandlerState } from "./Modal.utils";

interface GlobalModalProps {
  toggleModal: (callback: () => void) => void;
  setModalChildren: (children: ReactNode) => void;
  isModalActive: boolean;
  modalChildren: ReactNode;
}

class _GlobalModal extends ModalHandler<GlobalModalProps, ModalHandlerState> {
  handleClose = () => {
    const { isModalActive, setModalChildren, toggleModal } = this.props;
    if (isModalActive) {
      setModalChildren(null);
      toggleModal(() => {});
    }
  };

  render() {
    const { isModalActive } = this.props;
    if (!isModalActive) return null;
    return this.renderModal();
  }
}

const GlobalModal = withContextSelector(ProductModalContext, _GlobalModal, (context) => ({
  toggleModal: context.toggleModal,
  setModalChildren: context.setModalChildren,
  isModalActive: context.isModalActive,
  modalChildren: context.modalChildren,
}));

export default GlobalModal;
