import styles from "./Products.module.scss"
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
import { PureComponent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ClothItem } from "components/Context/ClothesContext";
import i18next from "i18next";
const lang: string = i18next.language;

interface CatalogProductsProps {
    products: ClothItem[];
}

class CatalogProducts extends PureComponent<CatalogProductsProps> {
    render(): ReactNode {
        const { products } = this.props;
        return (
            <div className={styles["catalog-items-wrapper"]}>
                {products.map((item: ClothItem) => (
                    <div key={item.id} className={styles["catalog-item"]}>
                        <Link
                            className={styles["catalog-item-link"]}
                            to={`/${lang}/catalog/clothes/${item.slug}`}
                        ></Link>
                        <div className={styles["catalog-item-wishlist-container"]}>
                            <Link to={""} className={styles["catalog-add-wishlist-link"]}>
                                <svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.5 5.5C5.26935 5.5 3.5 7.30906 3.5 9.5C3.5 10.4282 3.87684 11.4436 4.5487 12.5105C5.21692 13.5716 6.14148 14.6274 7.15127 15.6219C8.55769 17.007 10.0318 18.1879 11.1708 19.1003C11.4734 19.3427 11.7523 19.5661 12 19.7694C12.2477 19.5661 12.5266 19.3427 12.8292 19.1003C13.9682 18.1879 15.4423 17.007 16.8487 15.6219C17.8585 14.6274 18.7831 13.5716 19.4513 12.5105C20.1232 11.4436 20.5 10.4282 20.5 9.5C20.5 7.30898 18.7314 5.5 16.5 5.5C14.3473 5.5 13.0738 7.20226 12.7262 7.74742C12.3889 8.27655 11.6111 8.27653 11.2738 7.74742C10.9262 7.20225 9.65273 5.5 7.5 5.5ZM2 9.5C2 6.49094 4.43065 4 7.5 4C9.73143 4 11.2249 5.30207 12 6.21581C12.7751 5.30207 14.2686 4 16.5 4C19.5702 4 22 6.49102 22 9.5C22 10.8218 21.4706 12.1189 20.7206 13.3098C19.9669 14.5066 18.954 15.6539 17.9013 16.6906C16.4429 18.1269 14.808 19.4384 13.6502 20.3672C13.1649 20.7565 12.7634 21.0786 12.4939 21.3144C12.2111 21.5619 11.7889 21.5619 11.5061 21.3144C11.2366 21.0786 10.8351 20.7565 10.3498 20.3672C9.19201 19.4384 7.55712 18.1269 6.09873 16.6906C5.04602 15.6539 4.03308 14.5066 3.27942 13.3098C2.52941 12.1189 2 10.8218 2 9.5Z" fill="#141415"></path>
                                </svg>
                            </Link>
                        </div>
                        <div className={styles["catalog-image-container"]}>
                            {item.discount > 0 && (
                                <span className={styles["catalog-discount"]}>-{item.discount}%</span>
                            )}
                            {item?.catalogImages?.[0]?.thumbnail && (
                                <img
                                    src={item.catalogImages[0].thumbnail}
                                    alt={item.title || "Рисунок"}
                                    loading="lazy"
                                    decoding="async"
                                    onLoad={({ target }) => {
                                        const mainImage = item.catalogImages[0]?.image;
                                        if (mainImage) {
                                            const tempImage = new Image();
                                            tempImage.src = mainImage;
                                            tempImage.onload = () =>
                                                (target as HTMLImageElement).src = mainImage;
                                        }
                                    }}
                                />
                            ) || <SpinnerLoaderWrapper />}
                        </div>
                        <h2 className={styles["catalog-item-title"]}>
                            {item.title.length > 20 ? `${item.title.slice(0, 20)}...` : item.title}
                        </h2>
                        <p className={styles["catalog-item-description"]}>
                            {item.short_description.length > 40 ? `${item.short_description.slice(0, 40)}...` : item.short_description}
                        </p>
                        {item.count > 0 ? (
                            <p className={styles["catalog-item-count"]}>В наличии <strong className={styles["count"]}>({item.count})</strong></p>
                        ) : (
                            <p className={styles["catalog-item-count"]}>Товар закончился</p>
                        )}
                        <div className={styles["catalog-price-container"]}>
                            
                           <bdi className={styles["catalog-price-wrapper"]}>
                            <span className={styles["catalog-real-price"]}>
                                    {item.real_price.toLocaleString("en-US")} сум
                                </span>
                                {item.discount > 0 && (
                                    <span className={styles["catalog-price"]}>
                                        {item.price.toLocaleString("en-US")} сум
                                    </span>
                                )}
                           </bdi>
                            <Link to={""} className={styles["catalog-add-cart-link"]}>
                                <svg width="1.75rem" height="1.75rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 10V8H6V12.5C6 12.7761 5.77614 13 5.5 13C5.22386 13 5 12.7761 5 12.5V7H8C8 4.59628 9.95227 3 12 3C14.0575 3 16 4.70556 16 7H19V19.5C19 20.3284 18.3284 21 17.5 21H12.5C12.2239 21 12 20.7761 12 20.5C12 20.2239 12.2239 20 12.5 20H17.5C17.7761 20 18 19.7761 18 19.5V8H16V10H15V8H9V10H8ZM12 4C10.4477 4 9 5.20372 9 7H15C15 5.29444 13.5425 4 12 4Z" fill="black"></path>
                                    <path d="M7.5 14C7.77614 14 8 14.2239 8 14.5V17H10.5C10.7761 17 11 17.2239 11 17.5C11 17.7761 10.7761 18 10.5 18H8V20.5C8 20.7761 7.77614 21 7.5 21C7.22386 21 7 20.7761 7 20.5V18H4.5C4.22386 18 4 17.7761 4 17.5C4 17.2239 4.22386 17 4.5 17H7V14.5C7 14.2239 7.22386 14 7.5 14Z" fill="black"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}

export default CatalogProducts