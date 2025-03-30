import styles from "./Filters.module.scss";
import { PureComponent, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import RangeSliderDual from "components/UI/RangeSlider/RangeSliderDual";
import { withContextSelector } from "components/Context/ContextInjector";
import { ClothesListContext } from "components/Context/ContextCollection";
import SmoothResizable from "components/UI/SmoothResizable/SmoothResizable";
import { ActionButton } from "components/UI/Html/Elements/Elements";

class Filters extends PureComponent<CatalogFiltersProps, CatalogFiltersState> {
  state: CatalogFiltersState = {
    activeColors: true,
    activeSizes: true,
  };

  toggleColors = (): void => {
    this.setState((prevState) => ({
      activeColors: !prevState.activeColors,
    }));
  };

  toggleSizes = (): void => {
    this.setState((prevState) => ({
      activeSizes: !prevState.activeSizes,
    }));
  };

  render(): ReactNode {
    const {
      type,
      colors,
      sizes,
      selectedTypes,
      selectedColors,
      selectedSizes,
      selectedMin,
      selectedMax,
      min,
      max,
      handleFilterSelection,
      setSelectedMin,
      setSelectedMax,
      setSelectedPriceMinMax,
      setApplyFilters,
      toggleFilter,
      isFilterActive,
      catalogFiltersContainerRef
    } = this.props;

    const { activeColors, activeSizes } = this.state;

    return (
      <div
        ref={catalogFiltersContainerRef}
        className={`${styles["catalog-filter-container"]} ${
          isFilterActive ? styles["active"] : ""
        }`}
      >
        <div className={styles["filters-title-container"]}>
          <h3 className={styles["filters-title"]}>Фильтры</h3>
          <button
            className={styles["filters-title-button"]}
            onClick={toggleFilter}
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
                className={`${styles["filter-type-column"]} ${
                  selectedTypes.includes(item.id) ? styles["active"] : ""
                }`}
                onClick={() => handleFilterSelection("selectedTypes", item.id)}
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
            min={min}
            max={max}
            values={[selectedMin, selectedMax]}
            setValues={setSelectedPriceMinMax}
          />
          <div className={styles["price-filter-info-text-container"]}>
            <label>
              От
              <input
                type="number"
                value={selectedMin}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= min && value < max) {
                    setSelectedMin(value);
                  }
                }}
              />
            </label>
            <label>
              До
              <input
                type="number"
                value={selectedMax}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value > min && value <= max) {
                    setSelectedMax(value);
                  }
                }}
              />
            </label>
          </div>
        </div>
        <div className={styles["hr-line"]}></div>

        <div className={styles["filters-colors-list"]}>
          <button
            className={`${styles["filters-colors-head-button"]} ${
              activeColors ? styles["active"] : ""
            }`}
            onClick={this.toggleColors}
          >
            <h3 className={styles["filters-colors-title"]}>Цвета</h3>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
          <SmoothResizable>
            <div className={styles["filters-color-wrapper"]}>
              {colors.length > 0 ? (
                colors.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleFilterSelection("selectedColors", item.id)}
                    className={`${styles["filters-color-button"]} ${
                      selectedColors.includes(item.id) ? styles["active"] : ""
                    }`}
                  >
                    <div
                      className={`${styles["filters-color"]} ${
                        selectedColors.includes(item.id) ? styles["active"] : ""
                      }`}
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className={styles["filters-color-name"]}>
                      {item.name}
                    </span>
                  </button>
                ))
              ) : (
                <h4 className={styles["filter-error"]}>
                  Пока что нету никаких цветов одежды
                </h4>
              )}
            </div>
          </SmoothResizable>
        </div>
        <div className={styles["hr-line"]}></div>

        <div className={styles["filters-sizes-list"]}>
          <button
            className={`${styles["filters-sizes-head-button"]} ${
              activeSizes ? styles["active"] : ""
            }`}
            onClick={this.toggleSizes}
          >
            <h3 className={styles["filters-sizes-title"]}>Размеры</h3>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
          <SmoothResizable>
            <div className={styles["filters-sizes-wrapper"]}>
              {sizes.length > 0 ? (
                sizes.map((item) => (
                  <button
                    key={item.id}
                    className={`${styles["filters-sizes-column"]} ${
                      selectedSizes.includes(item.id) ? styles["active"] : ""
                    }`}
                    onClick={() => handleFilterSelection("selectedSizes", item.id)}
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
          </SmoothResizable>
        </div>
        <div className={styles["hr-line"]}></div>

        <div className={styles["add-to-cart-button-container"]}>
          <ActionButton
            className={styles["add-to-cart-button"]}
            onClick={setApplyFilters}
          >
            Применить фильтры
          </ActionButton>
        </div>
      </div>
    );
  }
}

const UIFilters = withContextSelector(ClothesListContext, Filters, (context) => ({
  type: context.type,
  colors: context.colors,
  sizes: context.sizes,
  selectedTypes: context.selectedTypes,
  selectedColors: context.selectedColors,
  selectedSizes: context.selectedSizes,
  selectedMin: context.selectedMin,
  selectedMax: context.selectedMax,
  min: context.min,
  max: context.max,
  handleFilterSelection: context.handleFilterSelection,
  setSelectedMin: context.setSelectedMin,
  setSelectedMax: context.setSelectedMax,
  setSelectedPriceMinMax: context.setSelectedPriceMinMax,
  setApplyFilters: context.setApplyFilters,
}));

export default UIFilters;
