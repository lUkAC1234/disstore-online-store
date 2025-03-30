import styles from "./Home.module.scss";
import { PureComponent, ReactNode } from "react";
import welcomeImage from "assets/main/images/main-page/models.webp";
import thumbwelcomeImage from "assets/main/images/main-page/thumb_welcomeImage.webp";
import { Link } from "react-router-dom";
import OptimizedImage from "components/UI/OptimizedImage/OptimizedImage";
import { ActionButtonLink, HeadingOne, Text } from "components/UI/Html/Elements/Elements";

interface WelcomeSectionProps {
    lang?: string;
};

class WelcomeSection extends PureComponent<WelcomeSectionProps> {
    render(): ReactNode {
        const { lang } = this.props;
        return (
            <section className={styles["welcome-section"]}>
                <div className={styles["welcome-container"]}>
                    <div className={styles["welcome-text-column"]}>
                        <HeadingOne className={styles["welcome-main-title"]}>
                            Найдите одежду которая подходит вашему стилю
                        </HeadingOne>
                        <Text className={styles["welcome-text"]}>
                            Ознакомьтесь с нашим разнообразным ассортиментом тщательно
                            созданной одежды, разработанной, чтобы подчеркнуть вашу
                            индивидуальность и удовлетворить ваше чувство стиля
                        </Text>
                        <ActionButtonLink to={`/${lang}/catalog`} className={styles["welcome-link"]}>
                            Купить сейчас
                        </ActionButtonLink>
                        <div className={styles["welcome-numbers-count-container"]}>
                            <div className={styles["welcome-numbers-count-column"]}>
                                <span className={styles["welcome-numbers-count"]}>
                                    200+
                                </span>
                                <Text className={styles["welcome-numbers-count-text"]}>
                                    Международных брендов
                                </Text>
                            </div>
                            <div className={styles["welcome-numbers-count-column"]}>
                                <span className={styles["welcome-numbers-count"]}>
                                    2,000+
                                </span>
                                <Text className={styles["welcome-numbers-count-text"]}>
                                    Высококачественная продукция
                                </Text>
                            </div>
                            <div className={styles["welcome-numbers-count-column"]}>
                                <span className={styles["welcome-numbers-count"]}>
                                    30,000+
                                </span>
                                <Text className={styles["welcome-numbers-count-text"]}>
                                    Довольных клиентов
                                </Text>
                            </div>
                        </div>
                    </div>
                    <div className={styles["welcome-image-column"]}>
                        <OptimizedImage
                            src={welcomeImage}
                            alt={"Fashion people"}
                            thumbnail={thumbwelcomeImage}
                        />
                    </div>
                </div>
            </section>
        )
    }
}

export default WelcomeSection;
