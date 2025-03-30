import styles from "./Home.module.scss";
import { PureComponent, ReactNode } from "react";
import extraoffer from "assets/main/images/main-page/extraoffer.webp";
import { ActionButtonLink, HeadingTwo, LGContainer, Section, Text } from "components/UI/Html/Elements/Elements";

interface ExtraOfferProps {
    lang?: string;
};

class ExtraOffer extends PureComponent<ExtraOfferProps> {
    render(): ReactNode {
        const { lang } = this.props
        return (
            <Section className={styles["extra-offer-section"]}>
                <LGContainer className={styles["extra-offer-container"]}>
                    <div className={styles["extra-offer-content"]}>
                        <HeadingTwo bold white className={styles["extra-offer-title"]}>
                            Мы сделаем вашу повседневную моду лучше
                        </HeadingTwo>
                        <Text white className={styles["extra-offer-text"]}>
                            Откройте для себя модные новинки по отличным ценам, наслаждайтесь
                            уникальными скидками и создайте стильный гардероб, который будет
                            вдохновлять каждый день
                        </Text>
                        <ActionButtonLink white to={`/${lang}/catalog`} className={styles["extra-offer-link"]}>
                            Купить сейчас
                        </ActionButtonLink>
                    </div>
                    <div className={styles["extra-offer-image-container"]}>
                        <img
                            src={extraoffer}
                            alt="Offer image"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                </LGContainer>
            </Section>
        )
    }
}

export default ExtraOffer;
