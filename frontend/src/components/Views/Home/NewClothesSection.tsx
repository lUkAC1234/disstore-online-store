import styles from './Home.module.scss';
import { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import CatalogItem from '../Catalog/CatalogList/CatalogProductsList/CatalogItem/CatalogItem';
import { ClothItem } from "components/Context/ClothesContext";
import { WithTranslation } from "react-i18next";
import { getWithTranslation } from "i18n/hooks";
import Authentication from "components/Views/Authentication/Authentication";
import UICatalogModal from '../Catalog/CatalogDetails/CatalogModal/CatalogDetailsModal';
import { WishlistItem } from "components/Context/WishlistContext";
import { ModalHandler } from 'components/Modal/Modal.utils';
import { origin } from "../../../../project.config.json";
import HeaderError from 'components/Layout/Header/HeaderError/HeaderError';
import { ProductModalContext } from 'components/Context/ContextCollection';
import { withContextSelector } from 'components/Context/ContextInjector';
import SpinnerLoaderWrapper from 'components/Loaders/SpinnerLoaderWrapper';

interface NewClothesProps extends WithTranslation {
    wishlistItems?: WishlistItem[];
    addToWishList?: (productId: number) => Promise<void>;
    removeFromWishlist?: (wishlistItemId: number) => Promise<void>;
    loadingWishlist?: boolean;
    toggleModal: (callback: () => void) => void;
    setModalChildren: (children: ReactNode) => void;
    isModalActive: boolean;
    modalChildren: ReactNode;
    isAuthenticated: boolean;
}

interface NewClothesState {
    products: ClothItem[];
    loading: boolean;
    error: string | null;
    pathname: string;
}

class NewClothes extends ModalHandler<NewClothesProps, NewClothesState> {
    state = {
        products: [],
        loading: true,
        error: null,
        pathname: location.pathname,
    };

    get lang(): string {
        return this.props.i18n.language;
    }

    async componentDidMount(): Promise<void> {
        this.fetchNewClothes();
    }

    async fetchNewClothes(): Promise<void> {
        try {
            const cached = sessionStorage.getItem("newClothes");
            if (cached) {
                const products: ClothItem[] = JSON.parse(cached);
                this.setState({ products, loading: false });
                return;
            }

            const response = await fetch(`${origin}/clothes/new/`);
            if (!response.ok) {
                throw new Error("Failed to fetch new clothes");
            }
            const data = await response.json();
            const products: ClothItem[] = data.results ? data.results : data;
            sessionStorage.setItem("newClothes", JSON.stringify(products));
            this.setState({ products, loading: false });
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    }

    render(): ReactNode {
        const {
            wishlistItems = [],
            addToWishList,
            removeFromWishlist,
            isAuthenticated,
        } = this.props;
        const { products, loading, error } = this.state;

        if (loading) {
            return <SpinnerLoaderWrapper smallWrapper wrapperStyle={{ height: "25rem" }} />;
        }

        if (error) {
            return (
                <HeaderError
                    error={"Не удалось загрузить данные"}
                    error_details={"К сожалению, произошла ошибка при загрузке данных. Пожалуйста, перезагрузите страницу и попробуйте снова"}
                />
            );
        }

        return (
            <section className={`swiper-section ${styles["new-clothes-section"]}`}>
                <div className={`swiper-main-container ${styles["new-clothes-container"]}`}>
                    <h2 className={`swiper-subtitle ${styles["new-clothes-subtitle"]} fade fadeInDown`}>
                        Новинки
                    </h2>
                    <Swiper
                        className={styles["mySwiper-new-clothes"]}
                        modules={[Navigation, Keyboard]}
                        navigation={{
                            nextEl: `.${styles["loop-button-new-clothes-next"]}`,
                            prevEl: `.${styles["loop-button-new-clothes-prev"]}`,
                        }}
                        keyboard={{
                            enabled: true,      
                            onlyInViewport: true,
                            pageUpDown: true,
                        }}
                        slidesPerView={4}
                        initialSlide={0}
                        grabCursor={true}
                        loop={true}
                        roundLengths={true}
                        speed={600}
                        breakpoints={{
                            0: {
                                slidesPerView: 1.5,
                                spaceBetween: 10,
                            },
                            450: {
                                slidesPerView: 2,
                                spaceBetween: 15,
                            },
                            900: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                            1300: {
                                slidesPerView: 4,
                                spaceBetween: 25,
                            }
                        }}
                    >
                        {products.map((item: ClothItem) => {
                            const wishlistItem = wishlistItems.find(wItem => wItem.product.id === item.id);
                            const inWishlist = Boolean(wishlistItem);
                            return (
                                <SwiperSlide key={item.id} className={styles["new-clothes-column"]}>
                                    <CatalogItem
                                        item={item}
                                        lang={this.lang}
                                        isInWishlist={inWishlist}
                                        onWishlistClick={(clickedItem: ClothItem) => {
                                            if (isAuthenticated) {
                                                const existingWishlistItem = wishlistItems.find(
                                                    (wItem) => wItem.product.id === clickedItem.id
                                                );
                                                if (existingWishlistItem && removeFromWishlist) {
                                                    removeFromWishlist(existingWishlistItem.id);
                                                } else if (addToWishList) {
                                                    addToWishList(clickedItem.id);
                                                }
                                            } else {
                                                this.openModal(<Authentication smallVersion />);
                                            }
                                        }}
                                        onCartClick={(clickedItem: ClothItem) => {
                                            this.openModal(
                                                <UICatalogModal productSlug={clickedItem.slug} />,
                                                <Authentication smallVersion />
                                            );
                                        }}
                                    />
                                </SwiperSlide>
                            );
                        })}
                        <div className={`${styles["swiper-buttons-together-right-container"]} ${styles["swiper-buttons-new-clothes-container"]}`}>
                            <div className={styles["loop-button-new-clothes-prev"]}>
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </div>
                            <div className={styles["loop-button-new-clothes-next"]}>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </div>
                        </div>
                    </Swiper>
                    <div className={styles["view-all-clothes-link-container"]}>
                        <Link to={`/${this.lang}/catalog`} className={styles["view-all-clothes-link"]}>
                            Просмотреть все
                        </Link>
                    </div>
                </div>
            </section>
        );
    }
}

const UINewClothes = withContextSelector(
    ProductModalContext,
    NewClothes,
    (context) => ({
        toggleModal: context.toggleModal,
        setModalChildren: context.setModalChildren,
        isModalActive: context.isModalActive,
        modalChildren: context.modalChildren,
    })
);

export default getWithTranslation(UINewClothes);
