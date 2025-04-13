import { SmallText } from "components/UI/Html/Elements/Elements";
import styles from "./AnnouncementBar.module.scss"; 
import { PureComponent, ReactNode } from "react";

class AnnouncementBar extends PureComponent {
    render(): ReactNode {
        return (
            <section className={styles["announcement-bar-section"]}>
                <div className={styles["announcement-bar-container"]}>
                    <SmallText white className={styles["announcement-bar-text"]}>
                        Получите 10% скидки при регистрации на нашем сайте
                    </SmallText>
                </div>
            </section>
        );
    }
}

export default AnnouncementBar;
