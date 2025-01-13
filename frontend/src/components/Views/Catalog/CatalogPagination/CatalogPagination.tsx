import styles from "./Pagination.module.scss";
import { PureComponent, ReactNode } from "react";

interface CatalogPaginationProps {
    currentPage: number;
    totalPages: number;
    handlePrevPage?: () => void;
    handleNextPage?: () => void;
}

class CatalogPagination extends PureComponent<CatalogPaginationProps> {
    render(): ReactNode {
        const { currentPage, totalPages } = this.props;
        return (
            <div className={styles["catalog-pagination"]}>
                <button
                    onClick={this.props.handlePrevPage} 
                    className={styles["catalog-pagination-button"]}
                >
                    Предедущая
                </button>
                <span>
                    Страницы {currentPage} из {totalPages}
                </span>
                <button
                    onClick={this.props.handleNextPage} 
                    className={styles["catalog-pagination"]}
                >
                    Следующая
                </button>
            </div>
        )
    }
}

export default CatalogPagination