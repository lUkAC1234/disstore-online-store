import "./Header.scss";
import { createRef, ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import LogoSvg from "assets/main/images/layout/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars, faArrowRightLong, faArrowLeftLong, } from "@fortawesome/free-solid-svg-icons";
import { withContextSelector } from "components/Context/ContextInjector";
import { CartContext, ClothesListContext, UserContext, WishlistContext } from "components/Context/ContextCollection";
import SpinnerLoader from "components/Loaders/SpinnerLoader";
import HeaderError from "./HeaderError/HeaderError";
import { activeClassNameObserver } from "utils/hooks/NavActiveClassObserver";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
import UIReact from "utils/classes/UIReact";
import { getWithTranslation } from "i18n/hooks";
import { ClothItem } from "components/Context/ClothesContext";
import { origin } from "../../../../project.config.json";
import { debounce } from "utils/hooks/debounce";

class Header extends UIReact<HeaderProps, HeaderState> {
  searchInputContainerRef = createRef<HTMLDivElement>();
  headerLinksContainerRef = createRef<HTMLDivElement>();
  mediaQuery: MediaQueryList = window.matchMedia("(max-width: 650px)");
  private searchCache: { [query: string]: ClothItem[] } = {};

  state: Readonly<HeaderState> = {
    activeLink: null,
    title: "",
    searchResults: [],
    searchLoading: false,
    searchError: null,
    setTitle: () => { },
    isMobile: this.mediaQuery.matches,
  };

  get lang(): string {
    return this.props.i18n.language;
  }

  componentDidMount(): void {
    if (this.mediaQuery.addEventListener) {
      this.mediaQuery.addEventListener("change", this.handleMediaQueryChange);
    } 
  }

  componentWillUnmount(): void {
    if (this.mediaQuery.removeEventListener) {
      this.mediaQuery.removeEventListener("change", this.handleMediaQueryChange);
    } 
  }

  handleMediaQueryChange = (e: MediaQueryListEvent): void => {
    this.setState({ isMobile: e.matches });
  };

  toggleSearchInput = () => {
    if (this.searchInputContainerRef.current) {
      this.searchInputContainerRef.current.classList.toggle("active");
    }
  };

  closeSearchInput = () => {
    if (this.searchInputContainerRef.current) {
      this.searchInputContainerRef.current.classList.remove("active");
    }
  };

  closeMenu = (event: MouseEvent) => {
    const { activeLink } = this.state;
    if (
      this.headerLinksContainerRef.current &&
      !this.headerLinksContainerRef.current.contains(event.target as Node)
    ) {
      this.headerLinksContainerRef.current.classList.remove("active");
      if (activeLink) this.setState({ activeLink: null });
    }
  };

  toggleMenu = () => {
    if (this.headerLinksContainerRef.current) {
      this.headerLinksContainerRef.current.classList.add("active");
    }
  };

  closeMenuButton = () => {
    if (this.headerLinksContainerRef.current) {
      this.headerLinksContainerRef.current.classList.remove("active");
    }
  };

  closeEntireMenu = () => {
    this.headerLinksContainerRef.current?.classList.remove("active");
  };

  handleLinkClick = (link: string) => {
    this.setState((prevState) => ({
      activeLink: prevState.activeLink === link ? null : link,
    }));
  };

  handleCloseDetails = () => {
    this.setState({ activeLink: null });
  };

  debouncedSearch = debounce((value: string) => {
    const query = value.trim();
    if (query.length < 2) {
      this.setState({ searchResults: [], searchError: null });
      return;
    }
    if (this.searchCache[query]) {
      this.setState({ searchResults: this.searchCache[query], searchLoading: false });
      return;
    }
    this.setState({ searchLoading: true, searchError: null });
    fetch(`${origin}/clothes/search/?title=${encodeURIComponent(query)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка при загрузке данных");
        }
        return response.json();
      })
      .then((data) => {
        this.searchCache[query] = data;
        this.setState({ searchResults: data, searchLoading: false });
      })
      .catch((err) => {
        this.setState({ searchError: err.message, searchLoading: false });
      });
  }, 250);

  handleSearchInputChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    const value = evt.target.value;
    this.setState({ title: value });
    this.debouncedSearch(value);
  };

  render() {
    const { activeLink, isMobile } = this.state;
    const { cart, wishlistItems } = this.props;
    return (
      <header className="header" id="header">
        <nav className="navbar">
          <div className="navbar-wrapper">
            <button
              className="mobile-version-button"
              onClick={this.toggleMenu}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            <div className="header-logo-container">
              <Link to={`/`}>
                <img src={LogoSvg} alt="Logo" />
              </Link>
            </div>
            <div className="header-content-container">
              <div
                className="header-links-container"
                ref={this.headerLinksContainerRef}
              >
                <button
                  className="mobile-version-close-button"
                  onClick={this.closeMenuButton}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
                <ul className="header-links-wrapper">
                  <li className="header-link-list">
                    <button
                      className={`header-link button ${activeLink === "catalog" ? "activated" : ""}`}
                      onClick={() => this.handleLinkClick("catalog")}
                    >
                      <NavLink
                        to={`/${this.lang}/catalog`}
                        className={() =>
                          activeClassNameObserver(`/catalog`, "header-link")
                        }
                      >
                        Каталог
                      </NavLink>
                      <span>
                        Каталог
                        <FontAwesomeIcon icon={faArrowRightLong} />
                      </span>
                    </button>
                    <div className="header-link-extra-details-container">
                      <div className="header-link-extra-details-wrapper">
                        <button
                          className="header-link-extra-details-close-button"
                          onClick={this.handleCloseDetails}
                        >
                          <FontAwesomeIcon icon={faArrowLeftLong} />
                        </button>
                        <NavLink
                          to={`/${this.lang}/catalog`}
                          onClick={this.closeEntireMenu}
                          className={() =>
                            activeClassNameObserver(
                              `/catalog`,
                              "header-link-extra-details-column first"
                            )
                          }
                        >
                          Каталог
                        </NavLink>
                        {this.linksMobile}
                      </div>
                    </div>
                  </li>
                  <li className="header-link-list">
                    <NavLink
                      className={() =>
                        activeClassNameObserver(`/contacts`, "header-link")
                      }
                      to={`/${this.lang}/contacts`}
                      onClick={this.closeEntireMenu}
                    >
                      Контакты
                    </NavLink>
                  </li>
                  <li className="header-link-list">
                    <NavLink
                      className={() =>
                        activeClassNameObserver(`/about/us`, "header-link")
                      }
                      to={`/${this.lang}/about/us`}
                      onClick={this.closeEntireMenu}
                    >
                      О нас
                    </NavLink>
                  </li>
                </ul>
              </div>
              <div className="header-search-container">
                <div className="header-search-form">
                  <div className="header-search-wrapper">
                    <button
                      id="searchButton"
                      className="header-search-button"
                      onClick={this.toggleSearchInput}
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
                      ref={this.searchInputContainerRef}
                    >
                      {isMobile && (
                        <div className="mobile-search-input-container">
                          <h4 className="mobile-search-title">
                            поиск disstore.uz
                          </h4>
                          <button
                            className="mobile-search-close"
                            onClick={this.closeSearchInput}
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
                        value={this.state.title}
                        onChange={this.handleSearchInputChange}
                      />

                      {isMobile && (
                        <div className="header-searched-mobile-container">
                          {this.SearchedProductsOverlay}
                        </div>
                      )}
                    </div>
                  </div>
                  {!isMobile && (
                    <div className="header-searched-results-container">
                      {this.SearchedProductsOverlay}
                    </div>
                  )}
                </div>
                <NavLink
                  to={`/${this.lang}/favorites`}
                  className={() =>
                    activeClassNameObserver(`/favorites`, "header-like-link")
                  }
                >
                  {wishlistItems.length > 0 ? (
                    <div className="header-orders-count-container">
                      <span className="header-orders-count-number">
                        {wishlistItems.length}
                      </span>
                    </div>
                  ) : null}
                  <svg
                    width="1.25rem"
                    height="1.25rem"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.5 5.5C5.26935 5.5 3.5 7.30906 3.5 9.5C3.5 10.4282 3.87684 11.4436 4.5487 12.5105C5.21692 13.5716 6.14148 14.6274 7.15127 15.6219C8.55769 17.007 10.0318 18.1879 11.1708 19.1003C11.4734 19.3427 11.7523 19.5661 12 19.7694C12.2477 19.5661 12.5266 19.3427 12.8292 19.1003C13.9682 18.1879 15.4423 17.007 16.8487 15.6219C17.8585 14.6274 18.7831 13.5716 19.4513 12.5105C20.1232 11.4436 20.5 10.4282 20.5 9.5C20.5 7.30898 18.7314 5.5 16.5 5.5C14.3473 5.5 13.0738 7.20226 12.7262 7.74742C12.3889 8.27655 11.6111 8.27653 11.2738 7.74742C10.9262 7.20225 9.65273 5.5 7.5 5.5ZM2 9.5C2 6.49094 4.43065 4 7.5 4C9.73143 4 11.2249 5.30207 12 6.21581C12.7751 5.30207 14.2686 4 16.5 4C19.5702 4 22 6.49102 22 9.5C22 10.8218 21.4706 12.1189 20.7206 13.3098C19.9669 14.5066 18.954 15.6539 17.9013 16.6906C16.4429 18.1269 14.808 19.4384 13.6502 20.3672C13.1649 20.7565 12.7634 21.0786 12.4939 21.3144C12.2111 21.5619 11.7889 21.5619 11.5061 21.3144C11.2366 21.0786 10.8351 20.7565 10.3498 20.3672C9.19201 19.4384 7.55712 18.1269 6.09873 16.6906C5.04602 15.6539 4.03308 14.5066 3.27942 13.3098C2.52941 12.1189 2 10.8218 2 9.5Z"
                      fill="#141415"
                    ></path>
                  </svg>
                </NavLink>
                <NavLink
                  to={
                    this.props?.isAuthenticated
                      ? `/${this.lang}/profile`
                      : `/${this.lang}/authentication`
                  }
                  className={() =>
                    activeClassNameObserver(`/profile`, "header-profile-link")
                  }
                >
                  <svg
                    width="1.25rem"
                    height="1.25rem"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 3C9.79086 3 8 4.79086 8 7V8C8 10.2091 9.79086 12 12 12C14.2091 12 16 10.2091 16 8V7C16 4.79086 14.2091 3 12 3ZM9.5 7C9.5 5.61929 10.6193 4.5 12 4.5C13.3807 4.5 14.5 5.61929 14.5 7V8C14.5 9.38071 13.3807 10.5 12 10.5C10.6193 10.5 9.5 9.38071 9.5 8V7ZM5.50232 19.3686C5.97321 16.2577 9.01803 14.5 12.0022 14.5C14.9858 14.5 18.031 16.2577 18.5019 19.3686C18.5046 19.3866 18.5025 19.3972 18.5 19.4048C18.497 19.4137 18.4903 19.4269 18.4759 19.442C18.4453 19.4741 18.3894 19.5039 18.3171 19.5039H5.68718C5.61487 19.5039 5.55898 19.4741 5.52838 19.442C5.51394 19.4269 5.50726 19.4137 5.50427 19.4048C5.50174 19.3972 5.49961 19.3865 5.50232 19.3686ZM12.0022 13C8.57321 13 4.64037 15.0404 4.01922 19.1441C3.85624 20.2208 4.75727 21.0039 5.68718 21.0039H18.3171C19.247 21.0039 20.148 20.2208 19.985 19.1441C19.3638 15.0404 15.4306 13 12.0022 13Z"
                      fill="black"
                    ></path>
                  </svg>
                </NavLink>
                <NavLink
                  to={`/${this.lang}/cart`}
                  className={() =>
                    activeClassNameObserver(`/cart`, "header-shopping-cart-link")
                  }
                >
                  {cart?.items?.length > 0 ? (
                    <div className="header-orders-count-container">
                      <span className="header-orders-count-number">
                        {cart?.items?.length}
                      </span>
                    </div>
                  ) : null}
                  <svg
                    width="1.25rem"
                    height="1.25rem"
                    viewBox="0 0 24 24"
                    fill="var(--text-black)"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9 6.5C9 4.88779 10.2402 3.5 12 3.5C13.7598 3.5 15 4.88779 15 6.5V7.5H9V6.5ZM7.5 9V11.5H9V9H15V11.5H16.5V9H18.5V19.75C18.5 20.1642 18.1642 20.5 17.75 20.5H6.25C5.83579 20.5 5.5 20.1642 5.5 19.75V9H7.5ZM7.5 7.5V6.5C7.5 4.11221 9.35984 2 12 2C14.6402 2 16.5 4.11221 16.5 6.5V7.5H19.25H20V8.25V19.75C20 20.9926 18.9926 22 17.75 22H6.25C5.00736 22 4 20.9926 4 19.75V8.25V7.5H4.75H7.5Z"
                    ></path>
                  </svg>
                </NavLink>
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  get SearchedProductsOverlay(): ReactNode {
    const { searchResults, searchLoading, searchError, title } = this.state;
    if (title.trim().length < 2) return null;
    if (searchLoading) return (
      <div className="header-searched-item">
        <SpinnerLoaderWrapper relativeCentered smallWrapper />
      </div>
    );
    if (searchError)
      return (
        <HeaderError
          error={"Не удалось загрузить данные"}
          error_details={searchError}
        />
      );
    if (searchResults.length <= 0) {
      return (
        <div className="header-searched-item">
          <h4 className="header-searched-item-title">
            К сожалению, товары по вашему запросу не найдены
          </h4>
        </div>
      );
    }
    return (
      <>
        {searchResults.map((item) => (
          <div className="header-searched-item" key={item.id}>
            <Link
              className="header-searched-link"
              to={`/${this.lang}/catalog/clothes/${item.slug}`}
              onClick={this.closeSearchInput}
            ></Link>
            <div className="header-searched-item-image-container">
              {item?.catalogImages?.[0]?.thumbnail ? (
                <img
                  src={item.catalogImages[0].thumbnail}
                  alt={item.title || "Рисунок"}
                  loading="lazy"
                  decoding="async"
                  onLoad={({ target }) => {
                    const mainImage = item.catalogImages[0]?.image;
                    if (mainImage) {
                      const tempImage = new Image();
                      tempImage.src = mainImage;
                      tempImage.onload = () =>
                        ((target as HTMLImageElement).src = mainImage);
                    }
                  }}
                />
              ) : (
                <SpinnerLoaderWrapper smallWrapper />
              )}
            </div>
            <div className="header-searched-item-content">
              <h4 className="header-searched-item-title">
                {item.title.length > 20
                  ? `${item.title.slice(0, 20)}...`
                  : item.title}
              </h4>
              <div className="header-searched-item-pricing">
                <span className="header-searched-item-current-price">
                  {item?.real_price.toLocaleString("en-US")} сум
                </span>
                {item?.discount > 0 && (
                  <div className="header-searched-discount-price-container">
                    <span className="header-searched-item-original-price">
                      {item?.price.toLocaleString("en-US")} сум
                    </span>
                    <span className="header-searched-item-discount">
                      -{item?.discount}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  get linksMobile(): ReactNode {
    const { loading, error } = this.props;
    if (loading) {
      return <SpinnerLoader />;
    }
    if (error) {
      return (
        <HeaderError
          error={"Не удалось загрузить данные"}
          error_details={
            "К сожалению, произошла ошибка при загрузке данных. Пожалуйста, перезагрузите страницу и попробуйте снова"
          }
        />
      );
    }
    if (!this.props.type || this.props.type.length === 0) {
      return (
        <HeaderError
          error={"Не удалось загрузить данные"}
          error_details={
            "К сожалению, произошла ошибка при загрузке данных. Пожалуйста, перезагрузите страницу и попробуйте снова"
          }
        />
      );
    }
    return this.props.type.map((item) => (
      <NavLink
        key={item.id}
        to={`/${this.lang}/catalog`}
        className={"header-link-extra-details-column"}
        onClick={() => {
          this.closeEntireMenu();
          this.props.setSelectedTypes([item.id], this.props.setApplyFilters);
        }}
      >
        <div className="header-extra-link-image-container">
          <img src={item.image} alt={item.title} />
        </div>
        <h4 className="header-extra-link-title">{item.title}</h4>
      </NavLink>
    ));
  }
}

const ___UIHeader = withContextSelector(
  ClothesListContext,
  Header,
  (context) => ({
    resetFilters: context.resetFilters,
    loading: context.loading,
    error: context.error,
    products: context.products,
    type: context.type,
    setApplyFilters: context.setApplyFilters,
    setSelectedTypes: context.setSelectedTypes,
  })
);

const __UIHeader = withContextSelector(UserContext, ___UIHeader, (context) => ({
  isAuthenticated: context.isAuthenticated,
}));

const _UIHeader = withContextSelector(WishlistContext, __UIHeader, (context) => ({
  wishlistItems: context.wishlistItems,
}));

const UIHeader = withContextSelector(CartContext, _UIHeader, (context) => ({
  cart: context.cart,
}));

const TranslatedUIHeader = getWithTranslation(UIHeader);

export default TranslatedUIHeader;
