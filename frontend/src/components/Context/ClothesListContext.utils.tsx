import { Size, Clothestypes, Color, ClothItem } from "components/Context/ClothesContext";
import { origin } from "../../../project.config.json";

export const fetchFilters = async (): Promise<[Size[], Clothestypes[], Color[]]> => {
  const cachedSizes = sessionStorage.getItem("sizes");
  const cachedTypes = sessionStorage.getItem("types");
  const cachedColors = sessionStorage.getItem("colors");

  if (cachedSizes && cachedTypes && cachedColors) {
    return [
      JSON.parse(cachedSizes),
      JSON.parse(cachedTypes),
      JSON.parse(cachedColors),
    ];
  }

  const [sizesData, typeData, colorsData] = await Promise.all([
    fetch(`${origin}/clothes/sizes/`).then((res) => res.json()),
    fetch(`${origin}/clothes/types/`).then((res) => res.json()),
    fetch(`${origin}/clothes/colors/`).then((res) => res.json()),
  ]);

  sessionStorage.setItem("sizes", JSON.stringify(sizesData));
  sessionStorage.setItem("types", JSON.stringify(typeData));
  sessionStorage.setItem("colors", JSON.stringify(colorsData));

  return [sizesData, typeData, colorsData];
};

export const fetchFilteredProducts = async (
  selectedColors: number[],
  selectedSizes: number[],
  selectedTypes: number[],
  colors: Color[],
  sizes: Size[],
  types: Clothestypes[],
  priceRange: { min: number, max: number },
  page: number,
): Promise<{
  next: string | null,
  previous: string | null,
  count: number,
  results: ClothItem[],
  price_min: number, price_max: number
}> => {
  const generateQueryString = <T extends { id: number }>(
    selectedItems: number[],
    allItems: T[],
    queryKey: string
  ): string => {
    const itemMap = new Map(allItems.map((item) => [item.id, item]));
    return selectedItems
      .filter((id) => itemMap.has(id))
      .map((id) => `${queryKey}=${id}`)
      .join("&");
  };

  const colorQuery = generateQueryString(selectedColors, colors, "color");
  const sizeQuery = generateQueryString(selectedSizes, sizes, "size");
  const typeQuery = generateQueryString(selectedTypes, types, "types");
  const priceQuery = `price_min=${priceRange.min}&price_max=${priceRange.max}`;

  const queryString = [colorQuery, typeQuery, sizeQuery, priceQuery]
    .filter(Boolean)
    .join("&");
  const url = `${origin}/clothes/?page=${page}&${queryString}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Не получилось загрузить данные");
  }

  return response.json();
};