import { ReactNode } from "react";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";
import { Link } from "react-router-dom";
import i18next from "i18next";
import UIReact from "utils/classes/UIReact";
import { withContext } from "components/Context/ContextInjector";
import { ClothesListContext } from "components/Context/ContextCollection";
import { ClothesListActions } from "components/Context/ClothesListContext";
import { ClothItem } from "components/Context/ClothesContext";
import styles from "./CatalogList.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faSliders } from "@fortawesome/free-solid-svg-icons";

const lang: string = i18next.language;

class CatalogList extends UIReact<ClothesListActions, ClothItem> {
  componentDidMount() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  render(): ReactNode {
    const { products } = this.props;

    if (this.props.loading) {
      return <SpinnerLoaderWrapperFixed />;
    }

    if (this.props.error) {
      return <h1>Ойй, Что-то пошло не так !!!</h1>;
    }

    return (
      <section className={styles["catalog-section"]}>
        <div className={styles["catalog-container"]}>
          <div className="catalog-link-way">
            <Link to={`/${lang}/`}>Главная</Link>
            <FontAwesomeIcon icon={faAngleRight} />
            <Link to={`/${lang}/catalog`}>Каталог</Link>
            <FontAwesomeIcon icon={faAngleRight} />
            Мужчинам
          </div>
          <div className={styles["catalog-wrapper"]}>
            <div className={styles["catalog-filter-container"]}>
              <div className={styles["filters-title-container"]}>
                <h3 className={styles["filters-title"]}>Filters</h3>
                <FontAwesomeIcon icon={faSliders} />
              </div>
              <div className={styles["hr-line"]}></div>
              <div className={styles["filters-types"]}>
                {products.some((item) => item.type) ? (
                  products.map((item: ClothItem) => (
                    item.type && (
                      <div key={item.id} className={styles["filter-type"]}>
                        <h4>{item.type.title}</h4>
                      </div>
                    )
                  ))
                ) : (
                  <div className={styles["filter-type"]}>
                    <h2>No types available</h2>
                  </div>
                )}
              </div>
            </div>
            <div className={styles["catalog-items-list"]}>
              {products && products.length > 0 ? (
                products.map((item: ClothItem) => (
                  <div key={item.id} className={styles["catalog-item"]}>

                    <h2>{item.title}</h2>
                    <h2>{item.short_description}</h2>
                    <img
                      src={item.catalogImages?.[0]?.image}
                      alt={item.title}
                    />
                    <Link to={`/${lang}/catalog/clothes/${item.slug}`}>View Details</Link>
                  </div>
                ))
              ) : (
                <p>No items available</p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withContext(ClothesListContext, CatalogList);
