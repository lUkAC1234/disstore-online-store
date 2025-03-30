import { PureComponent, ChangeEvent, FormEvent } from "react";
import { withContextSelector } from "components/Context/ContextInjector";
import { CartContext, UserContext } from "components/Context/ContextCollection";
import { CartItem } from "components/Context/CartContext";
import { getWithTranslation } from "i18n/hooks";
import { origin } from "../../../../project.config.json";
import Cookies from "utils/modules/Cookies";
import { Navigate } from "react-router-dom";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
import styles from "./Checkout.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import OptimizedImage from "components/UI/OptimizedImage/OptimizedImage";
import PhoneInput from "components/UI/Phone/PhoneInput";

class Checkout extends PureComponent<CheckoutProps, CheckoutState> {
  state: CheckoutState = {
    fullName: "",
    address: "",
    phone: "",
    email: "",
    processing: false,
    error: null,
    success: false,
  };

  get lang(): string {
    return this.props.i18n.language;
  }

  clearErrorTimeout: NodeJS.Timeout | null = null;

  setErrorMessage = (msg: string) => {
    if (this.clearErrorTimeout) {
      clearTimeout(this.clearErrorTimeout);
    }
    this.setState({ error: msg });
    this.clearErrorTimeout = setTimeout(() => {
      this.setState({ error: null });
      this.clearErrorTimeout = null;
    }, 5000);
  };

  handleCloseError = () => {
    if (this.clearErrorTimeout) {
      clearTimeout(this.clearErrorTimeout);
      this.clearErrorTimeout = null;
    }
    this.setState({ error: null });
  };

  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  getHeaders = (): Record<string, string> => {
    const token = Cookies.getCookie("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { fullName, address, phone } = this.state;
    const { email } = this.props.user;
    const { cart } = this.props;

    if (!fullName || !address || !phone || !email) {
      this.setErrorMessage("Пожалуйста, заполните все поля.");
      return;
    }

    this.setState({ processing: true, error: null });
    try {
      const payload = {
        shipping_details: {
          fullName,
          address,
          phone,
          email,
        },
        items: cart.items.map((item: CartItem) => {
          const extendedItem = item as CartItem & {
            selected_color?: string;
            selected_size?: string;
            selected_image?: string | null;
          };
          return {
            id: item.id,
            product_id: item.product.id,
            quantity: item.quantity,
            selected_color: extendedItem.selected_color || "",
            selected_size: extendedItem.selected_size || "",
            selected_image: extendedItem.selected_image || null,
          };
        }),
      };

      const response = await fetch(`${origin}/orders/checkout/`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || `Ошибка: ${response.status}`);
      }
      this.props.clearCart();
      this.props.setSuccessCheckout(true);
      this.setState({ success: true });
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      this.setErrorMessage(error.message || "Ошибка при оформлении заказа");
    } finally {
      this.setState({ processing: false });
    }
  };

  get fullName(): string {
    return this.props.user.first_name || this.props.user.last_name ? `${this.props.user.first_name} ${this.props.user.last_name}` : this.state.fullName;
  }

  render() {
    const { fullName, address, processing, error, success } = this.state;
    const { user } = this.props
    const { cart } = this.props;
    if (success) {
      return <Navigate to="/order-confirmation" />;
    }

    if (!cart || cart.items.length === 0) {
      return <Navigate to={`/${this.lang}/page-not-found-404`} />;
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 15);
    const formattedDate = deliveryDate.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    });
    return (
      <div className={styles["checkout-container"]}>
        {error && <div className={styles["error-message"]}>
          {error}
          <button onClick={this.handleCloseError}><FontAwesomeIcon icon={faXmark} /></button>
        </div>}
        <h1 className={styles["checkout-title"]}>Оформление заказа</h1>
        <div className={styles["checkout-content"]}>
          <form onSubmit={this.handleSubmit} className={styles["checkout-form"]}>
            <div className={styles["order-info-container"]}>
              <h2 className={styles["checkout-form-subtitle"]}>Получатель заказа:</h2>
              <div className={styles["checkout-form-group"]}>
                <label htmlFor="fullName">Полное имя</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={fullName}
                  onChange={this.handleInputChange}
                  placeholder="Введите полное имя"
                />
              </div>
              <div className={styles["checkout-form-group"]}>
                <label htmlFor="address">Адрес доставки</label>
                <input
                  id="address"
                  name="address"
                  value={address}
                  onChange={this.handleInputChange}
                  required
                  placeholder="Введите адрес доставки"
                />
              </div>
              <div className={styles["checkout-form-group"]}>
                <label htmlFor="phone">Телефон</label>
                <PhoneInput />
              </div>
              <div className={styles["checkout-form-group"]}>
                <label htmlFor="email">Электронная почта</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  disabled
                  onChange={this.handleInputChange}
                  required
                  placeholder="Введите вашу почту"
                />
              </div>
              <div className={styles["hr-line"]}></div>
              <div className={styles["checkout-details"]}>
                <h2 className={styles["checkout-details-subtitle"]}>Доставим {formattedDate}</h2>
                <div className={styles["order-items-wrapper"]}>
                  {cart &&
                    cart.items.map((item: CartItem) => {
                      const extendedItem = item as ExtendedCartItem;
                      return (
                        <div key={item.id} className={styles["order-item"]}>
                          <div className={styles["order-item-image-container"]}>
                            <OptimizedImage
                              src={
                                extendedItem.selected_image ||
                                extendedItem.product.catalogImages[0].image
                              }
                              alt={extendedItem.product.title}
                              thumbnail={extendedItem.product.catalogImages[0]?.thumbnail}
                            />
                          </div>
                          <div className={styles["order-item-content-container"]}>
                            <div className={styles["order-item-content-column"]}>
                              <h2 className={styles["order-item-name"]}>{extendedItem.product.title} x {extendedItem.quantity}</h2>
                            </div>
                            <div className={styles["order-item-content-column"]}>
                              Цвет:
                              <div className={styles["order-selected-color"]} style={{ backgroundColor: extendedItem.selected_color }} />
                            </div>
                            <div className={styles["order-item-content-column"]}>Размер: {extendedItem.selected_size}</div>
                          </div>
                          <div className={styles["order-item-price-container"]}>
                            {(extendedItem.product.real_price * extendedItem.quantity).toLocaleString("en-US")} сум
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            <nav className={styles["order-submission-block"]}>
              <div className={styles["order-submission-container"]}>
                <div className={styles["order-summary"]}>
                  <h2 className={styles["order-status-summary"]}>Сводка заказа</h2>
                  <div className={styles["order-totals"]}>
                    <div className={styles["order-total-line"]}>
                      <span className={styles["order-total-line-name"]}>Сумма товаров:</span>
                      <span className={styles["order-total-line-price"]}>{cart?.original_total.toLocaleString("en-US")} сум</span>
                    </div>
                    <div className={styles["order-total-line"]}>
                      <span className={styles["order-total-line-name"]}>Скидка:</span>
                      <span className={`${styles["order-total-line-price"]} ${styles["discount"]}`}>-{cart?.total_discount.toLocaleString("en-US")} сум</span>
                    </div>
                    <div className={styles["order-total-line"]}>
                      <span className={styles["order-total-line-name"]}>Доставка:</span>
                      <span className={styles["order-total-line-price"]}>50,000 сум</span>
                    </div>
                    <div className={styles["hr-line"]}></div>
                    <div className={styles["order-total-line"]}>
                      <strong className={`${styles["order-total-line-name"]} ${styles["strong"]}`}>Итого:</strong>
                      <strong className={styles["order-total-line-price"]}>{cart?.final_total.toLocaleString("en-US")} сум</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className={styles["submit-button"]}
                >
                  {processing ? <SpinnerLoaderWrapper smallWrapper whiteLoader /> : "Оформить заказ"}
                </button>
              </div>
            </nav>

          </form>

        </div>
      </div>
    );
  }
}

const _UICheckout = withContextSelector(CartContext, Checkout, (context) => ({
  cart: context.cart,
  clearCart: context.clearCart,
  setSuccessCheckout: context.setSuccessCheckout,
}));

const UICheckout = withContextSelector(UserContext, _UICheckout, (context) => ({
  user: context.user,
}));

const TranslatedCheckout = getWithTranslation(UICheckout);

export default TranslatedCheckout;
