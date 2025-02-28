import styles from "./Home.module.scss";
import { PureComponent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { withContextSelector } from "components/Context/ContextInjector";
import { ClothesListContext } from "components/Context/ContextCollection";
import { Clothestypes } from "components/Context/ClothesContext";
import { WithTranslation } from "react-i18next";
import { getWithTranslation } from "i18n/hooks";

interface BrowseSectionProps extends WithTranslation {
    type: Clothestypes[];
    setSelectedTypes: (values: number[], callback?: () => void) => void;
    setApplyFilters: () => void;
}

class BrowseSection extends PureComponent<BrowseSectionProps> {
    get lang(): string {
        return this.props.i18n.language;
    }

    render(): ReactNode {
        return (
            <section className={styles["browse-style-section"]}>
                <div className={styles["browse-style-container"]}>
                    <h2 className={styles["browse-style-subtitle"]}>Поиск по стилю одежды</h2>
                    {(() => {
                        const items = this.props.type.slice(0, 4);
                        const firstTwo = items.slice(0, 2);
                        const nextTwo = items.slice(2, 4);

                        return (
                            <>
                                <div className={`${styles["browse-style-wrapper"]} ${styles["first"]}`}>
                                    {firstTwo.map(item => (
                                        <Link
                                            key={item.id}
                                            to={`/${this.lang}/catalog`}
                                            className={styles["browse-style-column"]}
                                            onClick={() => {
                                                this.props.setSelectedTypes([item.id], this.props.setApplyFilters);
                                            }}
                                        >
                                            <h3 className={styles["browse-style-column-title"]}>{item.title}</h3>
                                            <div className={styles["browse-style-column-image-container"]}>
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <div className={`${styles["browse-style-wrapper"]} ${styles["second"]}`}>
                                    {nextTwo.map(item => (
                                        <Link
                                            key={item.id}
                                            to={`/${this.lang}/catalog`}
                                            className={`${styles["browse-style-column"]} ${styles["casual"]}`}
                                            onClick={() => {
                                                this.props.setSelectedTypes([item.id], this.props.setApplyFilters);
                                            }}
                                        >
                                            <h3 className={styles["browse-style-column-title"]}>{item.title}</h3>
                                            <div className={styles["browse-style-column-image-container"]}>
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        );
                    })()}
                </div>
            </section>
        )
    }
}

const UIBrowseSection = withContextSelector(
    ClothesListContext,
    BrowseSection,
    (context) => ({
        type: context.type,
        setSelectedTypes: context.setSelectedTypes,
        setApplyFilters: context.setApplyFilters,
    }));

const TranslatedBrowseSection = getWithTranslation(UIBrowseSection);

export default TranslatedBrowseSection;
