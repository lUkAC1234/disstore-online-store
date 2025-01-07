import styles from "./CatalogList.module.scss";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import i18next from "i18next";
import UIReact from "utils/classes/UIReact";
import { withContext } from "components/Context/ContextInjector";
import { ClothesListContext } from "components/Context/ContextCollection";
import { ClothesListActions } from "components/Context/ClothesListContext";
import {
  Clothestypes,
  ClothItem,
  Size,
  Color,
} from "components/Context/ClothesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faSliders,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";
import { origin } from "../../../../project.config.json";

const lang: string = i18next.language;

interface CatalogState {
  isFilterActive: boolean;
  sizes: Size[];
  type: Clothestypes[];
  colors: Color[];
  selectedSizes: number[];
  selectedTypes: number[];
  selectedColors: number[];
}

class CatalogList extends UIReact<ClothesListActions, CatalogState> {
  state: CatalogState = {
    selectedSizes: [],
    selectedTypes: [],
    selectedColors: [],
    isFilterActive: false,
    sizes: [],
    type: [],
    colors: [],
  };

  async componentDidMount() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    try {
      const [sizes, type, colors] = await this.fetchFilters();
      this.setState({ sizes, type, colors });
    } catch (error) {
      console.error("Failed to fetch filters:", error);
    }
  }

  fetchFilters = async (): Promise<[Size[], Clothestypes[], Color[]]> => {
    const cachedSizes = sessionStorage.getItem("sizes");
    const cachedTypes = sessionStorage.getItem("types");
    const cachedColors = sessionStorage.getItem("colors");

    if (cachedSizes && cachedTypes && cachedColors) {
      return [
        JSON.parse(cachedSizes),
        JSON.parse(cachedTypes),
        JSON.parse(cachedColors),
      ];
    }

    const [sizesData, typeData, colorsData] = await Promise.all([
      fetch(`${origin}sizes/`).then((res) => res.json()),
      fetch(`${origin}types/`).then((res) => res.json()),
      fetch(`${origin}colors/`).then((res) => res.json()),
    ]);

    sessionStorage.setItem("sizes", JSON.stringify(sizesData));
    sessionStorage.setItem("types", JSON.stringify(typeData));
    sessionStorage.setItem("colors", JSON.stringify(colorsData));

    return [sizesData, typeData, colorsData];
  };

  toggleFilter = () => {
    this.setState((prevState) => ({
      isFilterActive: !prevState.isFilterActive,
    }));
  };

  render(): ReactNode {
    const { loading, error, products } = this.props;
    const { type, colors, sizes } = this.state;

    if (loading) return <SpinnerLoaderWrapperFixed />;

    if (error) {
      return (
        <section className={styles["catalog-section"]}>
          <div className={styles["catalog-container"]}>
            <h2>{`Не удается загрузить данные :(`}</h2>
            <SpinnerLoaderWrapper />
          </div>
        </section>
      );
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
            <div className={`${styles["catalog-filter-container"]} ${this.state.isFilterActive ? styles["active"] : ''}`}>
              <div className={styles["filters-title-container"]}>
                <h3 className={styles["filters-title"]}>Фильтры</h3>
                {this.state.isFilterActive ? (
                  <button
                    className={styles["filters-reset-mobile"]}
                    onClick={this.toggleFilter}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                ) : (
                  <FontAwesomeIcon icon={faSliders} />
                )}
              </div>
              <div className={styles["hr-line"]}></div>
              <div className={styles["filters-types"]}>
                {type.length > 0 ? (
                  type.map((item) => (
                    <button
                      key={item.id}
                      className={styles["filter-type-column"]}
                      onClick={() => {
                        this.setState(prevState => {
                            const originalSelectedTypes = [...prevState.selectedTypes];
                            const indexFound: number = originalSelectedTypes.findIndex(index => index === item.id);
                            const hasItem: boolean = indexFound !== -1;

                            if (hasItem) {
                                originalSelectedTypes.splice(indexFound, 1);
                            } else {
                                originalSelectedTypes.push(item.id);
                            }

                            return {
                                ...prevState,
                                selectedTypes: originalSelectedTypes,
                            };
                        });
                      }}
                    >
                      <h4
                        className={styles["filter-type-title"]}
                        style={{
                            background: this.state.selectedTypes.findIndex(value => value === item.id) !== -1 ? "black" : "",
                            color: this.state.selectedTypes.findIndex(value => value === item.id) !== -1 ? "white" : ""
                        }}
                      >{item.title}</h4>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                  ))
                ) : (
                  <h4 className={styles["filter-error"]}>Нету никаких типов одежды</h4>
                )}
              </div>
              <input type="range" />
              <div className={styles["hr-line"]}></div>
              <div className={styles["filters-colors-list"]}>
                <h3 className={styles["filters-colors-title"]}>Цвета</h3>
                <div className={styles["filters-color-wrapper"]}>
                  {colors.length > 0 ? (
                    colors.map((item) => (
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
                  {sizes.length > 0 ? (
                    sizes.map((item) => (
                      <button
                        key={item.id}
                        className={styles["filters-sizes-column"]}
                      >
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
              <div className={styles["catalog-head-subtitle-container"]}>

                <div className={styles["catalog-active-filter"]}>
                  <button
                    className={styles["filters-mobile-version"]}
                    onClick={this.toggleFilter}
                  >
                    <FontAwesomeIcon icon={faSliders} />
                  </button>
                  <h1 className={styles["catalog-active-filter-title"]}>Мужчинам</h1>
                </div>
                <div className={styles["catalog-sort-container"]}>
                  <h3 className={styles["sort-info-title"]}>Сортировать по:</h3>
                  <select
                    className={styles["catalog-sorting"]}
                    name="sort"
                    id="sort"
                    defaultValue="price"
                  >
                    <option className={styles["sort-option"]} value="price">Популярности</option>
                    <option className={styles["sort-option"]} value="newest">Новизне</option>
                  </select>
                </div>
              </div>
              <div className={styles["catalog-items-wrapper"]}>
                {products && products.length > 0 ? (
                  products.map((item: ClothItem) => {
                    const foundItemId: number = this.state.selectedTypes.findIndex(itemId => itemId === item.id);
                    const hasItem: boolean = foundItemId !== -1;

                    const template: ReactNode = <Link key={item.id} to={`/${lang}/catalog/clothes/${item.slug}`}>
                      <div className={styles["catalog-item"]}>
                        <div className={styles["catalog-image-container"]}>
                          {item.catalogImages?.[0]?.image ? (
                            <img
                              src={item.catalogImages[0].image}
                              alt={item.title || "Image"}
                            />
                          ) : (
                            <SpinnerLoaderWrapper />
                          )}
                        </div>
                        <h2 className={styles["catalog-item-title"]}>{item.title}</h2>
                        <p className={styles["catalog-item-description"]}>{item.short_description}</p>
                        <bdi className={styles["catalog-price-container"]}>
                          <span className={styles["catalog-real-price"]}>{item.real_price.toLocaleString('en-US')} сум</span>
                          {item.discount ? (
                            <>
                              <span className={styles["catalog-price"]}>{item.price.toLocaleString('en-US')} сум</span>
                              <span className={styles["catalog-discount"]}>-{item.discount}%</span>
                            </>
                          ) : null}
                        </bdi>
                      </div>
                    </Link>;

                    if (this.state.selectedTypes.length === 0 || hasItem) {
                        return template;
                    }
                    })
                ) : (
                  <p>Подходящих товаров не найдено</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const UICatalogList = withContext(ClothesListContext, CatalogList);

export default UICatalogList;
