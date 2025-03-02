import styles from './ColorSelector.module.scss';
import { PureComponent } from 'react';

class ColorSelector extends PureComponent<ColorSelectorProps> {
  render() {
    const { data, selectedOptions, handleOptionChange } = this.props;
    return (
      <div className={styles["colors-section"]}>
        <h4 className={styles["product-options-title"]}>Выберите цвет</h4>
        <div className={styles["colors-container"]}>
          {data?.colors?.map(({ color }) => (
            <button
              key={color}
              className={`${styles["color-option"]} ${
                selectedOptions.color === color ? styles["selected"] : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleOptionChange("color", color)}
              aria-label={`Select ${color} color`}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default ColorSelector;
