import styles from "./CatalogList.module.scss";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import i18next from "i18next";
import UIReact from "utils/classes/UIReact";
import { withContext } from "components/Context/ContextInjector";
import { ClothesListContext, UserContext } from "components/Context/ContextCollection";
import { ClothesListActions } from "components/Context/ClothesListContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faSliders } from "@fortawesome/free-solid-svg-icons";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";
import RangeSliderDual from "components/RangeSlider/RangeSliderDual.tsx";
import CatalogErrorPage from "./CatalogError/CatalogErrorPage.tsx";
import CatalogPagination from "./CatalogPagination/CatalogPagination.tsx";
import CatalogProducts from "./CatalogProductsList/Products.tsx";
import { UserContextActions } from "components/Context/UserContext.tsx";

const lang: string = i18next.language;

interface CatalogState {
  isFilterActive: boolean;
  activeColors: boolean;
  activeSizes: boolean;
}

interface CatalogListProps extends ClothesListActions, UserContextActions { }

class CatalogList extends UIReact<CatalogListProps, CatalogState> {
  state: CatalogState = {
    isFilterActive: false,
    activeColors: true,
    activeSizes: true,
  };

  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.addEventListener("mousedown", this.filtersHandleClickOutside, {
      signal: this.controller.signal,
    });
  }

  toggleFilter = () => {
    this.setState((prevState) => ({ isFilterActive: !prevState.isFilterActive }));
  };

  toggleColors = () => {
    this.setState((prevState) => ({ activeColors: !prevState.activeColors }));
  }

  toggleSizes = () => {
    this.setState((prevState) => ({ activeSizes: !prevState.activeSizes }));
  }

  filtersHandleClickOutside = (event) => {
    const filterContainer = document.querySelector(`.${styles["catalog-filter-container"]}`);
    if (filterContainer && !filterContainer.contains(event.target)) {
      this.setState({ isFilterActive: false });
    }
  };

  render(): ReactNode {
    const { loading, error, products, type, colors, sizes, currentPage, totalPages } = this.props;

    if (loading) return <SpinnerLoaderWrapperFixed />;

    if (error) {
      return (
        <CatalogErrorPage error={"К сожалению, не удалось загрузить данные"} />
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
                  <FontAwesomeIcon icon={faSliders} />
                </button>
              </div>
              <div className={styles["hr-line"]}></div>
              <div className={styles["filters-types"]}>
                {type.length > 0 ? (
                  type.map((item) => (
                    <button
                      key={item.id}
                      className={`${styles["filter-type-column"]} ${this.props.selectedTypes.includes(item.id) ? styles["active"] : ""
                        }`}
                      onClick={() => this.props.handleFilterSelection("selectedTypes", item.id)}
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
                  min={this.props.min}
                  max={this.props.max}
                  values={[this.props.selectedMin, this.props.selectedMax]}
                  setValues={(values) => this.props.setSelectedPriceMinMax(values)}
                />
                <div className={styles["price-filter-info-text-container"]}>
                  <label>
                    От
                    <input
                      type="number"
                      value={this.props.selectedMin}
                      onChange={(e) => {
                        const value: number = Number(e.target.value);
                        if (value < this.props.min || value >= this.props.max) {
                          return;
                        }
                        this.props.setSelectedMin(value);
                      }}
                    />
                  </label>
                  <label>
                    До
                    <input
                      type="number"
                      value={this.props.selectedMax}
                      onChange={(e) => {
                        const value: number = Number(e.target.value);
                        if (value > this.props.max || value <= this.props.min) {
                          return;
                        }
                        this.props.setSelectedMax(value)
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className={styles["hr-line"]}></div>
              <div className={styles["filters-colors-list"]}>
                <button
                  className={`${styles["filters-colors-head-button"]} ${this.state.activeColors ? styles["active"] : ""
                    }`}
                  onClick={() => this.toggleColors()}
                >
                  <h3 className={styles["filters-colors-title"]}>Цвета</h3>
                  <FontAwesomeIcon icon={faAngleRight} />
                </button>
                <div className={styles["filters-color-wrapper"]}>
                  {colors.length > 0 ? (
                    colors.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => this.props.handleFilterSelection("selectedColors", item.id)}
                        className={
                          `
                          ${styles["filters-color-button"]} 
                          ${this.props.selectedColors.includes(item.id) ? styles["active"] : ""}
                          `
                        }
                      >
                        <div
                          className={
                            `
                            ${styles["filters-color"]} 
                            ${this.props.selectedColors.includes(item.id) ? styles["active"] : ""}
                            `
                          }
                          style={{
                            backgroundColor: item.color,
                          }}>
                        </div>
                        <span className={styles['filters-color-name']}>{item.name}</span>
                      </button>
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
                <button
                  className={`${styles["filters-sizes-head-button"]} ${this.state.activeSizes ? styles["active"] : ""
                    }`}
                  onClick={() => this.toggleSizes()}
                >
                  <h3 className={styles["filters-sizes-title"]}>Размеры</h3>
                  <FontAwesomeIcon icon={faAngleRight} />
                </button>
                <div className={styles["filters-sizes-wrapper"]}>
                  {sizes.length > 0 ? (
                    sizes.map((item) => (
                      <button
                        key={item.id}
                        className={`${styles["filters-sizes-column"]} ${this.props.selectedSizes.includes(item.id) ? styles["active"] : ""
                          }`}
                        onClick={() => this.props.handleFilterSelection("selectedSizes", item.id)}
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
                  onClick={this.props.setApplyFilters}>Применить фильтры
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
              </div>
              {this.props.loadingProducts ? (
                <SpinnerLoaderWrapper relativeCentered />
              ) : products && products.length > 0 ? (
                <CatalogProducts products={products} />
              ) : (
                <CatalogErrorPage
                  resetFilters={this.props.resetFilters}
                  error={"К сожалению, данные отсутствуют"}
                />
              )}
              {this.props.totalPages > 1 ? (
                <>
                  <div className={styles["hr-line"]}></div>
                  <CatalogPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePrevPage={this.props.setPrevPage}
                    handleNextPage={this.props.setNextPage}
                  />
                </>
              ) : (
                null
              )}
            </div>
          </div>
        </div>
      </section >
    );
  }
}

const UICatalogList = withContext(ClothesListContext, withContext(UserContext, CatalogList));

export default UICatalogList;
