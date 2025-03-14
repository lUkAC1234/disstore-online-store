import { PureComponent, ReactNode } from "react";
import styles from "./Messages.module.scss";
import { withContextSelector } from "components/Context/ContextInjector";
import { CartContext } from "components/Context/ContextCollection";
import CloseMessage from "./MessageComponents/CloseMessage";

class Messages extends PureComponent<MessagesProps, MessagesState> {
  render(): ReactNode {
    const activeMessages = this.getMessages().filter((msg) => msg.condition);
    return (
      <div
        className={
          activeMessages.length
            ? `${styles["messages-container"]} ${styles["messages-container--active"]}`
            : styles["messages-container"]
        }
      >
        {activeMessages.map((msg, index) => (
          <div key={index} className={msg.className}>
            {msg.content}
          </div>
        ))}
      </div>
    );
  }

  getMessages() {
    return [
      {
        condition: this.props.successCart,
        className: styles["success-cart"],
        content: (
          <>
            {this.props.cartItem && (
              <>
                <p className={styles["success-cart-message"]}>Товар добавлен в корзину</p>
                <div className={styles["success__item"]}>
                  <p>{this.props.cartItem?.product?.title}</p>
                  <p>{this.props.cartItem?.product?.catalogImages[0]?.image}</p>
                  <p>{this.props.cartItem?.quantity}</p>
                </div>
              </>
            )}
            <CloseMessage closingFunction={this.props.closeSuccessCart} />
          </>
        ),
      },
      {
        condition: this.props.successCheckout,
        className: styles["success-checkout"],
        content: (
          <>
            <p className={styles["success-checkout-message"]}>Ваш заказ успешно оформлен</p>
            <CloseMessage closingFunction={this.props.closeSuccessCheckoutCart} />
          </>
        ),
      },
    ];
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
