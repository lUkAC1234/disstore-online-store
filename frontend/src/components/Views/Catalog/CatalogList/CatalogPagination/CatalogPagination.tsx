import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Pagination.module.scss";
import { PureComponent, ReactNode } from "react";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

class CatalogPagination extends PureComponent<CatalogPaginationProps, CatalogPaginationState> {
    render(): ReactNode {
        const { currentPage, totalPages } = this.props;
        return (
            <div className={styles["catalog-pagination"]}>
                <button
                    onClick={this.props.handlePrevPage}
                    className={styles["catalog-pagination-button"]}
                    disabled={currentPage === 1}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Предедущая</span>
                </button>
                <span className={styles["pagination-counter"]}>
                    {currentPage} из {totalPages}
                </span>
                <button
                    onClick={this.props.handleNextPage}
                    className={styles["catalog-pagination-button"]}
                    disabled={currentPage === totalPages}
                >
                    <span>Следующая</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        )
    }
}

export default CatalogPagination