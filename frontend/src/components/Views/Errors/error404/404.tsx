import styles from "./404.module.scss"
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import i18next from "i18next";
const lang = i18next.language;

export default function Error404(): ReactNode {
  return (
    <section className={styles["page-not-found-section"]}>
      <div className={styles["page-not-found-container"]}>
        <h1 className={styles["page-not-found-error"]}>
          <span className={styles["error-left-number"]}>4</span> 
          <span className={styles["error-center-number"]}>0</span> 
          <span className={styles["error-right-number"]}>4</span>
        </h1>
        <h2 className={styles["page-not-found-error-subtitle"]}>Упс! Страница не найдена</h2>
        <p className={styles["page-not-found-info"]}>Страница, которую вы ищете, могла быть удалена или временно недоступна.</p>
        <div className={styles["page-not-found-links-container"]}>
          <Link to={`/${lang}`} className={styles["page-not-found-link-home"]}>Вернуться домой</Link>
          <Link to={`/${lang}/catalog`} className={styles["page-not-found-link-catalog"]}>Каталог</Link>
        </div>
      </div>
    </section>
  )
}
