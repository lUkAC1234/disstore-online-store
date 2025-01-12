import { createRef, PureComponent, ReactNode } from "react";
import { Link } from "react-router-dom";
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
import { Clothestypes } from "components/Context/ClothesContext";
import { origin } from "../../../../project.config.json";

const lang = i18next.language;

interface HeaderState {
  activeLink: string | null;
  type: Clothestypes[];
}

class Header extends PureComponent<ClothesListActions, HeaderState> {
  searchInputContainerRef = createRef<HTMLDivElement>();
  headerLinksContainerRef = createRef<HTMLDivElement>();

  state: Readonly<HeaderState> = {
    activeLink: null,
    type: [],
  };

  async componentDidMount(): Promise<void> {
    this.loadTypeData();
  }

  loadTypeData = async () => {
    const type = JSON.parse(sessionStorage.getItem("types") || "[]");
    
    if (type.length <= 0) {
      const typeData = await fetch(`${origin}/clothes/types/`).then(res => res.json());
      sessionStorage.setItem("types", JSON.stringify(typeData));
      this.setState({ type: typeData });
    } else {
      this.setState({ type });
    }
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
              <Link to="/">
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
                      className={`header-link button ${activeLink === "catalog" ? "active" : ""
                        }`}
                      onClick={() => this.handleLinkClick("catalog")}
                    >
                      <Link
                        to={`/${lang}/catalog`}>Каталог
                      </Link>
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
                        <Link
                          to={`/${lang}/catalog`}
                          className="header-link-extra-details-column first"
                          onClick={this.closeEntireMenu}
                        >
                          Каталог
                        </Link>
                        {this.linksMobile}
                      </div>
                    </div>
                  </li>
                  <li className="header-link-list">
                    <Link
                      className="header-link"
                      to={`/${lang}/contacts`}
                      onClick={this.closeEntireMenu}>
                      Контакты
                    </Link>
                  </li>
                  <li className="header-link-list">
                    <Link
                      className="header-link"
                      to={`/${lang}/about`}
                      onClick={this.closeEntireMenu}>
                      О нас
                    </Link>
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
                    />
                  </div>
                </div>
                <Link to={`/${lang}/favorites`} className="header-like-link">
                  <FontAwesomeIcon icon={faHeart} />
                </Link>
                <Link to={`/${lang}/profile`} className="header-profile-link">
                  <FontAwesomeIcon icon={faUser} />
                </Link>
                <Link to={`/${lang}/cart`} className="header-shopping-cart-link">
                  <FontAwesomeIcon icon={faCartShopping} />
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  get linksMobile(): ReactNode {
    const { loading, error, products } = this.props;

    if (loading) {
      return <SpinnerLoader />;
    }

    if (error) {
      return <h4>Не удалось загрузить данные</h4>;
    }

    if (!products || products.length === 0) {
      return <h4>Нету данных</h4>;
    }

    return this.state.type.map(item => (
      <Link
        key={item.id}
        to={`/${lang}/catalog`}
        className="header-link-extra-details-column"
        onClick={this.closeEntireMenu}
      >
        <div className="header-extra-link-image-container">
          <img src={item.image} alt={item.title} />
        </div>
        <h4 className="header-extra-link-title">{item.title}</h4>
      </Link>
    ));
  }
}

const UIHeader = withContext(ClothesListContext, Header);

export default UIHeader;
