import { PureComponent, ReactNode } from "react";

interface NavigationErrorProps {
    error: string;
}

class NavigationError extends PureComponent<NavigationErrorProps> {
    render(): ReactNode {
        const { error } = this.props
        return (
            <div>{error}</div>
        )
    }
}

export default NavigationError;