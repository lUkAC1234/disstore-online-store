import styles from './QuantitySelector.module.scss';
import { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

interface DataProps {
  id: string | number;
  count: number; 
}

interface SelectedOptions {
  quantity: number;
}

interface QuantitySelectorProps {
  data: DataProps;
  maxAvailable: number;
  globalQuantity: number; 
  addToCart: (id: string | number) => void;
  selectedOptions: SelectedOptions;
  handleOptionChange: (option: string, value: string | number) => void;
}

class QuantitySelector extends PureComponent<QuantitySelectorProps> {
  handleQuantityChange = (type: "increase" | "decrease") => {
    const { selectedOptions, maxAvailable, globalQuantity, handleOptionChange } = this.props;
    const currentQuantity = selectedOptions.quantity;
    
    if (type === "increase") {
      if (globalQuantity < maxAvailable) {
        handleOptionChange("quantity", currentQuantity + 1);
      }
    } else {
      if (currentQuantity > 1) {
        handleOptionChange("quantity", currentQuantity - 1);
      }
    }
  };

  render() {
    const { data, maxAvailable, globalQuantity, addToCart, selectedOptions } = this.props;
    const disableIncrease = globalQuantity >= maxAvailable;
    
    return (
      <div className={styles["quantity-section"]}>
        <div className={styles["quantity-container"]}>
          <div className={styles["quantity-wrapper"]}>
            <button
              className={styles["quantity-btn"]}
              onClick={() => this.handleQuantityChange("decrease")}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <span className={styles["quantity-value"]}>
              {selectedOptions.quantity}
            </span>
            <button
              className={styles["quantity-btn"]}
              onClick={() => this.handleQuantityChange("increase")}
              disabled={disableIncrease}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <button
            onClick={() => addToCart(data?.id)}
            disabled={data?.count <= 0 || disableIncrease}
            className={styles["catalog-add-to-cart-btn"]}
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    );
  }
}

export default QuantitySelector;
