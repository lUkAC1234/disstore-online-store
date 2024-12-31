import styles from "./Home.module.scss";
import { PureComponent, ReactNode } from "react";
import gucci from "assets/main/images/brands/gucci.webp";
import prada from "assets/main/images/brands/prada.webp";
import versace from "assets/main/images/brands/versace.webp";
import zara from "assets/main/images/brands/zara.webp";
import calvinKlein from "assets/main/images/brands/calvinKlein.webp";

interface BrandsSectionProps { }
interface BrandsSectionState {
    brands: string[];
}

class BrandsSection extends PureComponent<BrandsSectionProps, BrandsSectionState> {
    get brands(): ReactNode {
        return this.state.brands?.map(
            (brand, index) => (
                <div key={index} className={styles["brands-column"]}>
                    <img
                        src={brand}
                        alt={`${brand} brand`}
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            ));
    }
    state: Readonly<BrandsSectionState> = {
        brands: [
            versace,
            zara,
            gucci,
            prada,
            calvinKlein,
        ]
    };

    render(): ReactNode {
        return (
            <section className={styles["brands-section"]}>
                <div className={styles["brands-container"]}>
                    {this.brands}
                </div>
            </section>
        )
    }
}

export default BrandsSection;
