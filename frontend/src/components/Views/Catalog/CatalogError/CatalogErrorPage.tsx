import styles from "./CatalogError.module.scss";
import { PureComponent, ReactNode } from "react";


interface CatalogErrorProps {
    error?: ReactNode;
    resetFilters?: () => void;
}

class CatalogErrorPage extends PureComponent<CatalogErrorProps> {
    render(): ReactNode {
        const { error, resetFilters } = this.props;
        return (
            <div className={styles["catalog-error-container"]}>
                {error ? (
                    <h3 className={styles["catalog-error"]}>
                        {error}
                    </h3>
                )
                    : (
                        <h3 className={styles["catalog-error"]}>
                            Что то случилось
                        </h3>
                    )
                }
                {resetFilters ? (
                    <button
                        className={styles["catalog-error-reset"]}
                        onClick={resetFilters}
                    >
                        Сбросить фильтры
                    </button>
                ) : (
                    null
                )
                }
            </div>
        )
    }
}

export default CatalogErrorPage