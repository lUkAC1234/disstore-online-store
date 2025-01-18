import "./Header.scss"
import { createRef, PureComponent, ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import LogoSvg from "assets/main/images/layout/logo.svg";
import i18next from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faBars,
  faHeart,
  faArrowRightLong,
  faArrowLeftLong,
  faMagnifyingGlass,
  faUser,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import { withContext } from "components/Context/ContextInjector";
import { ClothesListContext } from "components/Context/ContextCollection";
import { ClothesListActions } from "components/Context/ClothesListContext";
import SpinnerLoader from "components/Loaders/SpinnerLoader";
import HeaderError from "./HeaderError/HeaderError";
import { activeClassNameObserver } from "utils/hooks/NavActiveClassObserver";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";

const lang = i18next.language;

interface HeaderState {
  activeLink: string | null;
}

class Header extends PureComponent<ClothesListActions, HeaderState> {
  searchInputContainerRef = createRef<HTMLDivElement>();
  headerLinksContainerRef = createRef<HTMLDivElement>();

  state: Readonly<HeaderState> = {
    activeLink: null,
  };

  toggleSearchInput = () => {
    if (this.searchInputContainerRef.current) {
      this.searchInputContainerRef.current?.classList.toggle("active");
    }
  };

  closeSearchInput = () => {
    if (this.searchInputContainerRef.current) {
      this.searchInputContainerRef.current?.classList.remove("active");
    }
  };

  closeMenu = (event: MouseEvent) => {
    const { activeLink } = this.state;
    if (
      this.headerLinksContainerRef.current &&
      !this.headerLinksContainerRef.current?.contains(event.target as Node)
    ) {
      this.headerLinksContainerRef.current?.classList.remove("active");
      if (activeLink) this.setState({ activeLink: null });
    }
  };

  toggleMenu = () => {
    if (this.headerLinksContainerRef.current) {
      this.headerLinksContainerRef.current?.classList.add("active");
    }
  };

  closeMenuButton = () => {
    if (this.headerLinksContainerRef.current) {
      this.headerLinksContainerRef.current?.classList.remove("active");
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

  searchInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    this.props.setTitle(value);
    this.props.setApplyFilters();
  }

  render() {
    const { activeLink } = this.state;
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
              <NavLink to={`/`}
                className={() => {
                  return activeClassNameObserver(``, "");
                }}>
                <img src={LogoSvg} alt="Logo" />
              </NavLink>
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
                      className={`header-link button ${activeLink === "catalog" ? "activated" : ""
                        }`}
                      onClick={() => this.handleLinkClick("catalog")}
                    >
                      <NavLink
                        to={`/${lang}/catalog`}
                        className={() => {
                          return activeClassNameObserver(`/catalog`, "header-link");
                        }}>Каталог
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
                          to={`/${lang}/catalog`}
                          onClick={this.closeEntireMenu}
                          className={() => {
                            return activeClassNameObserver(`/catalog`, "header-link-extra-details-column first");
                          }}
                        >
                          Каталог
                        </NavLink>
                        {this.linksMobile}
                      </div>
                    </div>
                  </li>
                  <li className="header-link-list">
                    <NavLink
                      className={() => {
                        return activeClassNameObserver(`/contacts`, "header-link");
                      }}
                      to={`/${lang}/contacts`}
                      onClick={this.closeEntireMenu}>
                      Контакты
                    </NavLink>
                  </li>
                  <li className="header-link-list">
                    <NavLink
                      className={() => {
                        return activeClassNameObserver(`/about`, "header-link");
                      }}
                      to={`/${lang}/about`}
                      onClick={this.closeEntireMenu}>
                      О нас
                    </NavLink>
                  </li>
                </ul>
              </div>
              <div className="header-search-container">
                <div className="header-search-wrapper">
                  <button
                    id="searchButton"
                    className="header-search-button"
                    onClick={this.toggleSearchInput}
                  >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </button>
                  <div
                    id="header-search-input-container"
                    className="header-search-input-container"
                    ref={this.searchInputContainerRef}
                  >
                    <div className="mobile-search-input-container">
                      <h4 className="mobile-search-title">поиск disstore.uz</h4>
                      <button
                        className="mobile-search-close"
                        onClick={this.closeSearchInput}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                    <input
                      id="searchInput"
                      className="header-search-input"
                      type="search"
                      placeholder="Поиск по заголовку"
                      name="search"
                      value={this.props.title}
                      onChange={this.searchInputChange}
                    />
                  </div>
                  <div className="header-searched-results-container">
                    {this.SearchedProductsOverlay}
                  </div>
                </div>
                <NavLink
                  to={`/${lang}/favorites`}
                  className={() => {
                    return activeClassNameObserver(`/favorites`, "header-like-link");
                  }}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </NavLink>
                <NavLink
                  to={`/${lang}/profile`}
                  className={() => {
                    return activeClassNameObserver(`/profile`, "header-profile-link");
                  }}
                >
                  <FontAwesomeIcon icon={faUser} />
                </NavLink>
                <NavLink
                  to={`/${lang}/cart`}
                  className={() => {
                    return activeClassNameObserver(`/cart`, "header-shopping-cart-link");
                  }}
                >
                  <FontAwesomeIcon icon={faCartShopping} />
                </NavLink>
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  get SearchedProductsOverlay(): ReactNode {
    const { loading, error, title, products } = this.props;

    if (loading) {
      return <SpinnerLoader />;
    }

    if (error) {
      return <HeaderError
        error={"Не удалось загрузить данные"}
        error_details={"К сожалению, произошла ошибка при загрузке данных. Пожалуйста, перезагрузите страницу и попробуйте снова"}
      />;
    }

    if (title.length === 0) {
      return <h4>Пожалуйста, введите запрос, чтобы найти подходящие товары.</h4>;
    }

    return products
      .filter((item) => item.title.toLowerCase().includes(title.toLowerCase()))
      .map((item) => (
        <>
          <div className="header-searched-item">
            <Link
              className="header-searched-link"
              to={`/${lang}/catalog/clothes/${item.slug}`}
              key={item.id}
            ></Link>
            <div className="header-searched-item-image-container">
              {item?.catalogImages?.[0]?.thumbnail && (
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
                      tempImage.onload = () => (target as HTMLImageElement).src = mainImage;
                    }
                  }}
                />
              ) || <SpinnerLoaderWrapper />}
            </div>
            <h4 className="header-searched-item-title">{item.title}</h4>
            <div className={"header-searched-item-pricing"}>
              <span className={"header-searched-item-current-price"}>
                {item?.real_price.toLocaleString('en-US')} сум
              </span>
              {item?.discount > 0 ? (
                <>
                  <span className={"header-searched-item-original-price"}>
                    {item?.price.toLocaleString('en-US')} сум
                  </span>
                  <span className={"header-searched-item-discount"}>
                    -{item?.discount}%
                  </span>
                </>
              ) : (
                null
              )}
            </div>
          </div>
        </>
      ));
  }

  get linksMobile(): ReactNode {
    const { loading, error } = this.props;

    if (loading) {
      return <SpinnerLoader />;
    }

    if (error) {
      return <HeaderError
        error={"Не удалось загрузить данные"}
        error_details={"К сожалению, произошла ошибка при загрузке данных. Пожалуйста, перезагрузите страницу и попробуйте снова"}
      />;
    }

    if (!this.props.type || this.props.type.length === 0) {
      return <HeaderError
        error={"Не удалось загрузить данные"}
        error_details={"К сожалению, произошла ошибка при загрузке данных. Пожалуйста, перезагрузите страницу и попробуйте снова"}
      />;
    }

    return this.props.type.map(item => (
      <NavLink
        key={item.id}
        to={`/${lang}/catalog`}
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

const UIHeader = withContext(ClothesListContext, Header);

export default UIHeader;
