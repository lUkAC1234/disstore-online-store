import { PureComponent, ReactNode } from "react";
import styles from "./Cart.module.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import Clothes from "assets/main/images/main-page/casual.webp"
import EmptyCart from"./Empty/EmptyCart.tsx";

class Cart extends PureComponent<CartProps, CartState> {
  render(): ReactNode {
    return (
      <div className={styles["cart-container"]}>
        {/* <h1 className={styles["cart-title"]}>Ваша Корзина</h1>
        <div className={styles["cart-content-container"]}>
          <div className={styles["cart-details"]}>
            <div className={styles["cart-item"]}>
              <button className={styles["delete-from-cart-button"]}>
                <svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.75 3.5C9.33579 3.5 9 3.83579 9 4.25V5H15V4.25C15 3.83579 14.6642 3.5 14.25 3.5H9.75ZM7.5 4.25V5H3.75C3.33579 5 3 5.33579 3 5.75C3 6.16421 3.33579 6.5 3.75 6.5H4.30005L5.62088 19.9681C5.73386 21.1202 6.70255 21.9985 7.86014 21.9985H16.1399C17.2975 21.9985 18.2661 21.1202 18.3791 19.9681L19.7 6.5H20.25C20.6642 6.5 21 6.16421 21 5.75C21 5.33579 20.6642 5 20.25 5H16.5V4.25C16.5 3.00736 15.4926 2 14.25 2H9.75C8.50736 2 7.5 3.00736 7.5 4.25ZM11 9.75C11 9.33579 10.6642 9 10.25 9C9.83579 9 9.5 9.33579 9.5 9.75V17.25C9.5 17.6642 9.83579 18 10.25 18C10.6642 18 11 17.6642 11 17.25V9.75ZM14.5 9.75C14.5 9.33579 14.1642 9 13.75 9C13.3358 9 13 9.33579 13 9.75V17.25C13 17.6642 13.3358 18 13.75 18C14.1642 18 14.5 17.6642 14.5 17.25V9.75Z" fill="black"></path>
                </svg>
              </button>
              <div className={styles["cart-item-image-container"]}>
                <img src={Clothes} alt="" />
              </div>
              <div className={styles["cart-details-info-container"]}>
                <h4 className={styles["cart-item-title"]}>Vetrovka</h4>
                <div className={styles["cart-details-item-related-fixes"]}>
                  <span className={styles["related-fixes-name"]}>
                    <strong>Размер: </strong>
                    Large
                  </span>
                  <span className={styles["related-fixes-name"]}>
                    <strong>Цвет: </strong>
                    Black
                  </span>
                </div>
                <div className={styles["cart-item-price-quantity-container"]}>
                  <div className={styles["cart-item-price-container"]}>
                    <span className={styles["cart-item-price"]}>550.000 сум</span>
                    <span className={styles["cart-item-previous-price"]}>550.000 сум</span>
                  </div>
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
            <div className={styles["cart-item"]}>
              <button className={styles["delete-from-cart-button"]}>
                  <svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.75 3.5C9.33579 3.5 9 3.83579 9 4.25V5H15V4.25C15 3.83579 14.6642 3.5 14.25 3.5H9.75ZM7.5 4.25V5H3.75C3.33579 5 3 5.33579 3 5.75C3 6.16421 3.33579 6.5 3.75 6.5H4.30005L5.62088 19.9681C5.73386 21.1202 6.70255 21.9985 7.86014 21.9985H16.1399C17.2975 21.9985 18.2661 21.1202 18.3791 19.9681L19.7 6.5H20.25C20.6642 6.5 21 6.16421 21 5.75C21 5.33579 20.6642 5 20.25 5H16.5V4.25C16.5 3.00736 15.4926 2 14.25 2H9.75C8.50736 2 7.5 3.00736 7.5 4.25ZM11 9.75C11 9.33579 10.6642 9 10.25 9C9.83579 9 9.5 9.33579 9.5 9.75V17.25C9.5 17.6642 9.83579 18 10.25 18C10.6642 18 11 17.6642 11 17.25V9.75ZM14.5 9.75C14.5 9.33579 14.1642 9 13.75 9C13.3358 9 13 9.33579 13 9.75V17.25C13 17.6642 13.3358 18 13.75 18C14.1642 18 14.5 17.6642 14.5 17.25V9.75Z" fill="black"></path>
                  </svg>
              </button>
              <div className={styles["cart-item-image-container"]}>
                <img src=""  />
              </div>
              <div className={styles["cart-details-info-container"]}>
                <h4 className={styles["cart-item-title"]}>Vetrovka</h4>
                <div className={styles["cart-details-item-related-fixes"]}>
                  <span className={styles["related-fixes-name"]}>
                    <strong>Размер: </strong>
                    Large
                  </span>
                  <span className={styles["related-fixes-name"]}>
                    <strong>Цвет: </strong>
                    Black
                  </span>
                </div>
                <div className={styles["cart-item-price-quantity-container"]}>
                  <div className={styles["cart-item-price-container"]}>
                    <span className={styles["cart-item-price"]}>550.000 сум</span>
                  </div>
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
            <div className={styles["cart-item"]}>
              <button className={styles["delete-from-cart-button"]}>
                  <svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.75 3.5C9.33579 3.5 9 3.83579 9 4.25V5H15V4.25C15 3.83579 14.6642 3.5 14.25 3.5H9.75ZM7.5 4.25V5H3.75C3.33579 5 3 5.33579 3 5.75C3 6.16421 3.33579 6.5 3.75 6.5H4.30005L5.62088 19.9681C5.73386 21.1202 6.70255 21.9985 7.86014 21.9985H16.1399C17.2975 21.9985 18.2661 21.1202 18.3791 19.9681L19.7 6.5H20.25C20.6642 6.5 21 6.16421 21 5.75C21 5.33579 20.6642 5 20.25 5H16.5V4.25C16.5 3.00736 15.4926 2 14.25 2H9.75C8.50736 2 7.5 3.00736 7.5 4.25ZM11 9.75C11 9.33579 10.6642 9 10.25 9C9.83579 9 9.5 9.33579 9.5 9.75V17.25C9.5 17.6642 9.83579 18 10.25 18C10.6642 18 11 17.6642 11 17.25V9.75ZM14.5 9.75C14.5 9.33579 14.1642 9 13.75 9C13.3358 9 13 9.33579 13 9.75V17.25C13 17.6642 13.3358 18 13.75 18C14.1642 18 14.5 17.6642 14.5 17.25V9.75Z" fill="black"></path>
                  </svg>
              </button>
              <div className={styles["cart-item-image-container"]}>
                <img src=""  />
              </div>
              <div className={styles["cart-details-info-container"]}>
                <h4 className={styles["cart-item-title"]}>Vetrovka</h4>
                <div className={styles["cart-details-item-related-fixes"]}>
                  <span className={styles["related-fixes-name"]}>
                    <strong>Размер: </strong>
                    Large
                  </span>
                  <span className={styles["related-fixes-name"]}>
                    <strong>Цвет: </strong>
                    Black
                  </span>
                </div>
                <div className={styles["cart-item-price-quantity-container"]}>
                  <div className={styles["cart-item-price-container"]}>
                    <span className={styles["cart-item-price"]}>550.000 сум</span>
                  </div>
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
            <h2 className={styles["cart-status-subtitle"]}>Ваш заказ</h2>
            <div className={styles["cart-status-summary-container"]}>
              <div className={styles["cart-status-summary-item"]}>
                <span className={styles["cart-status-summary-name"]}>Товары (1) </span>
                <span className={styles["cart-status-summary-price"]}>565.000 сум</span>
              </div>
              <div className={styles["cart-status-summary-item"]}>
                <span className={styles["cart-status-summary-name"]}>Скидка (-20%)</span>
                <span className={`${styles["cart-status-summary-price"]} ${styles["discount"]}`}>-113.000 сум</span>
              </div>
              <div className={styles["cart-status-summary-item"]}>
                <span className={styles["cart-status-summary-name"]}>Доставка</span>
                <span className={styles["cart-status-summary-price"]}>50.000 сум</span>
              </div>
              <div className={styles["hr-line"]}></div>
              <div className={styles["cart-status-summary-item"]}>
                <span className={styles["cart-status-summary-name"]}>Итого</span>
                <span className={styles["cart-status-summary-price"]}>450.000 сум</span>
              </div>
              <Link to={""} className={styles["checkout-link"]}>Перейти к оформлению</Link>
            </div>
          </div>
        </div> */}
        <EmptyCart />
      </div>
    );
  }
}

export default Cart;
