import { ReactNode } from "react";
import { Link } from "react-router-dom";
import LogoSvg from "assets/main/images/layout/logo.svg";
import i18next from "i18next";

const lang: string = i18next.language;

function Header(): ReactNode {
  return (
    <header className="header" id="header">
      <nav className="navbar">
        <div className="navbar-wrapper">
          <button className="mobile-version-button">
            <i className="fa-solid fa-bars"></i>
          </button>
          <div className="header-logo-container">
            <Link to="/">
              <img src={LogoSvg} alt="Logo" />
            </Link>
          </div>
          <div className="header-content-container">
            <div className="header-links-container">
              <button className="mobile-version-close-button">
                <i className="fa-solid fa-xmark"></i>
              </button>
              <ul className="header-links-wrapper">
                <li className={`header-link-list ${window.location.pathname === '/sd' ? 'active' : ''}`}>
                  <button className="header-link button">
                    <Link to={`/${lang}/catalog`}>Каталог</Link>
                    <span>
                      Каталог
                      <i className="fa-solid fa-arrow-right-long"></i>
                    </span>
                  </button>
                </li>
                <li className="header-link-list">
                  <a className="header-link" href="">Контакты</a>
                </li>
                <li className="header-link-list">
                  <a className="header-link" href="">О нас</a>
                </li>
              </ul>
            </div>
            <div className="header-search-container">
              <div className="header-search-wrapper">
                <button id="searchButton" className="header-search-button">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
                <div id="header-search-input-container" className="header-search-input-container">
                  <div className="mobile-search-input-container">
                    <h4 className="mobile-search-title">поиск disstore.uz</h4>
                    <button className="mobile-search-close">
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                  <input id="searchInput" className="header-search-input" type="search" placeholder="Поиск по заголовку" name="search" />
                </div>
              </div>
              <a href="#" className="header-like-link">
                <i className="fa-solid fa-heart"></i>
              </a>
              <a href="#" className="header-profile-link">
                <i className="fa-solid fa-user"></i>
              </a>
              <a href="#" className="header-shopping-cart-link">
                <i className="fa-solid fa-cart-shopping"></i>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
