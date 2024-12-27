import { PureComponent, ReactNode } from "react";
import welcomeImage from "assets/main/images/main-page/welcomeImage.webp";


class WelcomeSection extends PureComponent {
    render(): ReactNode {
        return (
            <section className="welcome-section">
                <div className="welcome-container">
                    <div className="welcome-text-column">
                        <h1 className="welcome-main-title fade fadeInDown">
                            Найдите одежду которая подходит вашему стилю
                        </h1>
                        <p className="welcome-text fade fadeInUp">
                            Ознакомьтесь с нашим разнообразным ассортиментом тщательно
                            созданной одежды, разработанной, чтобы подчеркнуть вашу
                            индивидуальность и удовлетворить ваше чувство стиля
                        </p>
                        <a href="" className="welcome-link fade fadeInLeft">
                            Купить сейчас
                        </a>
                        <div className="welcome-numbers-count-container">
                            <div className="welcome-numbers-count-column">
                                <span className="welcome-numbers-count fade fadeInUp">
                                    200+
                                </span>
                                <p className="welcome-numbers-count-text fade fadeInDown">
                                    Международных брендов
                                </p>
                            </div>
                            <div className="welcome-numbers-count-column">
                                <span className="welcome-numbers-count fade fadeInUp">
                                    2,000+
                                </span>
                                <p className="welcome-numbers-count-text fade fadeInDown">
                                    Высококачественная продукция
                                </p>
                            </div>
                            <div className="welcome-numbers-count-column">
                                <span className="welcome-numbers-count fade fadeInUp">
                                    30,000+
                                </span>
                                <p className="welcome-numbers-count-text fade fadeInDown">
                                    Довольных клиентов
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="welcome-image-column fade fadeInRight">
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