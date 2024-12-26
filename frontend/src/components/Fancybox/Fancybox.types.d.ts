import { PropsWithChildren } from "react";
import { OptionsType as FancyboxOptions } from "@fancyapps/ui/types/Fancybox/options";
import { GlobalContextStateWithActions } from "components/Context/GlobalContext";

declare global {
  interface UIFancyboxProps extends PropsWithChildren, GlobalContextStateWithActions {
    options?: Partial<FancyboxOptions>;
    delegate?: string;
    init?: () => void;
    destroy?: () => void;
    carouselReady?: () => void;
  }
}

export {}
