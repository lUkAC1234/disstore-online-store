import styles from "./EmptyCart.module.scss";
import { PureComponent, ReactNode } from "react";
import emptyCart from "assets/main/images/emptyStatus/emptyCart.svg"
import LangLink from "components/UI/Link/LangLink";

interface EmptyCartProps {}
interface EmptyCartState {}

class EmptyCart extends PureComponent<EmptyCartProps, EmptyCartState> {
  render(): ReactNode {
    return (
      <div className={styles["empty-cart-container"]}>
        <div className={styles["empty-cart-image-container"]}>
            <img src={emptyCart} alt="" />
        </div>
        <h1 className={styles["empty-cart-error-code"]}>В корзине пока пусто</h1>
        <p className={styles["empty-cart-error-info"]}>Начните с каталога — нужный товар можно найти через поиск или заглянуть в подборки</p>
        <LangLink className={styles["empty-cart-link"]} to={`/catalog`}>Каталог</LangLink>
      </div>
    );
  }
}

export default EmptyCart;
