import { Component, ReactNode } from "react";
import { origin } from "../../../../project.config.json";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";
import { Link } from "react-router-dom";
import i18next from "i18next";

const lang: string = i18next.language;

interface Item {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface CatalogListState {
  items: Item[];
  isLoading: boolean;
}

class CatalogList extends Component<{}, CatalogListState> {
  state: CatalogListState = {
    items: [],
    isLoading: true,
  };

  componentDidMount() {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    try {
      const response = await fetch(origin);
      if (!response.ok) throw new Error("Failed to fetch catalog items");
      const items: Item[] = await response.json();
      this.setState({ items, isLoading: false });
    } catch (error) {
      console.error("Error fetching items:", error);
      this.setState({ isLoading: false });
    }
  }

  render(): ReactNode {
    const { items, isLoading } = this.state;

    if (isLoading) {
      return <SpinnerLoaderWrapperFixed />;
    }

    return (
      <div>
        <h1>Catalog List</h1>
        <div className="items-list">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="item-card">
                <img src={item.image} alt={item.title} />
                <h2>{item.title}</h2>
                <p>{item.price.toLocaleString()} сум</p>
                <Link to={`/${lang}/catalog/clothes/${item.id}`}>View Details</Link>
              </div>
            ))
          ) : (
            <p>No items available</p>
          )}
        </div>
      </div>
    );
  }
}

export default CatalogList;
