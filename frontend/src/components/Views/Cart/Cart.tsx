import { PureComponent, ReactNode } from "react";
import styles from "./Cart.module.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import EmptyCart from "./Empty/EmptyCart";
import { withContextSelector } from "components/Context/ContextInjector";
import { CartContext } from "components/Context/ContextCollection";
import { getWithTranslation } from "i18n/hooks";
import OptimizedImage from "components/OptimizedImage/OptimizedImage";

class Cart extends PureComponent<CartProps> {
  async componentDidMount(): Promise<void> {
    if (document.documentElement.scrollTop > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  get lang(): string {
    return this.props.i18n.language;
  }

  handleIncrease = async (cartItem: ExtendedCartItemProps) => {
    try {
      await this.props.updateCartItem(cartItem.id, cartItem.quantity + 1);
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  handleDecrease = async (cartItem: ExtendedCartItemProps) => {
    try {
      if (cartItem.quantity > 1) {
        await this.props.updateCartItem(cartItem.id, cartItem.quantity - 1);
      } else {
        await this.props.removeFromCart(cartItem.id);
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  renderCartItems(): ReactNode {
    const { cart } = this.props;
    return cart?.items?.map((item) => {
      const extendedItem = item as ExtendedCartItemProps;
      return (
        <div key={extendedItem.id} className={styles["cart-item"]}>
          <button
            className={styles["delete-from-cart-button"]}
            onClick={() => this.props.removeFromCart(extendedItem.id)}
          >
            <svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.75 3.5C9.33579 3.5 9 3.83579 9 4.25V5H15V4.25C15 3.83579 14.6642 3.5 14.25 3.5H9.75ZM7.5 4.25V5H3.75C3.33579 5 3 5.33579 3 5.75C3 6.16421 3.33579 6.5 3.75 6.5H4.30005L5.62088 19.9681C5.73386 21.1202 6.70255 21.9985 7.86014 21.9985H16.1399C17.2975 21.9985 18.2661 21.1202 18.3791 19.9681L19.7 6.5H20.25C20.6642 6.5 21 6.16421 21 5.75C21 5.33579 20.6642 5 20.25 5H16.5V4.25C16.5 3.00736 15.4926 2 14.25 2H9.75C8.50736 2 7.5 3.00736 7.5 4.25ZM11 9.75C11 9.33579 10.6642 9 10.25 9C9.83579 9 9.5 9.33579 9.5 9.75V17.25C9.5 17.6642 9.83579 18 10.25 18C10.6642 18 11 17.6642 11 17.25V9.75ZM14.5 9.75C14.5 9.33579 14.1642 9 13.75 9C13.3358 9 13 9.33579 13 9.75V17.25C13 17.6642 13.3358 18 13.75 18C14.1642 18 14.5 17.6642 14.5 17.25V9.75Z"
                fill="black"
              />
            </svg>
          </button>
          <div className={styles["cart-item-image-container"]}>
            <OptimizedImage
              src={
                extendedItem.selected_image ||
                extendedItem.product.catalogImages[0].image
              }
              alt={extendedItem.product.title}
              thumbnail={extendedItem.product.catalogImages[0]?.thumbnail}
            />
            <Link
              className={styles["cart-item-link"]}
              to={`/${this.lang}/catalog/clothes/${extendedItem.product.slug}`}
            />
          </div>

          <div className={styles["cart-details-info-container"]}>
            <h4 className={styles["cart-item-title"]}>
              {extendedItem.product.title}
              <Link
                className={styles["cart-item-link"]}
                to={`/${this.lang}/catalog/clothes/${extendedItem.product.slug}`}
              />
            </h4>
            {(extendedItem.selected_color || extendedItem.selected_size) && (
              <div className={styles["cart-item-options"]}>
                {extendedItem.selected_color && (
                  <span className={styles["cart-item-option"]}>
                    Цвет: <div style={{ backgroundColor: extendedItem.selected_color }}></div>
                  </span>
                )}
                {extendedItem.selected_size && (
                  <span className={styles["cart-item-option"]}>
                    Размер: {extendedItem.selected_size}
                  </span>
                )}
              </div>
            )}
            <div className={styles["cart-item-price-quantity-container"]}>
              <div className={styles["cart-item-price-container"]}>
                {extendedItem.product.discount > 0 ? (
                  <>
                    <span className={styles["cart-item-price"]}>
                      {extendedItem.product.real_price.toLocaleString("en-US")} сум
                    </span>
                    <span className={styles["cart-item-previous-price"]}>
                      {extendedItem.product.price.toLocaleString("en-US")} сум
                    </span>
                  </>
                ) : (
                  <span className={styles["cart-item-price"]}>
                    {extendedItem.product.price.toLocaleString("en-US")} сум
                  </span>
                )}
              </div>
              <div className={styles["cart-quantity-controller"]}>
                <button
                  className={styles["quantity-btn"]}
                  onClick={() => this.handleDecrease(extendedItem)}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <span className={styles["quantity-value"]}>
                  {extendedItem.quantity}
                </span>
                <button
                  className={styles["quantity-btn"]}
                  onClick={() => this.handleIncrease(extendedItem)}
                  disabled={extendedItem.quantity >= extendedItem.product.count}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  render(): ReactNode {
    const { cart } = this.props;
    const subtotal = cart ? cart.original_total : 0;
    const totalDiscount = cart ? cart.total_discount : 0;
    const finalTotal = cart ? cart.final_total : 0;
    const discountPercentage = cart ? cart.discount_percentage : "0";

    return (
      <div className={styles["cart-container"]}>
        {(!cart || !cart.items || cart.items.length === 0) ? (
          <EmptyCart />
        ) : (
          <>
            <h1 className={styles["cart-title"]}>Ваша Корзина</h1>
            <div className={styles["cart-content-container"]}>
              <div className={styles["cart-details"]}>
                {this.renderCartItems()}
              </div>
              <div className={styles["cart-status-container"]}>
                <h2 className={styles["cart-status-subtitle"]}>Ваш заказ</h2>
                <div className={styles["cart-status-summary-container"]}>
                  <div className={styles["cart-status-summary-item"]}>
                    <span className={styles["cart-status-summary-name"]}>
                      Товары ({cart.items.reduce((sum, item) => sum + item.quantity, 0)})
                    </span>
                    <span className={styles["cart-status-summary-price"]}>
                      {subtotal.toLocaleString("en-US")} сум
                    </span>
                  </div>
                  <div className={styles["cart-status-summary-item"]}>
                    <span className={styles["cart-status-summary-name"]}>
                      Скидка (-{discountPercentage}%)
                    </span>
                    <span className={`${styles["cart-status-summary-price"]} ${styles["discount"]}`}>
                      -{totalDiscount.toLocaleString("en-US")} сум
                    </span>
                  </div>
                  <div className={styles["cart-status-summary-item"]}>
                    <span className={styles["cart-status-summary-name"]}>Доставка</span>
                    <span className={styles["cart-status-summary-price"]}>50,000 сум</span>
                  </div>
                  <div className={styles["hr-line"]}></div>
                  <div className={styles["cart-status-summary-item"]}>
                    <span className={styles["cart-status-summary-name"]}>Итого</span>
                    <span className={styles["cart-status-summary-price"]}>
                      {finalTotal.toLocaleString("en-US")} сум
                    </span>
                  </div>
                  <Link to={`/${this.lang}/checkout`} className={styles["checkout-link"]}>
                    Перейти к оформлению
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

const UICart = withContextSelector(CartContext, Cart, (context) => ({
  cart: context.cart,
  removeFromCart: context.removeFromCart,
  updateCartItem: context.updateCartItem,
}));

const TransltatedUICart = getWithTranslation(UICart);

export default TransltatedUICart;
