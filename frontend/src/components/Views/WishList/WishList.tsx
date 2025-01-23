import { PureComponent, ReactNode } from "react";
import styles from "./WishList.module.scss";

class WishList extends PureComponent<WishListProps, WishListState> {
  render(): ReactNode {
    return (
      <div className={styles["wishlist-container"]}>
        WishList component
      </div>
    );
  }
}

export default WishList;