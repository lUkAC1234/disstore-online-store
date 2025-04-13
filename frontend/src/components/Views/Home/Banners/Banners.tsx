import styles from "./Banners.module.scss";
import { PureComponent } from "react";
import { origin } from "../../../../../project.config.json";
import { Swiper, SwiperSlide } from "swiper/react";
import OptimizedImage from "components/UI/OptimizedImage/OptimizedImage";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
import type { Swiper as SwiperType } from "swiper";

const PROGRESS_STEP = 1;
const PROGRESS_INTERVAL_MS = 50;
const MAX_PROGRESS = 100;

interface IBanner {
    id: number;
    file: string;
    thumbnail: string | null;
}

interface IBannersState {
    banners: IBanner[];
    error: string | null;
    progress: number;
    isUserInteracting: boolean;
}

class Banners extends PureComponent<{}, IBannersState> {
    state: IBannersState = {
        banners: [],
        error: null,
        progress: 0,
        isUserInteracting: false,
    };

    private swiperInstance: SwiperType | null = null;
    private progressInterval?: number;

    async componentDidMount() {
        await this.loadBanners();
        this.startAutoPlay();
    }

    componentDidUpdate(_: {}, prevState: IBannersState): void {
        if (
            this.state.banners.length &&
            this.state.progress === 0 &&
            !this.state.isUserInteracting &&
            prevState.isUserInteracting !== this.state.isUserInteracting
        ) {
            this.startAutoPlay();
        }
    }

    componentWillUnmount() {
        this.clearAutoPlay();
    }

    loadBanners = async () => {
        try {
            const cachedBanners = sessionStorage.getItem("banners");
            if (cachedBanners) {
                this.setState({ banners: JSON.parse(cachedBanners) });
                return;
            }
            const response = await fetch(`${origin}/clothes/banners/`);
            if (!response.ok) {
                throw new Error(`Не получилось загрузить: ${response.status} ${response.statusText}`);
            }
            const data: IBanner[] = await response.json();
            sessionStorage.setItem("banners", JSON.stringify(data));
            this.setState({ banners: data, error: null });
        } catch (error) {
            console.error("Ошибка загрузки баннеров:", error);
            this.setState({ error: "Не получилось загрузить баннеры" });
        }
    };

    startAutoPlay = () => {
        this.clearAutoPlay();
        this.setState({ progress: 0 });
        this.progressInterval = window.setInterval(this.updateProgress, PROGRESS_INTERVAL_MS);
    };

    updateProgress = () => {
        if (!this.swiperInstance) return;

        this.setState((prevState) => {
            const newProgress = prevState.progress + PROGRESS_STEP;
            if (newProgress >= MAX_PROGRESS) {
                this.swiperInstance!.slideNext();
                return { ...prevState, progress: 0 };
            }
            return { ...prevState, progress: newProgress };
        });
    };

    clearAutoPlay = () => {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = undefined;
        }
    };

    nextSlide = () => {
        this.swiperInstance?.slideNext();
    };

    handleInteractionStart = () => {
        this.setState({ isUserInteracting: true });
        this.clearAutoPlay();
    };

    handleInteractionEnd = () => {
        this.setState({ isUserInteracting: false }, this.startAutoPlay);
    };

    renderBannerContent = (file: string, thumbnail: string | null, id: number) => {
        const fileExtension = file.split(".").pop()?.toLowerCase();
        if (!fileExtension) return <p>Не удалось загрузить баннеры</p>;

        if (["jpg", "jpeg", "png", "webp", "svg", "gif"].includes(fileExtension)) {
            return (
                <OptimizedImage
                    no_aspect
                    className={styles["banners-image"]}
                    src={file}
                    thumbnail={thumbnail}
                    alt={`баннер ${id}`}
                />
            );
        }

        if (["mp4", "mov", "avi"].includes(fileExtension)) {
            return (
                <video
                    className={styles["banners-video"]}
                    src={file}
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={thumbnail || undefined}
                />
            );
        }

        return <p>Ошибка в сайте</p>;
    };

    render() {
        const { banners, error, progress } = this.state;

        if (error) return <p style={{ color: "red" }}>{error}</p>;

        return (
            <section className={styles["banners-section"]}>
                {banners.length ? (
                    <>
                        <Swiper
                            spaceBetween={0}
                            slidesPerView={1}
                            loop
                            grabCursor
                            className={styles["banners-container"]}
                            onSwiper={(swiper) => (this.swiperInstance = swiper)}
                            onTouchStart={this.handleInteractionStart}
                            onTouchEnd={this.handleInteractionEnd}
                        >
                            {banners.map((banner) => (
                                <SwiperSlide key={banner.id} className={styles["banners-slide"]}>
                                    {this.renderBannerContent(banner.file, banner.thumbnail, banner.id)}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className={styles["autoplay-indicator"]}>
                            <div className={styles["autoplay-progress"]} style={{ width: `${progress}%` }} />
                        </div>
                    </>
                ) : (
                    <div className={styles["banners-loader-container"]}>
                        <SpinnerLoaderWrapper relativeCentered />
                    </div>
                )}
            </section>
        );
    }
}

export default Banners;
