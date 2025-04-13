import styles from "./404.module.scss"
import { PureComponent, ReactNode } from "react";
import ClothesHanger from "assets/main/images/layout/clothes-hanger.svg"
import { ActionButtonLink } from "components/UI/Html/Elements/Elements";

class Error404 extends PureComponent {
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
      <section className={styles["page-not-found-section"]}>
        <div className={styles["page-not-found-container"]}>
          <div className={styles["error-clothes-hanger-container"]}>
            <img src={ClothesHanger} alt="image of clothes hanger" />
          </div>
          <div className={styles["error-code-container"]}>
            <h1 className={styles["page-not-found-error"]}>404</h1>
          </div>
          <h2 className={styles["page-not-found-error-subtitle"]}>Упс! Страница не найдена</h2>
          <p className={styles["page-not-found-info"]}>Страница, которую вы ищете, могла быть удалена или временно недоступна.</p>
          <div className={styles["page-not-found-links-container"]}>
            <ActionButtonLink white to={`/`} className={styles["page-not-found-link-home"]}>Вернуться домой</ActionButtonLink>
            <ActionButtonLink to={`/catalog`} className={styles["page-not-found-link-home"]}>Каталог</ActionButtonLink>
          </div>
        </div>
      </section>
    )
  }
}

export default Error404;