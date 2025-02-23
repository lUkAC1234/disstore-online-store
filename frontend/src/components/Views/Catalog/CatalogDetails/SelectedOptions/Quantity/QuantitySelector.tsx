import styles from './QuantitySelector.module.scss';
import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { withContextSelector } from 'components/Context/ContextInjector';
import { ProductModalContext, UserContext, WishlistContext } from 'components/Context/ContextCollection';
import { getWithTranslation } from 'i18n/hooks';
import { WithTranslation } from 'react-i18next';
import { WishlistItem } from 'components/Context/WishlistContext';
import Authentication from "components/Views/Authentication/Authentication";
import { ModalHandler } from 'components/Modal/Modal.utils';


interface DataProps {
  id: string | number;
  count: number;
}

interface SelectedOptions {
  quantity: number;
}

interface QuantitySelectorProps extends WithTranslation {
  data: DataProps;
  maxAvailable: number;
  globalQuantity: number;
  positionStatic?: boolean
  addToCart: (id: string | number) => void;
  selectedOptions: SelectedOptions;
  handleOptionChange: (option: string, value: string | number) => void;
  isAuthenticated: boolean;
  addToWishList?: (productId: number) => Promise<void>;
  removeFromWishlist?: (wishlistItemId: number) => Promise<void>;
  wishlistItems?: WishlistItem[];
  toggleModal: (callback: () => void) => void;
  setModalChildren: (children: ReactNode) => void;
  isModalActive: boolean;
  modalChildren: ReactNode;
}

class QuantitySelector extends ModalHandler<QuantitySelectorProps> {
  get lang(): string {
    return this.props.i18n.language;
  }

  handleQuantityChange = (type: 'increase' | 'decrease') => {
    const { selectedOptions, maxAvailable, globalQuantity, handleOptionChange } = this.props;
    const { quantity } = selectedOptions;
    const totalQuantity = globalQuantity + quantity;

    if (type === 'increase' && totalQuantity < maxAvailable) {
      handleOptionChange('quantity', quantity + 1);
    } else if (type === 'decrease' && quantity > 1) {
      handleOptionChange('quantity', quantity - 1);
    }
  };

  render() {
    const { data, maxAvailable, globalQuantity, addToCart, selectedOptions, isAuthenticated, addToWishList, removeFromWishlist, wishlistItems } = this.props;
    const { quantity } = selectedOptions;
    const totalQuantity = globalQuantity + quantity;
    const disableIncrease = totalQuantity >= maxAvailable;
    const disableAddToCart = totalQuantity > maxAvailable;

    const wishlistItem = wishlistItems?.find((wItem) => wItem.product.id === data?.id);
    const inWishlist = Boolean(wishlistItem);

    return (
      <div className={styles['quantity-section']}>
        {!isAuthenticated && this.renderModal()}
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
          <div className={`${styles["ordering-buttons-container"]} ${this.props.positionStatic ? styles["posed-static"] : styles["not-posed-static"]} `}>
            <button
              onClick={
                isAuthenticated
                  ? () => {
                    addToCart(data.id)
                  }
                  : () => this.openModal(<Authentication />)
              }
              disabled={data?.count <= 0 || disableAddToCart}
              className={styles['catalog-add-to-cart-btn']}
            >
              Добавить в корзину
            </button>
            <button
              onClick={
                isAuthenticated
                  ? () => {
                    if (inWishlist && wishlistItem) {
                      removeFromWishlist(wishlistItem.id);
                    } else if (addToWishList) {
                      addToWishList(Number(data.id));
                    }
                  }
                  : () => this.openModal(<Authentication />)
              }
              className={`${styles["catalog-add-wishlist-link"]} ${this.props.positionStatic ? styles["posed-static"] : styles["not-posed-static"]} `}
            >
              {inWishlist ? (
                <svg
                  width="1.25rem"
                  height="1.25rem"
                  viewBox="0 0 24 24"
                  fill="#141415"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 9.5C2 6.49094 4.43065 4 7.5 4C9.73143 4 11.2249 5.30207 12 6.21581C12.7751 5.30207 14.2686 4 16.5 4C19.5702 4 22 6.49102 22 9.5C22 10.8218 21.4706 12.1189 20.7206 13.3098C19.9669 14.5066 18.954 15.6539 17.9013 16.6906C16.4429 18.1269 14.808 19.4384 13.6502 20.3672C13.1649 20.7565 12.7634 21.0786 12.4939 21.3144C12.2111 21.5619 11.7889 21.5619 11.5061 21.3144C11.2366 21.0786 10.8351 20.7565 10.3498 20.3672C9.19201 19.4384 7.55712 18.1269 6.09873 16.6906C5.04602 15.6539 4.03308 14.5066 3.27942 13.3098C2.52941 12.1189 2 10.8218 2 9.5Z" fill="var(--clothes-discount-number)" />
                </svg>
              ) : (
                <svg
                  width="1.25rem"
                  height="1.25rem"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.5 5.5C5.26935 5.5 3.5 7.30906 3.5 9.5C3.5 10.4282 3.87684 11.4436 4.5487 12.5105C5.21692 13.5716 6.14148 14.6274 7.15127 15.6219C8.55769 17.007 10.0318 18.1879 11.1708 19.1003C11.4734 19.3427 11.7523 19.5661 12 19.7694C12.2477 19.5661 12.5266 19.3427 12.8292 19.1003C13.9682 18.1879 15.4423 17.007 16.8487 15.6219C17.8585 14.6274 18.7831 13.5716 19.4513 12.5105C20.1232 11.4436 20.5 10.4282 20.5 9.5C20.5 7.30898 18.7314 5.5 16.5 5.5C14.3473 5.5 13.0738 7.20226 12.7262 7.74742C12.3889 8.27655 11.6111 8.27653 11.2738 7.74742C10.9262 7.20225 9.65273 5.5 7.5 5.5ZM2 9.5C2 6.49094 4.43065 4 7.5 4C9.73143 4 11.2249 5.30207 12 6.21581C12.7751 5.30207 14.2686 4 16.5 4C19.5702 4 22 6.49102 22 9.5C22 10.8218 21.4706 12.1189 20.7206 13.3098C19.9669 14.5066 18.954 15.6539 17.9013 16.6906C16.4429 18.1269 14.808 19.4384 13.6502 20.3672C13.1649 20.7565 12.7634 21.0786 12.4939 21.3144C12.2111 21.5619 11.7889 21.5619 11.5061 21.3144C11.2366 21.0786 10.8351 20.7565 10.3498 20.3672C9.19201 19.4384 7.55712 18.1269 6.09873 16.6906C5.04602 15.6539 4.03308 14.5066 3.27942 13.3098C2.52941 12.1189 2 10.8218 2 9.5Z"
                    fill="#141415"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const __UIQuantitySelector = withContextSelector(WishlistContext, QuantitySelector, (context) => ({
  addToWishList: context.addToWishlist,
  removeFromWishlist: context.removeFromWishlist,
  wishlistItems: context.wishlistItems,
}));

const _UIQuantitySelector = withContextSelector(ProductModalContext, __UIQuantitySelector, (context) => ({
  toggleModal: context.toggleModal,
  setModalChildren: context.setModalChildren,
  isModalActive: context.isModalActive,
  modalChildren: context.modalChildren,
}));

const UIQuantitySelector = withContextSelector(UserContext, _UIQuantitySelector, (context) => ({
  isAuthenticated: context.isAuthenticated,
}));

export default getWithTranslation(UIQuantitySelector);
