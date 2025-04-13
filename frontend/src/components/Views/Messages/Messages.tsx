import styles from "./Messages.module.scss";
import { PureComponent, ReactNode } from "react";
import { withContextSelector } from "components/Context/ContextInjector";
import { CartContext } from "components/Context/ContextCollection";
import CloseMessage from "./MessageComponents/CloseMessage";
import welcomeImage from "assets/main/images/main-page/models.webp";
import { SmallText, Text } from "components/UI/Html/Elements/Elements";
import LangLink from "components/UI/Link/LangLink";

class Messages extends PureComponent<MessagesProps, MessagesState> {
  render(): ReactNode {
    const activeMessages = this.getMessages().filter((msg) => msg.condition);

    if (!activeMessages.length) return null;

    return (
      <div className={`${styles["messages-container"]} ${styles["messages-container--active"]}`}>
        <div className={styles["messages-wrapper"]}>
          {activeMessages.map((msg, index) => (
            <div className={msg.className} key={index}>
              {msg.content}
            </div>
          ))}
        </div>
      </div>
    );
  }

  getMessages() {
    const { cartItem } = this.props;

    return [
      {
        condition: this.props.successCart,
        className: styles["success-cart"],
        content: (
          <>

            {!cartItem && (
              <div className={styles["success-item"]}>

                <div className={styles["success-item-content-wrapper"]}>
                  <div className={styles["success-item-image-container"]}>
                    <img className={styles["success-item-image"]} src={welcomeImage} alt="Product Preview" />
                    {/* <img className={styles["success-item-image"]} src={cartItem.product?.catalogImages?.[0]?.image || "Изображение"} alt={cartItem?.product?.catalogImages?.[0]?.image || "Изображение"} /> */}
                  </div>
                  <div className={styles["success-item-content"]}>
                    <Text bold className={styles["success-cart-message"]}>Товар добавлен в корзину</Text>
                    <SmallText>{cartItem?.product?.title || "Модная одежда от бренда Gucci"}</SmallText>
                    <SmallText>Количество:  2{cartItem?.quantity}</SmallText>
                    <LangLink
                      to={`/cart`}
                      className={styles["success-item-link"]}
                      
                    >
                      Перейти в корзину
                    </LangLink>
                  </div>
                </div>

              </div>
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
