import { faAngleDown, faArrowLeftLong, faArrowRightLong, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavigationLink from "components/UI/Link/NavigationLink";
import { PureComponent, ReactNode, RefObject } from "react";
import { activeClassNameObserver } from "utils/hooks/NavActiveClassObserver";

interface HeaderLinksProps {
  containerRef: RefObject<HTMLDivElement>;
  activeLink: string | null;
  onLinkClick: (link: string) => void;
  closeEntireMenu: () => void;
  extraLinksContainerRef: RefObject<HTMLDivElement>;
  activatorRef: RefObject<HTMLButtonElement>;
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
              <NavigationLink
                to={`/catalog`}
                className={() =>
                  activeClassNameObserver(`/catalog`, "header-link")
                }
              >
                Каталог
              </NavigationLink>
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
                <NavigationLink
                  to={`/catalog`}
                  onClick={closeEntireMenu}
                  className={() =>
                    activeClassNameObserver(
                      `/catalog`,
                      "header-link-extra-details-column first"
                    )
                  }
                >
                  Каталог
                </NavigationLink>
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
            <NavigationLink
              className={() =>
                activeClassNameObserver(`/contact/us`, "header-link")
              }
              to={`/contact/us`}
              onClick={closeEntireMenu}
            >
              Контакты
            </NavigationLink>
          </li>
          <li className="header-link-list">
            <NavigationLink
              className={() =>
                activeClassNameObserver(`/about/us`, "header-link")
              }
              to={`/about/us`}
              onClick={closeEntireMenu}
            >
              О нас
            </NavigationLink>
          </li>
        </ul>
      </div>
    );
  }
}

export default HeaderLinks;
