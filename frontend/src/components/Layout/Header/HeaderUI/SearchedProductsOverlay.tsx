import { PureComponent } from "react";
import { Link } from "react-router-dom";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
import HeaderError from "../HeaderError/HeaderError";
import { ClothItem } from "components/Context/ClothesContext";

interface SearchedProductsOverlayProps {
    searchResults: ClothItem[];
    searchLoading: boolean;
    searchError: string | null;
    title: string;
    lang: string;
    onClose: () => void;
}

class SearchedProductsOverlay extends PureComponent<SearchedProductsOverlayProps> {
    render() {
        const { searchResults, searchLoading, searchError, title, lang, onClose } = this.props;
        if (title.trim().length < 2) return null;
        if (searchLoading)
            return (
                <div className="header-searched-item">
                    <SpinnerLoaderWrapper relativeCentered smallWrapper />
                </div>
            );
        if (searchError)
            return (
                <HeaderError
                    error="Не удалось загрузить данные"
                    error_details={searchError}
                />
            );
        if (searchResults.length <= 0) {
            return (
                <div className="header-searched-item">
                    <h4 className="header-searched-item-title">
                        К сожалению, товары по вашему запросу не найдены
                    </h4>
                </div>
            );
        }
        return (
            <>
                {searchResults.map((item) => (
                    <div className="header-searched-item" key={item.id}>
                        <Link
                            className="header-searched-link"
                            to={`/${lang}/catalog/clothes/${item.slug}`}
                            onClick={onClose}
                        />
                        <div className="header-searched-item-image-container">
                            {item?.catalogImages?.[0]?.thumbnail ? (
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
                                                ((target as HTMLImageElement).src = mainImage);
                                        }
                                    }}
                                />
                            ) : (
                                <SpinnerLoaderWrapper smallWrapper />
                            )}
                        </div>
                        <div className="header-searched-item-content">
                            <h4 className="header-searched-item-title">
                                {item.title.length > 20
                                    ? `${item.title.slice(0, 20)}...`
                                    : item.title}
                            </h4>
                            <div className="header-searched-item-pricing">
                                <span className="header-searched-item-current-price">
                                    {item?.real_price.toLocaleString("en-US")} сум
                                </span>
                                {item?.discount > 0 && (
                                    <div className="header-searched-discount-price-container">
                                        <span className="header-searched-item-original-price">
                                            {item?.price.toLocaleString("en-US")} сум
                                        </span>
                                        <span className="header-searched-item-discount">
                                            -{item?.discount}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </>
        );
    }
}

export default SearchedProductsOverlay;
