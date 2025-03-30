import "./Header.scss";
import { ChangeEvent, createRef } from "react";
import { Link } from "react-router-dom";
import LogoSvg from "assets/main/images/layout/logo.svg";
import { withContextSelector } from "components/Context/ContextInjector";
import { CartContext, ClothesListContext, UserContext, WishlistContext } from "components/Context/ContextCollection";
import UIReact from "utils/classes/UIReact";
import { getWithTranslation } from "i18n/hooks";
import { ClothItem } from "components/Context/ClothesContext";
import { origin } from "../../../../project.config.json";
import { debounce } from "utils/hooks/debounce";
import withRouter from "../../../Hocs/withRouter";
import HeaderSearch from "./HeaderUI/HeaderSearch";
import HeaderLinks from "./HeaderUI/HeaderLinks";
import HeaderIcons from "./HeaderUI/HeaderIcons";
import HeaderMobileMenuButton from "./HeaderUI/HeaderMobileMenuButton";
import LinksMobile from "./HeaderUI/LinksMobile";
import SearchedProductsOverlay from "./HeaderUI/SearchedProductsOverlay";

class Header extends UIReact<HeaderProps, HeaderState> {
  searchInputContainerRef = createRef<HTMLDivElement>();
  headerLinksContainerRef = createRef<HTMLDivElement>();
  extraLinksContainerRef = createRef<HTMLDivElement>();
  activatorRef = createRef<HTMLButtonElement>();
  mediaQuery: MediaQueryList = window.matchMedia("(max-width: 650px)");
  menuMediaQuery: MediaQueryList = window.matchMedia("(max-width: 1300px)");
  private searchCache: { [query: string]: ClothItem[] } = {};
  get lang(): string { return this.props.i18n.language; }

  state: Readonly<HeaderState> = {
    activeLink: null,
    title: "",
    searchResults: [],
    searchLoading: false,
    searchError: null,
    isMobile: this.mediaQuery.matches,
    isMenuDisactive: this.menuMediaQuery.matches,
    linksMobileIsOpen: false,
  };

  componentDidMount = (): void => {
    if (this.mediaQuery.addEventListener) {
      this.mediaQuery.addEventListener("change", this.handleMediaQueryChange, { signal: this.controller.signal, });
    }
    if (this.menuMediaQuery.addEventListener) {
      this.menuMediaQuery.addEventListener("change", this.handleMenuMediaQueryChange, { signal: this.controller.signal, });
    }
    window.addEventListener("click", this.outSideClickHandler, { signal: this.controller.signal, });
  };

  componentDidUpdate = (prevProps: Readonly<HeaderProps>): void => {
    if (prevProps.pathname !== this.props.pathname && this.state.linksMobileIsOpen) {
      this.setState({ linksMobileIsOpen: false });
    }
  };

  closeMenu = (event: MouseEvent): void => {
    if (
      this.headerLinksContainerRef.current &&
      !this.headerLinksContainerRef.current.contains(event.target as Node)
    ) {
      this.headerLinksContainerRef.current.classList.remove("active");
      if (this.state.activeLink) this.setState({ activeLink: null });
    }
  };

  handleLinkClick = (link: string): void => {
    this.setState((prevState) => ({
      activeLink: prevState.activeLink === link ? null : link,
    }));
  };

  outSideClickHandler = (evt: MouseEvent): void => {
    if (!this.state.linksMobileIsOpen) return;
    const target = evt.target as Node;
    const container = this.extraLinksContainerRef.current;
    const activator = this.activatorRef.current;
    if ((container && container.contains(target)) || (activator && activator.contains(target))) { return; }
    this.toggleLinksMobileActiveClass();
  };

  toggleLinksMobileActiveClass = (): void => {
    this.setState((prevState) => ({
      linksMobileIsOpen: !prevState.linksMobileIsOpen,
    }));
  };

  debouncedSearch = debounce(async (value: string) => {
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
    try {
      const response = await fetch(`${origin}/clothes/search/?title=${encodeURIComponent(query)}`);
      if (!response.ok) { throw new Error("Ошибка при загрузке данных"); }
      const data = await response.json();
      this.searchCache[query] = data;
      this.setState({ searchResults: data, searchLoading: false });
    } catch (err) {
      this.setState({ searchError: err.message, searchLoading: false });
    }
  }, 250);

  handleSearchInputChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    const value = evt.target.value;
    this.setState({ title: value });
    this.debouncedSearch(value);
  };

  handleMediaQueryChange = (evt: MediaQueryListEvent): void => { this.setState({ isMobile: evt.matches }); };
  handleMenuMediaQueryChange = (evt: MediaQueryListEvent): void => { this.setState({ isMenuDisactive: evt.matches }); };
  toggleSearchInput = (): void => { this.searchInputContainerRef.current?.classList.toggle("active"); };
  closeSearchInput = (): void => { this.searchInputContainerRef.current?.classList.remove("active"); };
  toggleMenu = (): void => { this.headerLinksContainerRef.current?.classList.add("active"); };
  closeMenuButton = (): void => { this.headerLinksContainerRef.current?.classList.remove("active"); };
  closeEntireMenu = (): void => { this.headerLinksContainerRef.current?.classList.remove("active"); };
  handleCloseDetails = (): void => { this.setState({ activeLink: null }); };

  render() {
    return (
      <header className="header" id="header">
        <nav className="navbar">
          <div className="navbar-wrapper">
            <HeaderMobileMenuButton onClick={this.toggleMenu} />
            <div className="header-logo-container">
              <Link to={`/${this.lang}/`}>
                <img src={LogoSvg} alt="Logo" />
              </Link>
            </div>
            <div className="header-content-container">
              <HeaderLinks
                containerRef={this.headerLinksContainerRef}
                activeLink={this.state.activeLink}
                lang={this.lang}
                onLinkClick={this.handleLinkClick}
                closeEntireMenu={this.closeEntireMenu}
                extraLinksContainerRef={this.extraLinksContainerRef}
                activatorRef={this.activatorRef}
                linksMobileIsOpen={this.state.linksMobileIsOpen}
                toggleLinksMobileActiveClass={this.toggleLinksMobileActiveClass}
                onCloseDetails={this.handleCloseDetails}
                extraLinks={
                  <LinksMobile
                    loading={this.props.loading}
                    error={this.props.error}
                    type={this.props.type}
                    lang={this.lang}
                    closeEntireMenu={this.closeEntireMenu}
                    setSelectedTypes={this.props.setSelectedTypes}
                    setApplyFilters={this.props.setApplyFilters}
                    toggleLinksMobileActiveClass={this.toggleLinksMobileActiveClass}
                    isMenuDisactive={this.state.isMenuDisactive}
                  />
                }
              />
              <div className="header-search-container">
                <HeaderSearch
                  isMobile={this.state.isMobile}
                  
                  title={this.state.title}
                  onInputChange={this.handleSearchInputChange}
                  toggleSearchInput={this.toggleSearchInput}
                  closeSearchInput={this.closeSearchInput}
                  searchInputRef={this.searchInputContainerRef}
                  SearchedProductsOverlay={
                    <SearchedProductsOverlay
                      searchResults={this.state.searchResults}
                      searchLoading={this.state.searchLoading}
                      searchError={this.state.searchError}
                      title={this.state.title}
                      lang={this.lang}
                      onClose={this.closeSearchInput}
                    />
                  }
                />
                <HeaderIcons
                  lang={this.lang}
                  cart={this.props.cart}
                  wishlistItems={this.props.wishlistItems}
                  isAuthenticated={this.props.isAuthenticated}
                />
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
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
const __UIHeader = withContextSelector(UserContext, ___UIHeader, (context) => ({ isAuthenticated: context.isAuthenticated, }));
const _UIHeader = withContextSelector(WishlistContext, __UIHeader, (context) => ({ wishlistItems: context.wishlistItems, }));
const UIHeader = withContextSelector(CartContext, _UIHeader, (context) => ({ cart: context.cart, }));
const TranslatedUIHeader = getWithTranslation(UIHeader);
const WithRouterHeader = withRouter(TranslatedUIHeader);
export default WithRouterHeader;
