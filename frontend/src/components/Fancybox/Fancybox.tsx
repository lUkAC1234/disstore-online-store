import("@fancyapps/ui/dist/fancybox/fancybox.css");
import { OptionsType } from "@fancyapps/ui/types/Fancybox/options";
import { withContext } from "components/Context/ContextInjector";
import { GlobalContext } from "components/Context/GlobalContext";
import { PureComponent, RefObject, createRef } from "react";
import { COMPONENT } from "services/utils/Injectors";

@COMPONENT<UIFancybox>({
  template: (_this) => {
    return (
      <div className={_this.props.className} ref={_this.containerRef}>
        {_this.props.children}
      </div>
    );
  }
})
class UIFancybox extends PureComponent<UIFancyboxProps> {
  static NativeFancybox: typeof import("@fancyapps/ui").Fancybox;
  static loadedFancybox: boolean = false;

  defaultOptions: Partial<OptionsType> = {
    "hideScrollbar": false,
    on: {
      "init": () => {
        this.props.setFancyboxAttachStatus(true);
        if (this.props.init) {
          this.props.init();
        }
      },
      "destroy": () => {
        this.props.setFancyboxAttachStatus(false);
        if (this.props.destroy) {
          this.props.destroy();
        }
      },
      "Carousel.ready": () => {
        if (this.props.carouselReady) {
          this.props.carouselReady();
        }
      },
    },
    contentClick: "iterateZoom",
    Images: {
      Panzoom: {
        maxScale: 2,
      },
    },
    Toolbar: {
      display: {
        left: ["infobar"],
        middle: [
          "zoomIn",
          "zoomOut",
          "toggle1to1",
          "rotateCCW",
          "rotateCW",
          "flipX",
          "flipY",
        ],
        right: ["slideshow", "download", "thumbs", "fullscreen", "close"],
      },
    },
    Thumbs: {
      type: "modern",
    },
  };

  containerRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();

  componentDidMount(): void {
    this.loadFancyboxModules()
      .catch((err) => console.error(err));
  }

  componentWillUnmount(): void {
    if (UIFancybox.loadedFancybox) {
      UIFancybox.NativeFancybox.destroy();
    }
  }

  componentDidUpdate(prevProps: Readonly<UIFancyboxProps>): void {
    if (prevProps.options !== this.props.options) {
      UIFancybox.NativeFancybox.unbind(this.containerRef.current);
      UIFancybox.NativeFancybox.close();
    }
  }

  async loadFancyboxModules(): Promise<void> {
    if (!UIFancybox.loadedFancybox) {
      const module: typeof import("@fancyapps/ui") = await import("@fancyapps/ui");
      UIFancybox.NativeFancybox = module.Fancybox;
    }

    this.bindNativebox();
  }

  bindNativebox(): void {
    const container = this.containerRef.current;
    const delegate = this.props.delegate || "[data-fancybox]";
    const options = { ...this.defaultOptions, ...this.props.options };

    UIFancybox.NativeFancybox.bind(container, delegate, options);
  }
}

const InjectedUIFancybox = withContext(GlobalContext, UIFancybox);

export default InjectedUIFancybox;
