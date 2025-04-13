import { PureComponent } from "react";
import SpinnerLoader from "components/Loaders/SpinnerLoader";
import HeaderError from "../HeaderError/HeaderError";
import { Clothestypes } from "components/Context/ClothesContext";
import NavigationLink from "components/UI/Link/NavigationLink";

interface LinksMobileProps {
    isMenuDisactive: boolean;
    loading: boolean;
    error: boolean;
    type: Clothestypes[];
    closeEntireMenu: () => void;
    setSelectedTypes: (types: number[], callback: () => void) => void;
    setApplyFilters: () => void;
    toggleLinksMobileActiveClass: () => void;
}

class LinksMobile extends PureComponent<LinksMobileProps> {
    render() {
        const {
            isMenuDisactive,
            loading,
            error,
            type,
            closeEntireMenu,
            setSelectedTypes,
            setApplyFilters,
            toggleLinksMobileActiveClass,
        } = this.props;
        if (loading) {
            return <SpinnerLoader />;
        }
        if (error) {
            return (
                <HeaderError
                    error="Не удалось загрузить данные"
                    error_details="К сожалению, произошла ошибка при загрузке данных. Пожалуйста, перезагрузите страницу и попробуйте снова"
                />
            );
        }
        if (!type || type.length === 0) {
            return (
                <HeaderError
                    error="Не удалось загрузить данные"
                    error_details="К сожалению, произошла ошибка при загрузке данных. Пожалуйста, перезагрузите страницу и попробуйте снова"
                />
            );
        }
        return (
            <>
                {type.map((item) => (
                    <NavigationLink
                        key={item.id}
                        to={`/catalog`}
                        className="header-link-extra-details-column"
                        onClick={() => {
                            closeEntireMenu();
                            setSelectedTypes([item.id], setApplyFilters);
                            toggleLinksMobileActiveClass();
                        }}
                    >
                        {!isMenuDisactive &&
                            <div className="header-extra-link-image-container">
                                <img src={item.image} alt={item.title} />
                            </div>
                        }
                        <h4 className="header-extra-link-title">{item.title}</h4>
                    </NavigationLink>
                ))}
            </>
        );
    }
}

export default LinksMobile;
