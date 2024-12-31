import styles from "./Home.module.scss";
import { PureComponent, ReactNode } from "react";
import welcomeImage from "assets/main/images/main-page/welcomeImage.webp";

class WelcomeSection extends PureComponent {
    render(): ReactNode {
        return (
            <section className={styles["welcome-section"]}>
                <div className={styles["welcome-container"]}>
                    <div className={styles["welcome-text-column"]}>
                        <h1 className={styles["welcome-main-title"]}>
                            Найдите одежду которая подходит вашему стилю
                        </h1>
                        <p className={styles["welcome-text"]}>
                            Ознакомьтесь с нашим разнообразным ассортиментом тщательно
                            созданной одежды, разработанной, чтобы подчеркнуть вашу
                            индивидуальность и удовлетворить ваше чувство стиля
                        </p>
                        <a href="" className={styles["welcome-link"]}>
                            Купить сейчас
                        </a>
                        <div className={styles["welcome-numbers-count-container"]}>
                            <div className={styles["welcome-numbers-count-column"]}>
                                <span className={styles["welcome-numbers-count"]}>
                                    200+
                                </span>
                                <p className={styles["welcome-numbers-count-text"]}>
                                    Международных брендов
                                </p>
                            </div>
                            <div className={styles["welcome-numbers-count-column"]}>
                                <span className={styles["welcome-numbers-count"]}>
                                    2,000+
                                </span>
                                <p className={styles["welcome-numbers-count-text"]}>
                                    Высококачественная продукция
                                </p>
                            </div>
                            <div className={styles["welcome-numbers-count-column"]}>
                                <span className={styles["welcome-numbers-count"]}>
                                    30,000+
                                </span>
                                <p className={styles["welcome-numbers-count-text"]}>
                                    Довольных клиентов
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles["welcome-image-column"]}>
                        <img
                            src={welcomeImage}
                            alt="Fashion people"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                </div>
            </section>
        )
    }
}

export default WelcomeSection;
