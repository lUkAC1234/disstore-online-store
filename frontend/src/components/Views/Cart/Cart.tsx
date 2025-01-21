import { PureComponent, ReactNode } from "react";
import styles from "./Cart.module.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Clothes from "assets/main/images/main-page/casual.webp"

class Cart extends PureComponent<CartProps, CartState> {
  render(): ReactNode {
    return (
      <div className={styles["cart-container"]}>
        <h1 className={styles["cart-title"]}>Ваша Корзина</h1>
        <div className={styles["cart-content-container"]}>
          <div className={styles["cart-details"]}>
            <div className={styles["cart-item"]}>
              <button className={styles["delete-from-cart-button"]}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <div className={styles["cart-item-image-container"]}>
                <img src={Clothes} alt="" />
              </div>
              <div className={styles["cart-details-info-container"]}>
                <h4 className={styles["cart-item-title"]}>Vetrovka</h4>
                <div className={styles["cart-details-item-related-fixes"]}>
                  <span className={styles["related-fixes-name"]}>
                    <strong>Size: </strong>
                    Large
                  </span>
                  <span className={styles["related-fixes-name"]}>
                    <strong>Color: </strong>
                    Black
                  </span>
                </div>
                <div className={styles["cart-item-price-quantity-container"]}>
                  <h3 className={styles["cart-item-price"]}>550.000 сум</h3>
                  <div className={styles["cart-quantity-controller"]}>
                    <button className={styles["quantity-btn"]}>
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span className={styles["quantity-value"]}>1</span>
                    <button className={styles["quantity-btn"]}>
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles["hr-line"]}></div>
            <div className={styles["cart-item"]}>
            <button className={styles["delete-from-cart-button"]}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <div className={styles["cart-item-image-container"]}>
                <img src=""  />
              </div>
              <div className={styles["cart-details-info-container"]}>
                <h4 className={styles["cart-item-title"]}>Vetrovka</h4>
                <div className={styles["cart-details-item-related-fixes"]}>
                  <span className={styles["related-fixes-name"]}>
                    <strong>Size: </strong>
                    Large
                  </span>
                  <span className={styles["related-fixes-name"]}>
                    <strong>Color: </strong>
                    Black
                  </span>
                </div>
                <div className={styles["cart-item-price-quantity-container"]}>
                  <h3 className={styles["cart-item-price"]}>550.000 сум</h3>
                  <div className={styles["cart-quantity-controller"]}>
                    <button className={styles["quantity-btn"]}>
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span className={styles["quantity-value"]}>1</span>
                    <button className={styles["quantity-btn"]}>
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles["cart-status-container"]}>
            <h2 className={styles["cart-status-subtitle"]}>Order Summary</h2>
            <div className={styles["cart-status-summary-container"]}>
              <div className={styles["cart-status-summary-item"]}>
                <span className={styles["cart-status-summary-name"]}>Subtotal</span>
                <span className={styles["cart-status-summary-price"]}>565.000 сум</span>
              </div>
              <div className={styles["cart-status-summary-item"]}>
                <span className={styles["cart-status-summary-name"]}>Discount (-20%)</span>
                <span className={`${styles["cart-status-summary-price"]} ${styles["discount"]}`}>-113.000 сум</span>
              </div>
              <div className={styles["cart-status-summary-item"]}>
                <span className={styles["cart-status-summary-name"]}>Delivery Fee</span>
                <span className={styles["cart-status-summary-price"]}>50.000 сум</span>
              </div>
              <div className={styles["hr-line"]}></div>
              <div className={styles["cart-status-summary-item"]}>
                <span className={styles["cart-status-summary-name"]}>Total</span>
                <span className={styles["cart-status-summary-price"]}>450.000 сум</span>
              </div>
              <Link to={""} className={styles["checkout-link"]}>Go to checkout</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Cart;
