import { ReactNode } from "react";
import styles from "./CatalogList.module.scss";
import { Link } from "react-router-dom";
import i18next from "i18next";
import UIReact from "utils/classes/UIReact";
import { withContext } from "components/Context/ContextInjector";
import { ClothesListContext } from "components/Context/ContextCollection";
import { ClothesListActions } from "components/Context/ClothesListContext";
import { Size, Clothestypes, Color, ClothItem } from "components/Context/ClothesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faAngleRight, faCartShopping, faSliders, faXmark } from "@fortawesome/free-solid-svg-icons";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";
import { fetchFilters, fetchFilteredProducts } from "./CatalogList.utils.ts";
import RangeSliderDual from "components/RangeSlider/RangeSliderDual.tsx";
import { debounce } from "utils/hooks/debounce.ts";
import CatalogErrorPage from "./CatalogError/CatalogErrorPage.tsx";
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

  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.addEventListener("mousedown", this.filtersHandleClickOutside, {
      signal: this.controller.signal,
    });
    this.filterPrice()
    this.initializeFiltersAndPrices();
  }

  initializeFiltersAndPrices = async () => {
    try {
      const [sizes, type, colors] = await fetchFilters();
      this.setState({
        sizes,
        type,
        colors,
      });
    } catch (error) {
      console.error("Error initializing filters and prices", error);
    }
  };

  componentDidUpdate(prevProps: Readonly<ClothesListActions>, prevState: Readonly<CatalogState>, snapshot?: unknown): void {
    if (prevProps.min !== this.props.min || prevProps.max !== this.props.max) {
      this.filterPrice()
    }
  }

  filterPrice() {
    this.setState({
      min: this.props.min,
      max: this.props.max,
      selectedMin: this.props.min,
      selectedMax: this.props.max,
    });
  }

  resetFilters = () => {
    this.setState(
      {
        selectedSizes: [],
        selectedTypes: [],
        selectedColors: [],
        selectedMin: this.state.min,
        selectedMax: this.state.max,
      },
      this.debouncedLoadFilteredProducts
    );
  };

  debouncedLoadFilteredProducts = debounce(() => {
    this.loadFilteredProducts();
  }, 250);

  loadFilteredProducts = async () => {
    try {
      this.props.setLoadingProducts(true);

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
    } catch (error) {
      console.error("Error loading filtered products", error);
    } finally {
      this.props.setLoadingProducts(false);
    }
  };

  toggleFilter = () => {
    this.setState((prevState) => ({ isFilterActive: !prevState.isFilterActive }));
  };

  filtersHandleClickOutside = (event) => {
    const filterContainer = document.querySelector(`.${styles["catalog-filter-container"]}`);
    if (filterContainer && !filterContainer.contains(event.target)) {
      this.setState({ isFilterActive: false });
    }
  };

  handlePriceInputChange = (field: "selectedMin" | "selectedMax", value: number) => {
    this.setState((prevState) => {
      const correctedValue = Math.max(
        prevState.min,
        Math.min(prevState.max, value)
      );
      return { [field]: correctedValue } as Pick<CatalogState, typeof field>;
    });
  };

  handleFilterSelection = (field: "selectedSizes" | "selectedTypes" | "selectedColors", id: number) => {
    this.setState((prevState) => {
      const isSelected = prevState[field].includes(id);
      return {
        [field]: isSelected
          ? prevState[field].filter((item) => item !== id)
          : [...prevState[field], id],
      } as Pick<CatalogState, typeof field>;
    });
  };

  render(): ReactNode {
    const { loading, error, products } = this.props;
    const { type, colors, sizes, selectedMin, selectedMax } = this.state;

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
                <button 
                  className={styles["filters-title-button"]}
                  onClick={this.toggleFilter}
                >
                  <FontAwesomeIcon icon={this.state.isFilterActive ? faXmark : faSliders} />
                </button>
              </div>
              <div className={styles["hr-line"]}></div>
              <div className={styles["filters-types"]}>
                {type.length > 0 ? (
                  type.map((item) => (
                    <button
                      key={item.id}
                      className={`${styles["filter-type-column"]} ${this.state.selectedTypes.includes(item.id) ? styles["active"] : ""
                        }`}
                      onClick={() => this.handleFilterSelection("selectedTypes", item.id)}
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
                  <h4 className={styles["price-filter-subtitle"]}>Цена, сум</h4>
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
                  <label htmlFor="">
                    От
                    <input
                      type="number"
                      value={selectedMin}
                      onChange={(e) =>
                        this.handlePriceInputChange("selectedMin", Number(e.target.value))
                      }
                    />
                  </label>
                  <label htmlFor="">
                    До
                    <input
                      type="number"
                      value={selectedMax}
                      onChange={(e) =>
                        this.handlePriceInputChange("selectedMax", Number(e.target.value))
                      }
                    />
                  </label>
                </div>
              </div>
              <div className={styles["hr-line"]}></div>
              <div className={styles["filters-colors-list"]}>
                <h3 className={styles["filters-colors-title"]}>Цвета</h3>
                <div className={styles["filters-color-wrapper"]}>
                  {colors.length > 0 ? (
                    colors.map((item) => (
                      <button
                        key={item.id}
                        className={`${styles["filters-color-column"]} ${this.state.selectedColors.includes(item.id) ? styles["active"] : ""
                          }`}
                        style={{
                          backgroundColor: item.color,
                        }}
                        onClick={() => this.handleFilterSelection("selectedColors", item.id)}
                      ></button>
                    ))
                  ) : (
                    <h4 className={styles["filter-error"]}>
                      Пока что нету никаких цветов одежды
                    </h4>
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
                        className={`${styles["filters-sizes-column"]} ${this.state.selectedSizes.includes(item.id) ? styles["active"] : ""
                          }`}
                        onClick={() => this.handleFilterSelection("selectedSizes", item.id)}
                      >
                        {item.size}
                      </button>
                    ))
                  ) : (
                    <h4 className={styles["filter-error"]}>
                      Пока что нету никаких размеров одежды
                    </h4>
                  )}
                </div>
              </div>
              <div className={styles["hr-line"]}></div>
              <div className={styles["add-to-cart-button-container"]}>
                <button
                  className={styles["add-to-cart-button"]}
                  onClick={this.debouncedLoadFilteredProducts}>Применить фильтры
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
              {this.props.loadingProducts ? (
                <SpinnerLoaderWrapper relativeCentered />
              ) : products && products.length > 0 ? (
                <div className={styles["catalog-items-wrapper"]}>
                  {products.map((item: ClothItem) => (
                    <div key={item.id} className={styles["catalog-item"]}>
                      <Link
                        className={styles["catalog-item-link"]}
                        to={`/${lang}/catalog/clothes/${item.slug}`}
                      ></Link>
                      <div className={styles["catalog-item-wishlist-cart-container"]}>
                        <Link to={""} className={styles["catalog-add-wishlist-cart-link"]}>
                          <FontAwesomeIcon icon={faCartShopping} />
                        </Link>
                        <Link to={""} className={styles["catalog-add-wishlist-cart-link"]}>
                          <FontAwesomeIcon icon={faHeart} />
                        </Link>
                      </div>
                      <div className={styles["catalog-image-container"]}>
                        {item.discount > 0 && (
                          <span className={styles["catalog-discount"]}>-{item.discount}%</span>
                        )}
                        {item?.catalogImages?.[0]?.thumbnail ? (
                          <img
                            src={item.catalogImages[0].thumbnail}
                            alt={item.title || "Рисунок"}
                            loading="lazy"
                            decoding="async"
                            onLoad={(e) => {
                              const imgElement = e.target as HTMLImageElement;
                              const mainImage = item.catalogImages[0]?.image;
                              if (mainImage) {
                                imgElement.src = mainImage;
                              }
                            }}
                          />
                        ) : (
                          <SpinnerLoaderWrapper />
                        )}
                      </div>
                      <h2 className={styles["catalog-item-title"]}>
                        {item.title.length > 20 ? `${item.title.slice(0, 20)}...` : item.title}
                      </h2>
                      <p className={styles["catalog-item-description"]}>
                        {item.short_description.length > 40 ? `${item.short_description.slice(0, 40)}...` : item.short_description}
                      </p>
                      {item.count > 0 ? (
                        <p className={styles["catalog-item-count"]}>В наличии <strong className={styles["count"]}>{item.count}</strong></p>
                      ) : (
                        <p className={styles["catalog-item-count"]}>Товар закончился</p>
                      )}
                      <bdi className={styles["catalog-price-container"]}>
                        <span className={styles["catalog-real-price"]}>
                          {item.real_price.toLocaleString("en-US")} сум
                        </span>
                        {item.discount > 0 && (
                          <span className={styles["catalog-price"]}>
                            {item.price.toLocaleString("en-US")} сум
                          </span>
                        )}
                      </bdi>
                    </div>
                  ))}
                </div>
              ) : (
                <CatalogErrorPage
                  resetFilters={this.resetFilters}
                  error={"К сожалению, данные отсутствуют"}
                />
              )}
            </div>
          </div>
        </div>
      </section >
    );
  }
}

const UICatalogList = withContext(ClothesListContext, CatalogList);

export default UICatalogList;
