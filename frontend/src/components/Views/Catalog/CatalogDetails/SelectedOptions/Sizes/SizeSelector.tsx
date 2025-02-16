import styles from './SizeSelector.module.scss';
import { PureComponent } from 'react';
import { Size } from 'components/Context/ClothesContext';

interface DataProps {
  sizes: Size[];
}

interface SelectedOptions {
  size: string;
}

interface SizeSelectorProps {
  data: DataProps;
  selectedOptions: SelectedOptions;
  handleOptionChange: (option: string, value: string) => void;
}

class SizeSelector extends PureComponent<SizeSelectorProps> {
  handleOptionChange = (option: string, value: string) => {
    this.props.handleOptionChange(option, value);
  };

  render() {
    const { data, selectedOptions } = this.props;
    return (
      <div className={styles["sizes-section"]}>
        <h4 className={styles["product-options-title"]}>Выберите размер</h4>
        <div className={styles["sizes-container"]}>
          {data?.sizes?.map(({ size }) => (
            <button
              key={size}
              className={`${styles["size-option"]} ${
                selectedOptions.size === size ? styles["selected"] : ""
              }`}
              onClick={() => this.handleOptionChange("size", size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default SizeSelector;
