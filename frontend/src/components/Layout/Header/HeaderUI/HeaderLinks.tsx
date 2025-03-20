import { faAngleDown, faArrowLeftLong, faArrowRightLong, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PureComponent, ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { activeClassNameObserver } from "utils/hooks/NavActiveClassObserver";

interface HeaderLinksProps {
  containerRef: React.RefObject<HTMLDivElement>;
  activeLink: string | null;
  lang: string;
  onLinkClick: (link: string) => void;
  closeEntireMenu: () => void;
  extraLinksContainerRef: React.RefObject<HTMLDivElement>;
  activatorRef: React.RefObject<HTMLButtonElement>;
  linksMobileIsOpen: boolean;
  toggleLinksMobileActiveClass: () => void;
  onCloseDetails: () => void;
  extraLinks: ReactNode;
}

class HeaderLinks extends PureComponent<HeaderLinksProps> {
  render() {
    const {
      containerRef,
      activeLink,
      lang,
      onLinkClick,
      closeEntireMenu,
      extraLinksContainerRef,
      activatorRef,
      linksMobileIsOpen,
      toggleLinksMobileActiveClass,
      onCloseDetails,
      extraLinks,
    } = this.props;

    return (
      <div className="header-links-container" ref={containerRef}>
        <button className="mobile-version-close-button" onClick={closeEntireMenu}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <ul className="header-links-wrapper">
          <li className="header-link-list">
            <button
              className={`header-link button ${activeLink === "catalog" ? "activated" : ""}`}
              onClick={() => onLinkClick("catalog")}
            >
              <NavLink
                to={`/${lang}/catalog`}
                className={() =>
                  activeClassNameObserver(`/catalog`, "header-link")
                }
              >
                Каталог
              </NavLink>
              <span>
                Каталог <FontAwesomeIcon icon={faArrowRightLong} />
              </span>
            </button>
            <div
              ref={extraLinksContainerRef}
              className={`header-link-extra-details-container ${linksMobileIsOpen ? "active" : ""}`}
            >
              <div className="header-link-extra-details-wrapper">
                <button
                  className="header-link-extra-details-close-button"
                  onClick={onCloseDetails}
                >
                  <FontAwesomeIcon icon={faArrowLeftLong} />
                </button>
                <NavLink
                  to={`/${lang}/catalog`}
                  onClick={closeEntireMenu}
                  className={() =>
                    activeClassNameObserver(
                      `/catalog`,
                      "header-link-extra-details-column first"
                    )
                  }
                >
                  Каталог
                </NavLink>
                {extraLinks}
              </div>
            </div>
            <button
              ref={activatorRef}
              onClick={toggleLinksMobileActiveClass}
              className="header-link-extra-details-activator"
            >
              <FontAwesomeIcon icon={faAngleDown} />
            </button>
          </li>
          <li className="header-link-list">
            <NavLink
              className={() =>
                activeClassNameObserver(`/contact/us`, "header-link")
              }
              to={`/${lang}/contact/us`}
              onClick={closeEntireMenu}
            >
              Контакты
            </NavLink>
          </li>
          <li className="header-link-list">
            <NavLink
              className={() =>
                activeClassNameObserver(`/about/us`, "header-link")
              }
              to={`/${lang}/about/us`}
              onClick={closeEntireMenu}
            >
              О нас
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }
}

export default HeaderLinks;
