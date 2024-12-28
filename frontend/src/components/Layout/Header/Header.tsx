import { ReactNode, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import LogoSvg from "assets/main/images/layout/logo.svg";
import i18next from "i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faBars,
  faHeart,
  faArrowRightLong,
  faArrowLeftLong,
  faMagnifyingGlass,
  faUser,
  faCartShopping
} from '@fortawesome/free-solid-svg-icons';

const lang: string = i18next.language;
function Header(): ReactNode {
  const searchInputContainerRef = useRef<HTMLDivElement>(null);
  const headerLinksContainerRef = useRef<HTMLDivElement>(null);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [clothesData, setClothesData] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/`)
      .then(response => response.json())
      .then(data => setClothesData(data))
      .catch(error => console.error('Error fetching clothes data:', error));
    const searchButton = document.getElementById("searchButton");
    const closeButton = document.querySelector(".mobile-search-close");
    const mobileVersionButton = document.querySelector(".mobile-version-button");
    const mobileVersionCloseButton = document.querySelector(".mobile-version-close-button");

    const toggleSearchInput = () => {
      if (searchInputContainerRef.current) {
        searchInputContainerRef.current.classList.toggle("active");
      }
    };

    const closeSearchInput = () => {
      if (searchInputContainerRef.current) {
        searchInputContainerRef.current.classList.remove("active");
      }
    };

    const closeMenu = (event: MouseEvent) => {
      if (
        headerLinksContainerRef.current &&
        !headerLinksContainerRef.current.contains(event.target as Node) &&
        !mobileVersionButton?.contains(event.target as Node)
      ) {
        headerLinksContainerRef.current.classList.remove("active");
        setActiveLink(null);
      }
    };

    const toggleMenu = () => {
      if (headerLinksContainerRef.current) {
        headerLinksContainerRef.current.classList.add("active");
      }
    };

    const closeMenuButton = () => {
      if (headerLinksContainerRef.current) {
        headerLinksContainerRef.current.classList.remove("active");
      }
    };

    if (searchButton) searchButton.addEventListener("click", toggleSearchInput);
    if (closeButton) closeButton.addEventListener("click", closeSearchInput);

    if (mobileVersionButton) mobileVersionButton.addEventListener("click", toggleMenu);
    if (mobileVersionCloseButton) mobileVersionCloseButton.addEventListener("click", closeMenuButton);

    document.addEventListener("click", closeMenu);

    return () => {
      if (searchButton) searchButton.removeEventListener("click", toggleSearchInput);
      if (closeButton) closeButton.removeEventListener("click", closeSearchInput);

      if (mobileVersionButton) mobileVersionButton.removeEventListener("click", toggleMenu);
      if (mobileVersionCloseButton) mobileVersionCloseButton.removeEventListener("click", closeMenuButton);

      document.removeEventListener("click", closeMenu);
    };
  }, []);

  const handleLinkClick = (link: string) => {
    setActiveLink(link === activeLink ? null : link);
  };

  const handleCloseDetails = () => {
    setActiveLink(null);
  };

  return (
    <header className="header" id="header">
      <nav className="navbar">
        <div className="navbar-wrapper">
          <button className="mobile-version-button">
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className="header-logo-container">
            <Link to="/">
              <img src={LogoSvg} alt="Logo" />
            </Link>
          </div>
          <div className="header-content-container">
            <div className="header-links-container" ref={headerLinksContainerRef}>
              <button className="mobile-version-close-button">
                <FontAwesomeIcon icon={faXmark} />
              </button>
              <ul className="header-links-wrapper">
                <li className="header-link-list">
                  <button
                    className={`header-link button ${activeLink === 'catalog' ? 'active' : ''}`}
                    onClick={() => handleLinkClick('catalog')}
                  >
                    <Link to={`/${lang}/catalog`}>Каталог</Link>
                    <span>
                      Каталог
                      <FontAwesomeIcon icon={faArrowRightLong} />
                    </span>
                  </button>
                  <div className="header-link-extra-details-container">
                    <div className="header-link-extra-details-wrapper">
                      <button
                        className="header-link-extra-details-close-button"
                        onClick={handleCloseDetails}
                      >
                        <FontAwesomeIcon icon={faArrowLeftLong} />
                      </button>
                      <Link to={`/${lang}/catalog`} className="header-link-extra-details-column first">
                        Каталог
                      </Link>
                      {clothesData.map((item, index) => (
                        <Link
                          key={index}
                          to={`/${lang}/catalog/${item.title}`}
                          className="header-link-extra-details-column"
                        >
                          {item.image && (
                            <div className="header-extra-link-image-container">
                              <img src={item.image} alt={item.title} />
                            </div>
                          )}
                          <h4 className="header-extra-link-title">{item.title}</h4>
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
                <li className="header-link-list">
                  <Link className="header-link" to={`/${lang}/contacts`}>Контакты</Link>
                </li>
                <li className="header-link-list">
                  <Link className="header-link" to={`/${lang}/about`}>О нас</Link>
                </li>
              </ul>
            </div>
            <div className="header-search-container">
              <div className="header-search-wrapper">
                <button id="searchButton" className="header-search-button">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
                <div id="header-search-input-container" className="header-search-input-container" ref={searchInputContainerRef}>
                  <div className="mobile-search-input-container">
                    <h4 className="mobile-search-title">поиск disstore.uz</h4>
                    <button className="mobile-search-close">
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
              <Link to="/favorites" className="header-like-link">
                <FontAwesomeIcon icon={faHeart} />
              </Link>
              <Link to="/profile" className="header-profile-link">
                <FontAwesomeIcon icon={faUser} />
              </Link>
              <Link to="/cart" className="header-shopping-cart-link">
                <FontAwesomeIcon icon={faCartShopping} />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
