import { PureComponent, ReactNode } from "react";
import Details from "./Details";
import FAQs from "./FAQs";
import Review from "./Review";
import TransformTransition from "components/TransformTransition/TransformTransition";

const exampleDetails = (
    <div>
        <p>
            This product is crafted with high-quality materials to ensure comfort and
            durability.
        </p>
        <ul>
            <li>Material: 100% Cotton</li>
            <li>Available Sizes: S, M, L, XL</li>
            <li>Care Instructions: Machine wash cold</li>
        </ul>
    </div>
);

interface NavigationSectionState {
    fullWidth: boolean;
}

class NavigationSection extends PureComponent<object, NavigationSectionState> {
    render(): ReactNode {
        return (
            <TransformTransition
                fullwidth
                list={[
                    {
                        title: "Details",
                        content: <Details detailsText={exampleDetails} />,
                    },
                    {
                        title: "Review",
                        content: <Review />,
                    },
                    {
                        title: "FAQs",
                        content: <FAQs />,
                    },
                ]}
            />
        );
    }
}

export default NavigationSection;
