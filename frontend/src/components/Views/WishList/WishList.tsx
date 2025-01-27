import { PureComponent, ReactNode } from "react";
import styles from "./WishList.module.scss";
import clothes from "assets/main/images/layout/clothes.jpg";
import { Link } from "react-router-dom";
import i18next from "i18next";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
const lang: string = i18next.language;

class WishList extends PureComponent<WishListProps, WishListState> {
  async componentDidMount(): Promise<void> {
    if (document.documentElement.scrollTop > 0) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }
  render(): ReactNode {
    return (
      <section className={styles["wishlist-section"]}>
        <div className={styles["wishlist-container"]}>
          <h1 className={styles["wishlist-title"]}>Мои желания</h1>

          <div className={styles["wishlist-items-wrapper"]}>
          <div className={styles["wishlist-item"]}>
              <Link
                to={`/${lang}/catalog/`}
                className={styles["wishlist-item-link"]}
              />
              <button className={styles["wishlist-item-remove"]}>
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <div className={styles["wishlist-image-container"]}>
                <span className={styles["wishlist-discount"]}>-20%</span>
                <SpinnerLoaderWrapper />
              </div>
              <div className={styles["wishlist-item-info-container"]}>
                <h2 className={styles["wishlist-item-title"]}>Платье синее</h2>
                <p className={styles["wishlist-item-description"]}>
                  Что то длинное
                  {/* {item.short_description.length > 40 ? `${item.short_description.slice(0, 40)}...` : item.short_description} */}
                </p>
                {/* {item.count > 0 ? (
                  <p className={styles["wishlist-item-count"]}>В наличии <strong className={styles["count"]}>({item.count} шт)</strong></p>
                ) : (
                  <p className={styles["wishlist-item-count"]}>Товар закончился</p>
                )} */}
                <p className={styles["wishlist-item-count"]}>В наличии <strong className={styles["count"]}>(10 шт)</strong></p>

                <div className={styles["wishlist-price-container"]}>

                  <bdi className={styles["wishlist-price-wrapper"]}>
                    <span className={styles["wishlist-real-price"]}>
                      {/* {item.real_price.toLocaleString("en-US")} сум */}
                      249,000 сум 
                    </span>
                    {/* {item.discount > 0 && (
                      <span className={styles["wishlist-price"]}>
                        {item.price.toLocaleString("en-US")} сум
                      </span>
                    )} */}
                    <span className={styles["wishlist-price"]}>
                      525,000 сум
                    </span>
                  </bdi>
                  <Link to={""} className={styles["wishlist-add-cart-link"]}>
                    <svg width="1.75rem" height="1.75rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 10V8H6V12.5C6 12.7761 5.77614 13 5.5 13C5.22386 13 5 12.7761 5 12.5V7H8C8 4.59628 9.95227 3 12 3C14.0575 3 16 4.70556 16 7H19V19.5C19 20.3284 18.3284 21 17.5 21H12.5C12.2239 21 12 20.7761 12 20.5C12 20.2239 12.2239 20 12.5 20H17.5C17.7761 20 18 19.7761 18 19.5V8H16V10H15V8H9V10H8ZM12 4C10.4477 4 9 5.20372 9 7H15C15 5.29444 13.5425 4 12 4Z" fill="black"></path>
                      <path d="M7.5 14C7.77614 14 8 14.2239 8 14.5V17H10.5C10.7761 17 11 17.2239 11 17.5C11 17.7761 10.7761 18 10.5 18H8V20.5C8 20.7761 7.77614 21 7.5 21C7.22386 21 7 20.7761 7 20.5V18H4.5C4.22386 18 4 17.7761 4 17.5C4 17.2239 4.22386 17 4.5 17H7V14.5C7 14.2239 7.22386 14 7.5 14Z" fill="black"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            <div className={styles["wishlist-item"]}>
              <Link
                to={`/${lang}/catalog/`}
                className={styles["wishlist-item-link"]}
              />
              <button className={styles["wishlist-item-remove"]}>
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <div className={styles["wishlist-image-container"]}>
                <span className={styles["wishlist-discount"]}>-20%</span>
                <SpinnerLoaderWrapper />
              </div>
              <div className={styles["wishlist-item-info-container"]}>
                <h2 className={styles["wishlist-item-title"]}>Платье синее</h2>
                <p className={styles["wishlist-item-description"]}>
                  Что то длинное
                  {/* {item.short_description.length > 40 ? `${item.short_description.slice(0, 40)}...` : item.short_description} */}
                </p>
                {/* {item.count > 0 ? (
                  <p className={styles["wishlist-item-count"]}>В наличии <strong className={styles["count"]}>({item.count} шт)</strong></p>
                ) : (
                  <p className={styles["wishlist-item-count"]}>Товар закончился</p>
                )} */}
                <p className={styles["wishlist-item-count"]}>В наличии <strong className={styles["count"]}>(10 шт)</strong></p>

                <div className={styles["wishlist-price-container"]}>

                  <bdi className={styles["wishlist-price-wrapper"]}>
                    <span className={styles["wishlist-real-price"]}>
                      {/* {item.real_price.toLocaleString("en-US")} сум */}
                      249,000 сум 
                    </span>
                    {/* {item.discount > 0 && (
                      <span className={styles["wishlist-price"]}>
                        {item.price.toLocaleString("en-US")} сум
                      </span>
                    )} */}
                    <span className={styles["wishlist-price"]}>
                      525,000 сум
                    </span>
                  </bdi>
                  <Link to={""} className={styles["wishlist-add-cart-link"]}>
                    <svg width="1.75rem" height="1.75rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 10V8H6V12.5C6 12.7761 5.77614 13 5.5 13C5.22386 13 5 12.7761 5 12.5V7H8C8 4.59628 9.95227 3 12 3C14.0575 3 16 4.70556 16 7H19V19.5C19 20.3284 18.3284 21 17.5 21H12.5C12.2239 21 12 20.7761 12 20.5C12 20.2239 12.2239 20 12.5 20H17.5C17.7761 20 18 19.7761 18 19.5V8H16V10H15V8H9V10H8ZM12 4C10.4477 4 9 5.20372 9 7H15C15 5.29444 13.5425 4 12 4Z" fill="black"></path>
                      <path d="M7.5 14C7.77614 14 8 14.2239 8 14.5V17H10.5C10.7761 17 11 17.2239 11 17.5C11 17.7761 10.7761 18 10.5 18H8V20.5C8 20.7761 7.77614 21 7.5 21C7.22386 21 7 20.7761 7 20.5V18H4.5C4.22386 18 4 17.7761 4 17.5C4 17.2239 4.22386 17 4.5 17H7V14.5C7 14.2239 7.22386 14 7.5 14Z" fill="black"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            <div className={styles["wishlist-item"]}>
              <Link
                to={`/${lang}/catalog/`}
                className={styles["wishlist-item-link"]}
              />
              <button className={styles["wishlist-item-remove"]}>
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <div className={styles["wishlist-image-container"]}>
                <span className={styles["wishlist-discount"]}>-20%</span>
                <SpinnerLoaderWrapper />
              </div>
              <div className={styles["wishlist-item-info-container"]}>
                <h2 className={styles["wishlist-item-title"]}>Платье синее</h2>
                <p className={styles["wishlist-item-description"]}>
                  Что то длинное
                  {/* {item.short_description.length > 40 ? `${item.short_description.slice(0, 40)}...` : item.short_description} */}
                </p>
                {/* {item.count > 0 ? (
                  <p className={styles["wishlist-item-count"]}>В наличии <strong className={styles["count"]}>({item.count} шт)</strong></p>
                ) : (
                  <p className={styles["wishlist-item-count"]}>Товар закончился</p>
                )} */}
                <p className={styles["wishlist-item-count"]}>В наличии <strong className={styles["count"]}>(10 шт)</strong></p>

                <div className={styles["wishlist-price-container"]}>

                  <bdi className={styles["wishlist-price-wrapper"]}>
                    <span className={styles["wishlist-real-price"]}>
                      {/* {item.real_price.toLocaleString("en-US")} сум */}
                      249,000 сум 
                    </span>
                    {/* {item.discount > 0 && (
                      <span className={styles["wishlist-price"]}>
                        {item.price.toLocaleString("en-US")} сум
                      </span>
                    )} */}
                    <span className={styles["wishlist-price"]}>
                      525,000 сум
                    </span>
                  </bdi>
                  <Link to={""} className={styles["wishlist-add-cart-link"]}>
                    <svg width="1.75rem" height="1.75rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 10V8H6V12.5C6 12.7761 5.77614 13 5.5 13C5.22386 13 5 12.7761 5 12.5V7H8C8 4.59628 9.95227 3 12 3C14.0575 3 16 4.70556 16 7H19V19.5C19 20.3284 18.3284 21 17.5 21H12.5C12.2239 21 12 20.7761 12 20.5C12 20.2239 12.2239 20 12.5 20H17.5C17.7761 20 18 19.7761 18 19.5V8H16V10H15V8H9V10H8ZM12 4C10.4477 4 9 5.20372 9 7H15C15 5.29444 13.5425 4 12 4Z" fill="black"></path>
                      <path d="M7.5 14C7.77614 14 8 14.2239 8 14.5V17H10.5C10.7761 17 11 17.2239 11 17.5C11 17.7761 10.7761 18 10.5 18H8V20.5C8 20.7761 7.77614 21 7.5 21C7.22386 21 7 20.7761 7 20.5V18H4.5C4.22386 18 4 17.7761 4 17.5C4 17.2239 4.22386 17 4.5 17H7V14.5C7 14.2239 7.22386 14 7.5 14Z" fill="black"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            <div className={styles["wishlist-item"]}>
              <Link
                to={`/${lang}/catalog/`}
                className={styles["wishlist-item-link"]}
              />
              <button className={styles["wishlist-item-remove"]}>
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <div className={styles["wishlist-image-container"]}>
                <span className={styles["wishlist-discount"]}>-20%</span>
                <SpinnerLoaderWrapper />
              </div>
              <div className={styles["wishlist-item-info-container"]}>
                <h2 className={styles["wishlist-item-title"]}>Платье синее</h2>
                <p className={styles["wishlist-item-description"]}>
                  Что то длинное
                  {/* {item.short_description.length > 40 ? `${item.short_description.slice(0, 40)}...` : item.short_description} */}
                </p>
                {/* {item.count > 0 ? (
                  <p className={styles["wishlist-item-count"]}>В наличии <strong className={styles["count"]}>({item.count} шт)</strong></p>
                ) : (
                  <p className={styles["wishlist-item-count"]}>Товар закончился</p>
                )} */}
                <p className={styles["wishlist-item-count"]}>В наличии <strong className={styles["count"]}>(10 шт)</strong></p>

                <div className={styles["wishlist-price-container"]}>

                  <bdi className={styles["wishlist-price-wrapper"]}>
                    <span className={styles["wishlist-real-price"]}>
                      {/* {item.real_price.toLocaleString("en-US")} сум */}
                      249,000 сум 
                    </span>
                    {/* {item.discount > 0 && (
                      <span className={styles["wishlist-price"]}>
                        {item.price.toLocaleString("en-US")} сум
                      </span>
                    )} */}
                    <span className={styles["wishlist-price"]}>
                      525,000 сум
                    </span>
                  </bdi>
                  <Link to={""} className={styles["wishlist-add-cart-link"]}>
                    <svg width="1.75rem" height="1.75rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 10V8H6V12.5C6 12.7761 5.77614 13 5.5 13C5.22386 13 5 12.7761 5 12.5V7H8C8 4.59628 9.95227 3 12 3C14.0575 3 16 4.70556 16 7H19V19.5C19 20.3284 18.3284 21 17.5 21H12.5C12.2239 21 12 20.7761 12 20.5C12 20.2239 12.2239 20 12.5 20H17.5C17.7761 20 18 19.7761 18 19.5V8H16V10H15V8H9V10H8ZM12 4C10.4477 4 9 5.20372 9 7H15C15 5.29444 13.5425 4 12 4Z" fill="black"></path>
                      <path d="M7.5 14C7.77614 14 8 14.2239 8 14.5V17H10.5C10.7761 17 11 17.2239 11 17.5C11 17.7761 10.7761 18 10.5 18H8V20.5C8 20.7761 7.77614 21 7.5 21C7.22386 21 7 20.7761 7 20.5V18H4.5C4.22386 18 4 17.7761 4 17.5C4 17.2239 4.22386 17 4.5 17H7V14.5C7 14.2239 7.22386 14 7.5 14Z" fill="black"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            <div className={styles["wishlist-item"]}>
              <Link
                to={`/${lang}/catalog/`}
                className={styles["wishlist-item-link"]}
              />
              <button className={styles["wishlist-item-remove"]}>
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <div className={styles["wishlist-image-container"]}>
                <span className={styles["wishlist-discount"]}>-20%</span>
                <img src={clothes} alt="Something " />
              </div>
              <div className={styles["wishlist-item-info-container"]}>
                <h2 className={styles["wishlist-item-title"]}>Платье синее</h2>
                <p className={styles["wishlist-item-description"]}>
                  Что то длинное
                  {/* {item.short_description.length > 40 ? `${item.short_description.slice(0, 40)}...` : item.short_description} */}
                </p>
                {/* {item.count > 0 ? (
                  <p className={styles["wishlist-item-count"]}>В наличии <strong className={styles["count"]}>({item.count} шт)</strong></p>
                ) : (
                  <p className={styles["wishlist-item-count"]}>Товар закончился</p>
                )} */}
                <p className={styles["wishlist-item-count"]}>В наличии <strong className={styles["count"]}>(10 шт)</strong></p>

                <div className={styles["wishlist-price-container"]}>

                  <bdi className={styles["wishlist-price-wrapper"]}>
                    <span className={styles["wishlist-real-price"]}>
                      {/* {item.real_price.toLocaleString("en-US")} сум */}
                      249,000 сум 
                    </span>
                    {/* {item.discount > 0 && (
                      <span className={styles["wishlist-price"]}>
                        {item.price.toLocaleString("en-US")} сум
                      </span>
                    )} */}
                    <span className={styles["wishlist-price"]}>
                      525,000 сум
                    </span>
                  </bdi>
                  <Link to={""} className={styles["wishlist-add-cart-link"]}>
                    <svg width="1.75rem" height="1.75rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 10V8H6V12.5C6 12.7761 5.77614 13 5.5 13C5.22386 13 5 12.7761 5 12.5V7H8C8 4.59628 9.95227 3 12 3C14.0575 3 16 4.70556 16 7H19V19.5C19 20.3284 18.3284 21 17.5 21H12.5C12.2239 21 12 20.7761 12 20.5C12 20.2239 12.2239 20 12.5 20H17.5C17.7761 20 18 19.7761 18 19.5V8H16V10H15V8H9V10H8ZM12 4C10.4477 4 9 5.20372 9 7H15C15 5.29444 13.5425 4 12 4Z" fill="black"></path>
                      <path d="M7.5 14C7.77614 14 8 14.2239 8 14.5V17H10.5C10.7761 17 11 17.2239 11 17.5C11 17.7761 10.7761 18 10.5 18H8V20.5C8 20.7761 7.77614 21 7.5 21C7.22386 21 7 20.7761 7 20.5V18H4.5C4.22386 18 4 17.7761 4 17.5C4 17.2239 4.22386 17 4.5 17H7V14.5C7 14.2239 7.22386 14 7.5 14Z" fill="black"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            <div className={styles["wishlist-item"]}>
              <Link
                to={`/${lang}/catalog/`}
                className={styles["wishlist-item-link"]}
              />
              <button className={styles["wishlist-item-remove"]}>
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <div className={styles["wishlist-image-container"]}>
                <span className={styles["wishlist-discount"]}>-20%</span>
                <SpinnerLoaderWrapper />
              </div>
              <div className={styles["wishlist-item-info-container"]}>
                <h2 className={styles["wishlist-item-title"]}>Платье синее</h2>
                <p className={styles["wishlist-item-description"]}>
                  Что то длинное
                  {/* {item.short_description.length > 40 ? `${item.short_description.slice(0, 40)}...` : item.short_description} */}
                </p>
                {/* {item.count > 0 ? (
                  <p className={styles["wishlist-item-count"]}>В наличии <strong className={styles["count"]}>({item.count} шт)</strong></p>
                ) : (
                  <p className={styles["wishlist-item-count"]}>Товар закончился</p>
                )} */}
                <p className={styles["wishlist-item-count"]}>В наличии <strong className={styles["count"]}>(10 шт)</strong></p>

                <div className={styles["wishlist-price-container"]}>

                  <bdi className={styles["wishlist-price-wrapper"]}>
                    <span className={styles["wishlist-real-price"]}>
                      {/* {item.real_price.toLocaleString("en-US")} сум */}
                      249,000 сум 
                    </span>
                    {/* {item.discount > 0 && (
                      <span className={styles["wishlist-price"]}>
                        {item.price.toLocaleString("en-US")} сум
                      </span>
                    )} */}
                    <span className={styles["wishlist-price"]}>
                      525,000 сум
                    </span>
                  </bdi>
                  <Link to={""} className={styles["wishlist-add-cart-link"]}>
                    <svg width="1.75rem" height="1.75rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 10V8H6V12.5C6 12.7761 5.77614 13 5.5 13C5.22386 13 5 12.7761 5 12.5V7H8C8 4.59628 9.95227 3 12 3C14.0575 3 16 4.70556 16 7H19V19.5C19 20.3284 18.3284 21 17.5 21H12.5C12.2239 21 12 20.7761 12 20.5C12 20.2239 12.2239 20 12.5 20H17.5C17.7761 20 18 19.7761 18 19.5V8H16V10H15V8H9V10H8ZM12 4C10.4477 4 9 5.20372 9 7H15C15 5.29444 13.5425 4 12 4Z" fill="black"></path>
                      <path d="M7.5 14C7.77614 14 8 14.2239 8 14.5V17H10.5C10.7761 17 11 17.2239 11 17.5C11 17.7761 10.7761 18 10.5 18H8V20.5C8 20.7761 7.77614 21 7.5 21C7.22386 21 7 20.7761 7 20.5V18H4.5C4.22386 18 4 17.7761 4 17.5C4 17.2239 4.22386 17 4.5 17H7V14.5C7 14.2239 7.22386 14 7.5 14Z" fill="black"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default WishList;