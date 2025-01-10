import styles from "./Home.module.scss";
import { PureComponent, ReactNode } from "react";
import Casual from "assets/main/images/main-page/casual.webp";
import Formal from "assets/main/images/main-page/formal.webp";
import Party from "assets/main/images/main-page/party.webp";
import Gym from "assets/main/images/main-page/gym.webp";
import { Link } from "react-router-dom";

class BrowseSection extends PureComponent {
    render(): ReactNode {
        return (
            <section className={styles["browse-style-section"]}>
                <div className={styles["browse-style-container"]}>
                    <h2 className={styles["browse-style-subtitle"]}>Поиск по стилю одежды</h2>
                    <div className={`${styles["browse-style-wrapper"]} ${styles["first"]}`}>
                        <Link to={""} className={`${styles["browse-style-column"]} ${styles["casual"]}`}>
                            <h3 className={styles["browse-style-column-title"]}>Повседневный</h3>
                            <div className={styles["browse-style-column-image-container"]}>
                                <img
                                    src={Casual}
                                    alt="Casual clothes"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </Link>
                        <Link to={""} className={`${styles["browse-style-column"]} ${styles["formal"]}`}>
                            <h3 className={styles["browse-style-column-title"]}>Формальный</h3>
                            <div className={styles["browse-style-column-image-container"]}>
                                <img
                                    src={Formal}
                                    alt="Formal clothes"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </Link>
                    </div>
                    <div className={`${styles["browse-style-wrapper"]} ${styles["second"]}`}>
                        <Link to={""} className={`${styles["browse-style-column"]} ${styles["party"]}`}>
                            <h3 className={styles["browse-style-column-title"]}>Вечеринка</h3>
                            <div className={styles["browse-style-column-image-container"]}>
                                <img
                                    src={Party}
                                    alt="Party clothes"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </Link>
                        <Link to={""} className={`${styles["browse-style-column"]} ${styles["gym"]}`}>
                            <h3 className={styles["browse-style-column-title"]}>Спортзал</h3>
                            <div className={styles["browse-style-column-image-container"]}>
                                <img
                                    src={Gym}
                                    alt="Gym clothes"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        )
    }
}

export default BrowseSection;
