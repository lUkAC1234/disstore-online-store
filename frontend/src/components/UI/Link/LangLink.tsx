import { withTranslation } from "i18n/hooks";
import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { WithTranslation } from "react-i18next";
import { Link, To } from "react-router-dom";

interface ILangLinkLinkProps extends PropsWithChildren, WithTranslation {
  to: To;
  className?: string;
  onClick?: () => void;
}

class _LangLink extends PureComponent<ILangLinkLinkProps> {
  render(): ReactNode {
    const { to, onClick } = this.props;
    return (
      <Link
        to={`/${this.props.i18n.language}${to === "/" ? "" : to}`}
        className={this.props.className}
        onClick={onClick}
      >
        {this.props.children}
      </Link>
    );
  }
}

const LangLink = withTranslation(_LangLink);

export default LangLink;
