import styles from "./Home.module.scss";
import { PureComponent, ReactNode } from "react";
import extraoffer from "assets/main/images/main-page/extraoffer.webp";
import { Link } from "react-router-dom";

interface ExtraOfferProps {
    lang?: string;
};

class ExtraOffer extends PureComponent<ExtraOfferProps> {
    render(): ReactNode {
        const { lang } = this.props
        return (
            <section className={styles["extra-offer-section"]}>
                <div className={styles["extra-offer-container"]}>
                    <div className={styles["extra-offer-content"]}>
                        <h3 className={styles["extra-offer-title"]}>
                            Мы сделаем вашу повседневную моду лучше
                        </h3>
                        <p className={styles["extra-offer-text"]}>
                            Откройте для себя модные новинки по отличным ценам, наслаждайтесь
                            уникальными скидками и создайте стильный гардероб, который будет
                            вдохновлять каждый день
                        </p>
                        <Link to={`/${lang}/catalog`} className={styles["extra-offer-link"]}>
                            Купить сейчас
                        </Link>
                    </div>
                    <div className={styles["extra-offer-image-container"]}>
                        <img
                            src={extraoffer}
                            alt="Offer image"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                </div>
            </section>
        )
    }
}

export default ExtraOffer;
