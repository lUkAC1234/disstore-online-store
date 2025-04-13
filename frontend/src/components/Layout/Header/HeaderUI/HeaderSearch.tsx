import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, PureComponent, ReactNode, RefObject } from "react";

interface HeaderSearchProps {
    isMobile: boolean;
    title: string;
    onInputChange: (evt: ChangeEvent<HTMLInputElement>) => void;
    toggleSearchInput: () => void;
    closeSearchInput: () => void;
    searchInputRef: RefObject<HTMLDivElement>;
    SearchedProductsOverlay: ReactNode;
}

class HeaderSearch extends PureComponent<HeaderSearchProps> {
    render() {
        const {
            isMobile,
            title,
            onInputChange,
            toggleSearchInput,
            closeSearchInput,
            searchInputRef,
            SearchedProductsOverlay,
        } = this.props;

        return (

            <div className="header-search-form">
                <div className="header-search-wrapper">
                    <button
                        id="searchButton"
                        className="header-search-button"
                        onClick={toggleSearchInput}
                    >
                        <svg
                            width="1.25rem"
                            height="1.25rem"
                            viewBox="0 0 24 24"
                            fill="var(--text-icon)"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15.5 10.5C15.5 13.2614 13.2614 15.5 10.5 15.5C7.73858 15.5 5.5 13.2614 5.5 10.5C5.5 7.73858 7.73858 5.5 10.5 5.5C13.2614 5.5 15.5 7.73858 15.5 10.5ZM14.3398 15.7451C13.264 16.5341 11.9364 17 10.5 17C6.91015 17 4 14.0899 4 10.5C4 6.91015 6.91015 4 10.5 4C14.0899 4 17 6.91015 17 10.5C17 11.9364 16.5341 13.264 15.7451 14.3398L19.709 18.3036C20.097 18.6917 20.097 19.3209 19.709 19.709C19.3209 20.097 18.6917 20.097 18.3036 19.709L14.3398 15.7451Z"
                            ></path>
                        </svg>
                    </button>
                    <div
                        id="header-search-input-container"
                        className="header-search-input-container"
                        ref={searchInputRef}
                    >
                        {isMobile && (
                            <div className="mobile-search-input-container">
                                <h4 className="mobile-search-title">поиск disstore.uz</h4>
                                <button
                                    className="mobile-search-close"
                                    onClick={closeSearchInput}
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </div>
                        )}
                        <input
                            id="searchInput"
                            className="header-search-input"
                            type="search"
                            placeholder="Поиск по заголовку"
                            name="search"
                            value={title}
                            onChange={onInputChange}
                        />
                        {isMobile && (
                            <div className="header-searched-mobile-container">
                                {SearchedProductsOverlay}
                            </div>
                        )}
                    </div>
                </div>
                {!isMobile && (
                    <div className="header-searched-results-container">
                        {SearchedProductsOverlay}
                    </div>
                )}
            </div>
        );
    }
}

export default HeaderSearch;
