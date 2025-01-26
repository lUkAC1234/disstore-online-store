import { PureComponent, ReactNode } from "react";
import styles from "./WishList.module.scss";

class WishList extends PureComponent<WishListProps, WishListState> {
  async componentDidMount(): Promise<void> {
    if (document.documentElement.scrollTop > 0) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }
  render(): ReactNode {
    return (
      <div className={styles["wishlist-container"]}>
        WishList component
      </div>
    );
  }
}

export default WishList;