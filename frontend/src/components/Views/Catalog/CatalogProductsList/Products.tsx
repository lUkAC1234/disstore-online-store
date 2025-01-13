import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
import styles from "../CatalogList.module.scss"
import { PureComponent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ClothItem } from "components/Context/ClothesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faHeart } from "@fortawesome/free-solid-svg-icons";
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
                        <div className={styles["catalog-item-wishlist-cart-container"]}>
                            <Link to={""} className={styles["catalog-add-wishlist-cart-link"]}>
                                <FontAwesomeIcon icon={faCartShopping} />
                            </Link>
                            <Link to={""} className={styles["catalog-add-wishlist-cart-link"]}>
                                <FontAwesomeIcon icon={faHeart} />
                            </Link>
                        </div>
                        <div className={styles["catalog-image-container"]}>
                            {item.discount > 0 && (
                                <span className={styles["catalog-discount"]}>-{item.discount}%</span>
                            )}
                            {item?.catalogImages?.[0]?.thumbnail ? (
                                <img
                                    src={item.catalogImages[0].thumbnail}
                                    alt={item.title || "Рисунок"}
                                    loading="lazy"
                                    decoding="async"
                                    onLoad={(e) => {
                                        const imgElement = e.target as HTMLImageElement;
                                        const mainImage = item.catalogImages[0]?.image;
                                        if (mainImage) {
                                            imgElement.src = mainImage;
                                        }
                                    }}
                                />
                            ) : (
                                <SpinnerLoaderWrapper />
                            )}
                        </div>
                        <h2 className={styles["catalog-item-title"]}>
                            {item.title.length > 20 ? `${item.title.slice(0, 20)}...` : item.title}
                        </h2>
                        <p className={styles["catalog-item-description"]}>
                            {item.short_description.length > 40 ? `${item.short_description.slice(0, 40)}...` : item.short_description}
                        </p>
                        {item.count > 0 ? (
                            <p className={styles["catalog-item-count"]}>В наличии <strong className={styles["count"]}>{item.count}</strong></p>
                        ) : (
                            <p className={styles["catalog-item-count"]}>Товар закончился</p>
                        )}
                        <bdi className={styles["catalog-price-container"]}>
                            <span className={styles["catalog-real-price"]}>
                                {item.real_price.toLocaleString("en-US")} сум
                            </span>
                            {item.discount > 0 && (
                                <span className={styles["catalog-price"]}>
                                    {item.price.toLocaleString("en-US")} сум
                                </span>
                            )}
                        </bdi>
                    </div>
                ))}
            </div>
        )
    }
}

export default CatalogProducts