import styles from './Navigation.module.scss';
import { PureComponent, ReactNode } from "react";
import Details from "./Details/Details";
import FAQs from "./FAQ/FAQs";
import Review from "./Review/Review";
import TransformTransition from "components/UI/TransformTransition/TransformTransition";;

interface NavigationSectionState {
    fullWidth: boolean;
}

interface NavigationSectionProps {
    long_description: string;
    reviews?: any[];
    faqs?: any[];
}

class NavigationSection extends PureComponent<NavigationSectionProps, NavigationSectionState> {
    render(): ReactNode {
        const { long_description, reviews, faqs } = this.props;
        return (
            <div className={styles["catalog-details-navigation-wrapper"]}>
                <TransformTransition
                    fullwidth
                    list={[
                        {
                            title: "Описание",
                            content: <Details detailsText={long_description} />,
                        },
                        {
                            title: "Отзывы",
                            content: <Review reviews={reviews} />,
                        },
                        {
                            title: "Вопросы",
                            content: <FAQs faqs={faqs} />,
                        },
                    ]}
                />
            </div>
        );
    }
}

export default NavigationSection;
