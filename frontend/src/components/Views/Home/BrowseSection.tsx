import { PureComponent, ReactNode } from "react";
import Casual from "assets/main/images/main-page/casual.webp";
import Formal from "assets/main/images/main-page/formal.webp";
import Party from "assets/main/images/main-page/party.webp";
import Gym from "assets/main/images/main-page/gym.webp";


class BrowseSection extends PureComponent {
    render(): ReactNode {
        return (
            <section className="browse-style-section">
                <div className="browse-style-container">
                    <h2 className="browse-style-subtitle fade fadeInDown">Поиск по стилю одежды</h2>
                    <div className="browse-style-wrapper first">
                        <a href="" className="browse-style-column casual">
                            <h3 className="browse-style-column-title fade fadeInUp">Повседневный</h3>
                            <div className="browse-style-column-image-container">
                                <img
                                    src={Casual}
                                    alt="Casual clothes"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </a>
                        <a href="" className="browse-style-column formal">
                            <h3 className="browse-style-column-title fade fadeInRight">Формальный</h3>
                            <div className="browse-style-column-image-container">
                            <img
                                    src={Formal}
                                    alt="Formal clothes"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </a>
                    </div>
                    <div className="browse-style-wrapper second">
                        <a href="" className="browse-style-column party">
                            <h3 className="browse-style-column-title fade fadeInLeft">Вечеринка</h3>
                            <div className="browse-style-column-image-container">
                            <img
                                    src={Party}
                                    alt="Party clothes"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </a>
                        <a href="" className="browse-style-column gym">
                            <h3 className="browse-style-column-title fade fadeInDown">Спортзал</h3>
                            <div className="browse-style-column-image-container">
                            <img
                                    src={Gym}
                                    alt="Gym clothes"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </a>
                    </div>
                </div>
            </section>
        )
    }
}

export default BrowseSection;