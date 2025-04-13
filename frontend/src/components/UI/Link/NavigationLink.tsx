import { withTranslation } from "i18n/hooks";
import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { WithTranslation } from "react-i18next";
import { NavLink, To } from "react-router-dom";

interface INavigationLinkProps extends PropsWithChildren, WithTranslation {
  to: To;
  className?: string | (() => string);
  onClick?: () => void;
}

class _NavigationLink extends PureComponent<INavigationLinkProps> {
  render(): ReactNode {
    const { to, onClick } = this.props;
    return (
      <NavLink
        to={`/${this.props.i18n.language}${to === "/" ? "" : to}`}
        className={this.props.className}
        onClick={onClick}
      >
        {this.props.children}
      </NavLink>
    );
  }
}

const NavigationLink = withTranslation(_NavigationLink);

export default NavigationLink;
