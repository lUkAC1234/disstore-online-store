import styles from "./CatalogList.module.scss";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import i18next from "i18next";
import UIReact from "utils/classes/UIReact";
import { withContext } from "components/Context/ContextInjector";
import { ClothesListContext } from "components/Context/ContextCollection";
import { ClothesListActions } from "components/Context/ClothesListContext";
import { ClothItem } from "components/Context/ClothesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faSliders } from "@fortawesome/free-solid-svg-icons";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";

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
      return (
        <section className={styles["catalog-section"]}>
          <div className={styles["catalog-container"]}>
            <h2>{`Не удается загрузить данные :(`}</h2>
            <SpinnerLoaderWrapper />
          </div>
        </section>
      );
    }


    const uniqueColors = [
      ...new Map(
        products.flatMap((item) => item.colors).map((item) => [item.color, item])
      ).values(),
    ];

    const uniqueSizes = [
      ...new Map(
        products.flatMap((item) => item.sizes).map((item) => [item.size, item])
      ).values(),
    ];

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
                <h3 className={styles["filters-title"]}>Фильтры</h3>
                <FontAwesomeIcon icon={faSliders} />
              </div>
              <div className={styles["hr-line"]}></div>
              <div className={styles["filters-types"]}>
                {products.some((item) => item.type) ? (
                  products
                    .filter(
                      (item, index, self) =>
                        item.type && self.findIndex((i) => i.type?.id === item.type?.id) === index
                    )
                    .map((item) => (
                      <div key={item.type.id} className={styles["filter-type-column"]}>
                        <h4 className={styles["filter-type-title"]}>{item.type.title}</h4>
                        <FontAwesomeIcon icon={faAngleRight} />
                      </div>
                    ))
                ) : (
                  <h4 className={styles["filter-error"]}>Нету никаких типов одежды</h4>
                )}
              </div>
              <div className={styles["hr-line"]}></div>
              <div className={styles["filters-colors-list"]}>
                <h3 className={styles["filters-colors-title"]}>Цвета</h3>
                <div className={styles["filters-color-wrapper"]}>
                  {uniqueColors.length > 0 ? (
                    uniqueColors.map((item) => (
                      <button
                        key={item.id}
                        className={styles["filters-color-column"]}
                        style={{ backgroundColor: item.color }}
                      >
                      </button>
                    ))
                  ) : (
                    <h4 className={styles["filter-error"]}>Пока что нету никаких цветов одежды</h4>
                  )}
                </div>
              </div>
              <div className={styles["hr-line"]}></div>
              <div className={styles["filters-sizes-list"]}>
                <h3 className={styles["filters-sizes-title"]}>Размеры</h3>
                <div className={styles["filters-sizes-wrapper"]}>
                  {uniqueSizes.length > 0 ? (
                    uniqueSizes.map((item) => (
                      <button key={item.id} className={styles["filters-sizes-column"]}>
                        {item.size}
                      </button>
                    ))
                  ) : (
                    <h4 className={styles["filter-error"]}>Пока что нету никаких размеров одежды</h4>
                  )}
                </div>
              </div>
              <div className={styles["hr-line"]}></div>
              <div className={styles["filters-applying-container"]}>
                <button className={styles["filters-apply-button"]}>
                  Применить фильтры
                </button>
              </div>
            </div>
            <div className={styles["catalog-items-list"]}>
              <div className={styles["catalog-head-subtitle"]}>
                <h1 className={styles["catalog-active-filter"]}>
                  Мужчинам ({products.length})
                </h1>
                <div className={styles["catalog-sort-container"]}>
                  <h3>Сортировать по:</h3>
                  <select name="sort" id="sort" defaultValue="price">
                    <option value="price">Популярности</option>
                    <option value="newest">Новизне</option>
                  </select>
                </div>
              </div>
              {products && products.length > 0 ? (
                products.map((item: ClothItem) => (
                  <div key={item.id} className={styles["catalog-item"]}>
                    <div className={styles["catalog-image-container"]}>
                      <img
                        src={item.catalogImages?.[0]?.image}
                        alt={item.title}
                      />
                    </div>
                    <h2>{item.title}</h2>
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
