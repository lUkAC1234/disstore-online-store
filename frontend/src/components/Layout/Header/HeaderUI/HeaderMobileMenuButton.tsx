import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PureComponent } from "react";

interface HeaderMobileMenuButtonProps {
  onClick: () => void;
}

class HeaderMobileMenuButton extends PureComponent<HeaderMobileMenuButtonProps> {
  render() {
    return (
      <button className="mobile-version-button" onClick={this.props.onClick}>
        <FontAwesomeIcon icon={faBars} />
      </button>
    );
  }
}

export default HeaderMobileMenuButton;
