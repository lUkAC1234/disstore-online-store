import styles from "./CatalogList.module.scss";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import i18next from "i18next";
import UIReact from "utils/classes/UIReact";
import { withContext } from "components/Context/ContextInjector";
import { ClothesListContext } from "components/Context/ContextCollection";
import { ClothesListActions } from "components/Context/ClothesListContext";
import { Size, Clothestypes, Color, ClothItem } from "components/Context/ClothesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faSliders, faXmark } from "@fortawesome/free-solid-svg-icons";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";
import { fetchFilters, fetchFilteredProducts } from "./CatalogList.utils.ts";
import RangeSliderDual from "components/RangeSlider/RangeSliderDual.tsx";
import { debounce } from "utils/hooks/debounce.ts";
import { origin } from "../../../../project.config.json";
import CatalogErrorPage from "./CatalogError/CatalogErrorPage.tsx";

const lang: string = i18next.language;

interface CatalogState {
  isFilterActive: boolean;
  sizes: Size[];
  type: Clothestypes[];
  colors: Color[];
  selectedSizes: number[];
  selectedTypes: number[];
  selectedColors: number[];
  min: number;
  max: number;
  selectedMin: number;
  selectedMax: number;
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
    min: 0,
    max: 0,
    selectedMin: 0,
    selectedMax: 0,
  };

  async componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.addEventListener(
      "mousedown",
      this.filtersHandleClickOutside,
      { signal: this.controller.signal }
    );
    try {
      const [sizes, type, colors] = await fetchFilters();
      this.setState((prevstate) => ({
        ...prevstate,
        sizes, type, colors,
        min: this.props.min,
        max: this.props.max,
        selectedMin: this.props.min,
        selectedMax: this.props.max
      }))
    } catch (error) {
      console.error(error);
    }
  }

  async fetchMinMaxPricesRange(): Promise<void> {
    try {
      const response = await fetch(`${origin}clothes/`)
      if (!response.ok) {
        throw new Error("Bro you cooked")
      }
      const data = await response.json()
      this.setState((prevstate) => ({
        ...prevstate,
        min: data.price_min,
        max: data.price_max,
        selectedMin: data.price_min,
        selectedMax: data.price_max
      }))
    }
    catch (err) {
      console.error(err)
    }
  }

  componentDidUpdate(prevProps: Readonly<ClothesListActions>, prevState: Readonly<CatalogState>) {
    if (
      prevState.selectedColors !== this.state.selectedColors ||
      prevState.selectedSizes !== this.state.selectedSizes ||
      prevState.selectedTypes !== this.state.selectedTypes
    ) {
      this.loadFilteredProducts();
    }
    else if (
      prevState.selectedMin !== this.state.selectedMin ||
      prevState.selectedMax !== this.state.selectedMax) {
      this.debouncedloadFilteredProducts();
    }

    if (
      prevProps.min !== this.props.min ||
      prevProps.max !== this.props.max
    ) {
      this.setState((prevstate) => ({
        ...prevstate,
        min: this.props.min,
        max: this.props.max,
        selectedMin: this.props.min,
        selectedMax: this.props.max
      }))
    }
  }

  resetFilters = async () => {
    this.setState(
      {
        selectedSizes: [],
        selectedTypes: [],
        selectedColors: [],
        selectedMin: this.state.min,
        selectedMax: this.state.max,
      },
      () => {
        this.debouncedloadFilteredProducts();
      }
    );
  };


  debouncedloadFilteredProducts = debounce(async () => {
    await this.loadFilteredProducts()
  }, 500);

  async loadFilteredProducts() {
    try {
      const products = await fetchFilteredProducts(
        this.state.selectedColors,
        this.state.selectedSizes,
        this.state.selectedTypes,
        this.state.colors,
        this.state.sizes,
        this.state.type,
        { min: this.state.selectedMin, max: this.state.selectedMax }
      );
      this.props.setProducts(products.products);
    } catch (err) {
      console.error(err);
    }
  };

  toggleFilter = () => {
    this.setState((prevState) => ({
      isFilterActive: !prevState.isFilterActive,
    }));
  };

  filtersHandleClickOutside = (event) => {
    const filterContainer = document.querySelector(`.${styles["catalog-filter-container"]}`);
    if (filterContainer && !filterContainer.contains(event.target)) {
      this.setState({ isFilterActive: false });
    }
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
            Каталог
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
                      className={`${styles["filter-type-column"]} ${this.state.selectedTypes.findIndex(value => value === item.id) !== -1 ? styles["active"] : ''}`}
                      onClick={() => {
                        this.setState(prevState => {
                          const isSelected = prevState.selectedTypes.includes(item.id);

                          return {
                            ...prevState,
                            selectedTypes: isSelected
                              ? prevState.selectedTypes.filter(id => id !== item.id)
                              : [...prevState.selectedTypes, item.id],
                          };
                        });
                      }}
                    >
                      {item.title}
                      <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                  ))
                ) : (
                  <h4 className={styles["filter-error"]}>Нету никаких типов одежды</h4>
                )}
              </div>

              <div className={styles["hr-line"]}></div>
              <div className={styles["price-filter-container"]}>
                <div className={styles["price-filter-header"]}>
                  <h4 className={styles["price-filter-subtitle"]}>Цена</h4>
                </div>

                <RangeSliderDual
                  step={1}
                  min={this.state.min}
                  max={this.state.max}
                  values={[this.state.selectedMin, this.state.selectedMax]}
                  setValues={(values) => this.setState(prevstate => ({
                    ...prevstate,
                    selectedMin: values[0],
                    selectedMax: values[1]
                  }))}

                />
                <div className={styles["price-filter-info-text-container"]}>
                  <span>{this.state.selectedMin}</span>
                  <span>{this.state.selectedMax}</span>
                </div>
              </div>
              <div className={styles["hr-line"]}></div>
              <div className={styles["filters-colors-list"]}>
                <h3 className={styles["filters-colors-title"]}>Цвета</h3>
                <div className={styles["filters-color-wrapper"]}>
                  {colors.length > 0 ? (
                    colors.map((item) => {
                      return <button
                        key={item.id}
                        className={`${styles["filters-color-column"]} ${this.state.selectedColors.findIndex(value => value === item.id) !== -1 ? styles["active"] : ''}`}
                        style={{
                          backgroundColor: item.color,
                        }}
                        onClick={() => {
                          this.setState(
                            prevState => ({
                              ...prevState,
                              selectedColors: prevState.selectedColors.includes(item.id)
                                ? prevState.selectedColors.filter(id => id !== item.id)
                                : [...prevState.selectedColors, item.id],
                            }),
                          );
                        }}
                      >
                      </button>
                    })
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
                        className={`${styles["filters-sizes-column"]} ${this.state.selectedSizes.findIndex(value => value === item.id) !== -1 ? styles["active"] : ''}`}
                        onClick={() => {
                          this.setState(
                            prevState => ({
                              ...prevState,
                              selectedSizes: prevState.selectedSizes.includes(item.id)
                                ? prevState.selectedSizes.filter(id => id !== item.id)
                                : [...prevState.selectedSizes, item.id],
                            }),
                          );
                        }}
                      >
                        {item.size}
                      </button>
                    ))
                  ) : (
                    <h4 className={styles["filter-error"]}>Пока что нету никаких размеров одежды</h4>
                  )}
                </div>
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
                  <h1 className={styles["catalog-active-filter-title"]}>Каталог</h1>
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
              {products && products.length > 0 ? (
                <div className={styles["catalog-items-wrapper"]}>
                  {products.map((item: ClothItem) => (
                    <Link
                      className={styles["catalog-item-link"]}
                      key={item.id}
                      to={`/${lang}/catalog/clothes/${item.slug}`}
                    >
                      <div className={styles["catalog-item"]}>
                        <div className={styles["catalog-image-container"]}>
                          {item.catalogImages?.[0]?.image ? (
                            <img
                              src={`${origin}${item.catalogImages[0].image}`}
                              alt={item.title || "Image"}
                            />
                          ) : (
                            <SpinnerLoaderWrapper />
                          )}
                        </div>
                        <h2 className={styles["catalog-item-title"]}>{item.title}</h2>
                        <p className={styles["catalog-item-description"]}>{item.short_description}</p>
                        <p className={styles["catalog-item-description"]}>Осталось в наличии <strong>{item.count}</strong></p>
                        <bdi className={styles["catalog-price-container"]}>
                          <span className={styles["catalog-real-price"]}>
                            {item.real_price.toLocaleString("en-US")} сум
                          </span>
                          {item.discount && (
                            <>
                              <span className={styles["catalog-price"]}>
                                {item.price.toLocaleString("en-US")} сум
                              </span>
                              <span className={styles["catalog-discount"]}>-{item.discount}%</span>
                            </>
                          )}
                        </bdi>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <CatalogErrorPage
                  resetFilters={this.resetFilters}
                  error={"К сожалению, на данный момент данные с этими фильтрами/поисковыми запросами отсутствуют"}
                />
              )}

            </div>
          </div>
        </div>
      </section>
    );
  }
}

const UICatalogList = withContext(ClothesListContext, CatalogList);

export default UICatalogList;
