import styles from "./Brands.module.scss";
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
  state: Readonly<BrandsSectionState> = {
    brands: [versace, zara, gucci, prada, calvinKlein],
  };

  render(): ReactNode {
    const { brands } = this.state;

    const repeatedBrands = Array(10)
      .fill(brands)
      .flat();

    return (
      <section className={styles["brands-section"]}>
        <div className={styles["brands-container"]}>
          <div className={styles["brands-wrapper"]}>
            <div className={styles["brands-track"]}>
              {repeatedBrands.map((brand, index) => (
                <div key={index} className={styles["brands-column"]}>
                  <img src={brand} alt="brand" loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default BrandsSection;