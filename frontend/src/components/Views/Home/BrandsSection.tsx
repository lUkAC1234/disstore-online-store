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
                <div key={index} className="brands-column fade fadeInUp">
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
            calvinKlein
        ]
    };

    componentDidMount(): void {
        setTimeout(() => {
            this.setState(prevState => {
                const originalBrands = [...prevState.brands];
                originalBrands.push(gucci);
                originalBrands.push(zara);
                originalBrands.push(prada);
                originalBrands.push(calvinKlein);
                return {
                    ...prevState,
                    brands: originalBrands
                }
            })
        }, 5000);
    }
    render(): ReactNode {
        return (
            <section className="brands-section">
                <div className="brands-container">
                    {this.brands}
                </div>
            </section>
        )
    }
}

export default BrandsSection;