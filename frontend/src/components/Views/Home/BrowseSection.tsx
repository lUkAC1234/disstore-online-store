import styles from "./Home.module.scss";
import { PureComponent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { withContextSelector } from "components/Context/ContextInjector";
import { ClothesListContext } from "components/Context/ContextCollection";
import { Clothestypes } from "components/Context/ClothesContext";
import { HeadingFive, HeadingTwo, Section } from "components/UI/Html/Elements/Elements";

interface BrowseSectionProps {
    type: Clothestypes[];
    setSelectedTypes: (values: number[], callback?: () => void) => void;
    setApplyFilters: () => void;
    lang?: string;
}

class BrowseSection extends PureComponent<BrowseSectionProps> {
    render(): ReactNode {
        const { lang } = this.props
        return (
            <Section className={styles["browse-style-section"]}>
                <div className={styles["browse-style-container"]}>
                    <HeadingTwo bold className={styles["browse-style-subtitle"]}>Поиск по стилю одежды</HeadingTwo>
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
                                            to={`/${lang}/catalog`}
                                            className={styles["browse-style-column"]}
                                            onClick={() => {
                                                this.props.setSelectedTypes([item.id], this.props.setApplyFilters);
                                            }}
                                        >
                                            <HeadingFive regular className={styles["browse-style-column-title"]}>{item.title}</HeadingFive>
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
                                            to={`/${lang}/catalog`}
                                            className={`${styles["browse-style-column"]} ${styles["casual"]}`}
                                            onClick={() => {
                                                this.props.setSelectedTypes([item.id], this.props.setApplyFilters);
                                            }}
                                        >
                                            <HeadingFive regular className={styles["browse-style-column-title"]}>{item.title}</HeadingFive>
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
            </Section>
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

export default UIBrowseSection;
