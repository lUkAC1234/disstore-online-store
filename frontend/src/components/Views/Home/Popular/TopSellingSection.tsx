import styles from '../Home.module.scss';
import { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { ClothItem } from "components/Context/ClothesContext";
import Authentication from "components/Views/Authentication/Authentication";
import { WishlistItem } from "components/Context/WishlistContext";
import { ModalHandler } from 'components/Modal/Modal.utils';
import { origin } from "../../../../../project.config.json";
import HeaderError from 'components/Layout/Header/HeaderError/HeaderError';
import { withContextSelector } from 'components/Context/ContextInjector';
import { ProductModalContext } from 'components/Context/ContextCollection';
import { ActionButtonLink, Container, HeadingTwo, Section } from 'components/UI/Html/Elements/Elements';
import CatalogItem from 'components/Views/Catalog/CatalogList/CatalogProductsList/CatalogItem/CatalogItem';
import UICatalogModal from 'components/Views/Catalog/CatalogDetails/CatalogModal/CatalogDetailsModal';

interface TopSellingProps {
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

interface TopSellingState {
    products: ClothItem[];
    loading: boolean;
    error: string | null;
    pathname: string;
}

class TopSelling extends ModalHandler<TopSellingProps, TopSellingState> {
    state = {
        products: [],
        loading: true,
        error: null,
        pathname: location.pathname,
    };

    async componentDidMount(): Promise<void> {
        this.fetchPopularClothes();
    }

    async fetchPopularClothes(): Promise<void> {
        try {
            const cached = sessionStorage.getItem("popularClothes");
            if (cached) {
                const products: ClothItem[] = JSON.parse(cached);
                this.setState({ products, loading: false });
                return;
            }
            const response = await fetch(`${origin}/clothes/popular/`);
            if (!response.ok) {
                throw new Error("Не получилось загрузить популярные одежды");
            }
            const data = await response.json();
            const products: ClothItem[] = data.results ? data.results : data;
            sessionStorage.setItem("popularClothes", JSON.stringify(products));
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
            return <div>Loading popular clothes...</div>;
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
            <Section className={`swiper-section ${styles["top-selling-section"]}`}>
                <Container className={`swiper-main-container ${styles["top-selling-container"]}`}>
                    <HeadingTwo bold className={`swiper-subtitle ${styles["top-selling-subtitle"]} fade fadeInDown`}>
                        Популярное
                    </HeadingTwo>
                    <Swiper
                        className={styles["mySwiper-top-selling"]}
                        modules={[Navigation, Keyboard]}
                        navigation={{
                            nextEl: `.${styles["loop-button-top-selling-next"]}`,
                            prevEl: `.${styles["loop-button-top-selling-prev"]}`,
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
                                slidesPerView: 1,
                                spaceBetween: 10,
                            },
                            380: {
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
                                <SwiperSlide key={item.id} className={styles["top-selling-column"]}>
                                    <CatalogItem
                                        item={item}
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
                        <div className={`${styles["swiper-buttons-together-right-container"]} ${styles["swiper-buttons-top-selling-container"]}`}>
                            <div className={styles["loop-button-top-selling-prev"]}>
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </div>
                            <div className={styles["loop-button-top-selling-next"]}>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </div>
                        </div>
                    </Swiper>
                    <div className={styles["view-all-clothes-link-container"]}>
                        <ActionButtonLink white to={`/catalog`} className={styles["view-all-clothes-link"]}>
                            Просмотреть все
                        </ActionButtonLink>
                    </div>
                </Container>
            </Section>
        );
    }
}

const UITopSelling = withContextSelector(
  ProductModalContext,
  TopSelling,
  (context) => ({
    toggleModal: context.toggleModal,
    setModalChildren: context.setModalChildren,
    isModalActive: context.isModalActive,
    modalChildren: context.modalChildren,
  })
);

export default UITopSelling;
