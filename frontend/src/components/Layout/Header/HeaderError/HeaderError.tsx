import "./HeaderError.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PureComponent, ReactNode } from "react";
import { faImage } from "@fortawesome/free-regular-svg-icons";

interface HeaderErrorState {
    error?: string;
    error_details?: string;
}

class HeaderError extends PureComponent<HeaderErrorState> {
    render(): ReactNode {
        return (
            <div className={"header-error-container"}>
                <div className={"header-error-image-container"}>
                    <FontAwesomeIcon icon={faImage} />
                </div>
                <h4 className={"header-error-code"}>{this.props.error}</h4>
                <p className={"header-error-description"}>{this.props.error_details}</p>
            </div>
        )
    }
}

export default HeaderError;