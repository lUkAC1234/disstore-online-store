import { PureComponent, ReactNode } from "react";
import styles from "./Messages.module.scss";
import { withContextSelector } from "components/Context/ContextInjector";
import { CartContext } from "components/Context/ContextCollection";

class Messages extends PureComponent<MessagesProps, MessagesState> {
  render(): ReactNode {
    return (
      <div className={this.props.successCart ? `${styles["messages-container"]} ${styles["messages-container--active"]}` : styles["messages-container"]}>
        {this.props.successCart && (
          <div className={styles["success-cart"]}>
            <p>Product added to cart</p>
            {this.props.cartItem && (
              <div className={styles["success__item"]}>
                <p>{this.props.cartItem?.product?.title}</p>
                <p>{this.props.cartItem?.product?.catalogImages[0]?.image}</p>
                <p>{this.props.cartItem?.quantity}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const UIMessages = withContextSelector(CartContext, Messages, (context) => ({
  successCart: context.successCart,
  cartItem: context.cartItem,
}))

export default UIMessages;