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
  handleQuantityChange = (type: 'increase' | 'decrease') => {
    const { selectedOptions, maxAvailable, globalQuantity, handleOptionChange } = this.props;
    const { quantity } = selectedOptions;
    const totalQuantity = globalQuantity + quantity;
    
    if (type === 'increase') {
      if (totalQuantity < maxAvailable) {
        handleOptionChange('quantity', quantity + 1);
      }
    } else {
      if (quantity > 1) {
        handleOptionChange('quantity', quantity - 1);
      }
    }
  };

  render() {
    const { data, maxAvailable, globalQuantity, addToCart, selectedOptions } = this.props;
    const { quantity } = selectedOptions;
    const totalQuantity = globalQuantity + quantity;
    const disableIncrease = totalQuantity >= maxAvailable;
    const disableAddToCart = totalQuantity > maxAvailable;

    return (
      <div className={styles['quantity-section']}>
        <div className={styles['quantity-container']}>
          <div className={styles['quantity-wrapper']}>
            <button
              className={styles['quantity-btn']}
              onClick={() => this.handleQuantityChange('decrease')}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <span className={styles['quantity-value']}>{quantity}</span>
            <button
              className={styles['quantity-btn']}
              onClick={() => this.handleQuantityChange('increase')}
              disabled={disableIncrease}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <button
            onClick={() => addToCart(data.id)}
            disabled={data?.count <= 0 || disableAddToCart}
            className={styles['catalog-add-to-cart-btn']}
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    );
  }
}

export default QuantitySelector;