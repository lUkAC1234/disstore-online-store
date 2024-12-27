import { PureComponent, ReactNode } from "react";
import extraoffer from "assets/main/images/main-page/extraoffer.webp";


class ExtraOffer extends PureComponent {
    render(): ReactNode {
        return (
            <section className="extra-offer-section">
                <div className="extra-offer-container">
                    <div className="extra-offer-content">
                        <h3 className="extra-offer-title fade fadeInUp">
                            Мы сделаем вашу повседневную моду лучше
                        </h3>
                        <p className="extra-offer-text fade fadeInUp">
                            Откройте для себя модные новинки по отличным ценам, наслаждайтесь
                            уникальными скидками и создайте стильный гардероб, который будет
                            вдохновлять каждый день
                        </p>
                        <a href="" className="extra-offer-link fade fadeInUp">
                            Купить сейчас
                        </a>
                    </div>
                    <div className="extra-offer-image-container">
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