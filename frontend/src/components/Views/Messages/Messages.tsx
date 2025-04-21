import styles from "./Messages.module.scss";
import { createRef, PureComponent, ReactNode } from "react";
import { withContextSelector } from "components/Context/ContextInjector";
import { CartContext } from "components/Context/ContextCollection";
import CloseMessage from "./MessageComponents/CloseMessage";
import { SmallText, Text } from "components/UI/Html/Elements/Elements";
import LangLink from "components/UI/Link/LangLink";
import OptimizedImage from "components/UI/OptimizedImage/OptimizedImage";

class Messages extends PureComponent<MessagesProps, MessagesState> {
  private containerRef = createRef<HTMLDivElement>();
  private currentPath = window.location.pathname;

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    this.listenToRouteChanges();
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
    ["popstate", "pushstate", "replacestate"].forEach((event) =>
      window.removeEventListener(event, this.handleRouteChange as EventListener)
    );
  }

  handleClickOutside = (event: MouseEvent) => {
    if (this.containerRef.current && !this.containerRef.current.contains(event.target as Node)) {
      this.closeAllMessages();
    }
  };

  handleRouteChange = () => {
    if (!this.props.successCheckout) {
      const newPath = window.location.pathname;
      if (this.currentPath !== newPath) {
        this.closeAllMessages();
        this.currentPath = newPath;
      }
    }
  };

  closeAllMessages() {
    const { successCart, successCheckout, closeSuccessCart, closeSuccessCheckoutCart } = this.props;
    if (successCart) closeSuccessCart();
    if (successCheckout) closeSuccessCheckoutCart();
  }

  listenToRouteChanges() {
    const wrap = (method: keyof History) => {
      const original = history[method];
      return function (...args: any[]) {
        const result = original.apply(this, args);
        window.dispatchEvent(new Event(method.toLowerCase()));
        return result;
      };
    };

    history.pushState = wrap("pushState");
    history.replaceState = wrap("replaceState");

    ["popstate", "pushstate", "replacestate"].forEach((event) =>
      window.addEventListener(event, this.handleRouteChange as EventListener)
    );
  }

  render(): ReactNode {
    const message = this.getActiveMessage();

    if (!message) return null;

    return (
      <div className={`${styles["messages-container"]} ${styles["messages-container--active"]}`}>
        <div className={styles["messages-wrapper"]} ref={this.containerRef}>
          <div className={message.className}>{message.content}</div>
        </div>
      </div>
    );
  }

  getActiveMessage() {
    const {
      successCart,
      successCheckout,
      cartItem,
      closeSuccessCart,
      closeSuccessCheckoutCart,
    } = this.props;

    if (successCart && cartItem) {
      const image = cartItem.product?.catalogImages?.[0]?.image || "Изображение";
      const thumbnail = cartItem.product?.catalogImages?.[0]?.thumbnail || "Изображение";
      return {
        className: styles["success-cart"],
        content: (
          <>
            <div className={styles["success-item"]}>
              <div className={styles["success-item-content-wrapper"]}>
                <div className={styles["success-item-image-container"]}>
                  <OptimizedImage
                    className={styles["success-item-image"]}
                    src={image}
                    thumbnail={thumbnail}
                    alt={image}
                  />
                </div>
                <div className={styles["success-item-content"]}>
                  <Text className={styles["success-message"]}>Товар добавлен в корзину</Text>
                  <SmallText>{cartItem.product?.title}</SmallText>
                  <SmallText>Количество: {cartItem.quantity}</SmallText>
                  <LangLink to="/cart" className={styles["success-item-link"]}>
                    Перейти в корзину
                  </LangLink>
                </div>
              </div>
            </div>
            <CloseMessage closingFunction={closeSuccessCart} />
          </>
        ),
      };
    }

    if (successCheckout) {
      return {
        className: styles["success-checkout"],
        content: (
          <>
            <Text className={styles["success-message"]}>Ваш заказ успешно оформлен</Text>
            <CloseMessage closingFunction={closeSuccessCheckoutCart} />
          </>
        ),
      };
    }

    return null;
  }
}

const UIMessages = withContextSelector(CartContext, Messages, (context) => ({
  successCart: context.successCart,
  successCheckout: context.successCheckout,
  cartItem: context.cartItem,
  closeSuccessCart: context.closeSuccessCart,
  closeSuccessCheckoutCart: context.closeSuccessCheckoutCart,
}));

export default UIMessages;