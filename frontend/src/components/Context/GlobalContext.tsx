import debug from "constants/debug";
import { PropsWithChildren, PureComponent, ReactNode, RefObject } from "react";
import { autoBindMethods } from "utils/hooks/bind";
import { convertStringBoolValue } from "utils/hooks/converStringBoolValue";
import { debounce } from "utils/hooks/debounce";
import { ModalWindow } from "components/ModalWindow/ModalWindow/ModalWindow";
import { GlobalContext } from "./ContextCollection";

export { GlobalContext };

export interface GlobalContextProps extends PropsWithChildren {}
export interface GlobalContextState {
  isFooterToggled: boolean;
  isFooterToggleBtnHidden: boolean;
  shouldSearchBarRender: boolean;
  topModalIsActive: boolean;
  topModalChildren: ReactNode;
  topModalWidth: string;
  topModalHeight: string;
  topModalIsTransparent: boolean;
  shouldSideBarsRender: boolean;
  isMobileMenuActive: boolean;
  modalHeight: string;
  modalWidth: string;
  modalWindowIsActive: boolean;
  modalWindowChildren: ReactNode;
  leftSideBarIsActive: boolean;
  rightSideBarIsActive: boolean;
  fancyboxIsAttached: boolean;
  modalWindowRef: RefObject<ModalWindow>;
  onModalWindowClose: () => void;
}

export interface GlobalContextStateWithActions extends GlobalContextState {
  toggleFooter: (value: boolean, callback?: (value?: boolean) => void) => void;
  toggleVisibilityFooterToggleBtn: (value: boolean, callback?: (value?: boolean) => void) => void;
  openTopModal: (
    children: ReactNode,
    options?: {
      width?: string;
      height?: string;
      transparent?: boolean;
    }
  ) => void;
  closeTopModal: () => void;
  setMobileMenuState: (value: boolean) => void;
  openModalWindow: (options: {
    width?: string;
    height?: string;
    children?: ReactNode;
    onClose?: () => void;
  }) => void;
  closeModalWindow: () => void;
  setLeftSideBarState: (value: boolean) => void;
  setRightSideBarState: (value: boolean) => void;
  setFancyboxAttachStatus: (value: boolean) => void;
  setModalWindowRef: (ref: RefObject<ModalWindow>) => void;
}

class GlobalContextProvider extends PureComponent<GlobalContextProps, GlobalContextState> implements BindMethods {
  state: Readonly<GlobalContextState> = {
    isFooterToggled: false,
    isFooterToggleBtnHidden: false,
    shouldSearchBarRender: false,
    topModalIsActive: false,
    topModalChildren: "",
    topModalWidth: "30rem",
    topModalHeight: "fit-content",
    topModalIsTransparent: false,
    shouldSideBarsRender: false,
    isMobileMenuActive: false,
    modalHeight: "fit-content",
    modalWidth: "fit-content",
    modalWindowIsActive: false,
    modalWindowChildren: null,
    leftSideBarIsActive: debug ? convertStringBoolValue(localStorage.getItem("left-side-bar-should-be-active")) : true,
    rightSideBarIsActive: false,
    fancyboxIsAttached: false,
    onModalWindowClose: null,
    modalWindowRef: null,
  };

  methods: BindItem[] = [
    { func: this.toggleFooter, context: this },
    { func: this.toggleVisibilityFooterToggleBtn, context: this },
    { func: this.openTopModal, context: this },
    { func: this.closeTopModal, context: this },
    { func: this.setMobileMenuState, context: this },
    { func: this.openModalWindow, context: this },
    { func: this.closeModalWindow, context: this },
    { func: this.setLeftSideBarState, context: this },
    { func: this.setRightSideBarState, context: this },
    { func: this.setFancyboxAttachStatus, context: this },
    { func: this.setModalWindowRef, context: this },
  ];

  constructor(props: Readonly<GlobalContextProps>) {
    super(props);
    autoBindMethods(this);
  }

  render(): ReactNode {
    return (
      <GlobalContext.Provider value={{
        ...this.state,
        toggleFooter: this.toggleFooter,
        toggleVisibilityFooterToggleBtn: this.toggleVisibilityFooterToggleBtn,
        openTopModal: this.openTopModal,
        closeTopModal: this.closeTopModal,
        setMobileMenuState: this.setMobileMenuState,
        openModalWindow: this.openModalWindow,
        closeModalWindow: this.closeModalWindow,
        setLeftSideBarState: this.setLeftSideBarState,
        setRightSideBarState: this.setRightSideBarState,
        setFancyboxAttachStatus: this.setFancyboxAttachStatus,
        setModalWindowRef: this.setModalWindowRef,
      }}>
        {this.props.children}
      </GlobalContext.Provider>
    );
  }

  componentDidMount(): void {
    this.onPathStateChanged();
    this.positionScaleControlDOM();
    this.manageHistoryAPIEvents("addEventListener");
  }

  componentWillUnmount(): void {
    this.manageHistoryAPIEvents("removeEventListener");
  }

  componentDidUpdate(_prevProps: Readonly<GlobalContextProps>, prevState: Readonly<GlobalContextState>): void {
    if (prevState.isFooterToggled !== this.state.isFooterToggled) {
      this.positionScaleControlDOM();
    }
  }

  openTopModal(children: ReactNode, options?: { width?: string; height?: string; transparent?: boolean;}): void {
    let width: string, height: string, transparent: boolean;
    if (options) {
      width = options?.width;
      height = options?.height;
      transparent = options?.transparent;
    }

    this.setState(prevState => ({
      ...prevState,
      topModalIsActive: true,
      topModalChildren: children,
      topModalWidth: width ?? "30rem",
      topModalHeight: height ?? "fit-content",
      topModalIsTransparent: transparent ?? false,
    }));
  }

  closeTopModal(): void {
    this.setState(prevState => ({
      ...prevState,
      topModalIsActive: false,
      topModalChildren: "",
      topModalWidth: "30rem",
      topModalHeight: "fit-content",
      topModalIsTransparent: false,
    }));
  }

  setFancyboxAttachStatus(value: boolean): void {
    this.setState(prevState => ({
      ...prevState,
      fancyboxIsAttached: value,
    }));
  }

  openModalWindow(options: {
    width?: string;
    height?: string;
    children?: ReactNode;
    onClose?: () => void;
  }): void {
    const { width, height, children, onClose } = options;

    this.setState(prevState => ({
      ...prevState,
      modalWidth: width ?? "fit-content",
      modalHeight: height ?? "fit-content",
      modalWindowIsActive: true,
      modalWindowChildren: children,
      onModalWindowClose: onClose,
    }));
  }

  closeModalWindow(): void {
    const onClose = this.state?.onModalWindowClose;
    this.setState(prevState => ({
      ...prevState,
      modalWidth: "fit-content",
      modalHeight: "fit-content",
      modalWindowIsActive: false,
      modalWindowChildren: "",
      onModalWindowClose: null,
    }), () => {
      if (onClose && typeof onClose === "function") {
        onClose();
      }
    });
  }

  manageHistoryAPIEvents(action: "addEventListener" | "removeEventListener"): void {
    window[action]("popstate", this.onPathStateChanged);
    window[action]("pushstate", this.onPathStateChanged);
    window[action]("replacestate", this.onPathStateChanged);
  }

  onPathStateChanged: () => void = debounce(() => {
    this.setState((prevState) => {
      const pathParts = window.location.pathname.split("/");
      const shouldSearchBarRender = !pathParts[2];
      const shouldSideBarsRender = !pathParts[2];

      return {
        ...prevState,
        shouldSearchBarRender,
        shouldSideBarsRender,
      };
    });
  }, 100);

  stateSetter<T>(key: keyof GlobalContextState, value: T, callback?: () => void): void {
    this.setState(prevState => ({
      ...prevState,
      [key]: value,
    }), () => {
      if (callback) callback();
    });
  }

  toggleFooter(value: boolean, callback?: () => void): void {
    this.stateSetter("isFooterToggled", value, callback);
  }

  toggleVisibilityFooterToggleBtn(value: boolean, callback?: () => void): void {
    this.stateSetter("isFooterToggleBtnHidden", value, callback);
  }

  positionScaleControlDOM(): void {
    const controlScaleNode: HTMLElement = document.querySelector(".leaflet-control-scale");
    const controlZoomNode: HTMLElement = document.querySelector(".leaflet-control-zoom");

    if (!controlScaleNode || !controlZoomNode) return;

    if (this.state.isFooterToggled) {
      controlScaleNode.classList.add("active-top");
      controlZoomNode.classList.add("footer-active");
    } else {
      controlScaleNode.classList.remove("active-top");
      controlZoomNode.classList.remove("footer-active");
    }
  }

  setMobileMenuState(value: boolean): void {
    this.stateSetter("isMobileMenuActive", value);
  }

  setLeftSideBarState(value: boolean): void {
    this.setState(prevState => {
      return {
        ...prevState,
        leftSideBarIsActive: value,
      }
    }, () => {
      if (debug) {
        localStorage.setItem("left-side-bar-should-be-active", String(value));
      }
    });
  }

  setRightSideBarState(value: boolean): void {
    this.stateSetter("rightSideBarIsActive", value);
  }

  setModalWindowRef(ref: RefObject<ModalWindow>): void {
    this.setState(prevState => ({
      ...prevState,
      modalWindowRef: ref,
    }));
  }
}

export default GlobalContextProvider;
