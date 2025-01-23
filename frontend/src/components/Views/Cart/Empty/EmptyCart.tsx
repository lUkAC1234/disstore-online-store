import styles from "./EmptyCart.module.scss";
import { PureComponent, ReactNode } from "react";
import { Link } from "react-router-dom";
import emptyCart from "assets/main/images/emptyStatus/emptyCart.svg"
import i18next from "i18next";

const lang: string = i18next.language;

class EmptyCart extends PureComponent<CartProps, CartState> {
  render(): ReactNode {
    return (
      <div className={styles["empty-cart-container"]}>
        <div className={styles["empty-cart-image-container"]}>
            <img src={emptyCart} alt="" />
        </div>
        <h1 className={styles["empty-cart-error-code"]}>В корзине пока пусто</h1>
        <p className={styles["empty-cart-error-info"]}>Начните с каталога — нужный товар можно найти через поиск или заглянуть в подборки</p>
        <Link className={styles["empty-cart-link"]} to={`/${lang}/catalog`}>Каталог</Link>
      </div>
    );
  }
}

export default EmptyCart;
