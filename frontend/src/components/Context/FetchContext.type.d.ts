import { PropsWithChildren } from "react";
import { WithTranslation } from "react-i18next";

declare global {
  interface PeriodData {
    created_day: string;
    count: number;
  }

  interface StatsRequested {
    all_count: number;
    yesterday_count: number;
    period_data: PeriodData[];
  }

  interface TreeStatsState {
    treesQty?: number;
    treesQtyYesterday?: number;
    updatedDate?: string;
    periodData?: PeriodData[];
  }

  interface NewsItemType {
    id: number;
    title: string;
    title_ru: string;
    title_uz: string;
    title_oz: string;
    text: string;
    text_ru: string;
    text_uz: string;
    text_oz: string;
    created_date: string;
    photo: string;
  }

  interface News {
    count: number;
    next: number;
    previous: number;
    results: NewsItemType[];
  }

  interface FetchContextProps extends PropsWithChildren, WithTranslation {}

  interface FetchContextState {
    news: News | null;
    stats: TreeStatsState | null;
    statsGraphData: {
      stats: {
        color: string;
        dataList: DataPoint[];
      };
    };
    loadingNews: boolean;
    loadingStats: boolean;
    successNews: boolean;
    successStats: boolean;
    errNews: string;
    errStats: string;
    fetchAgainNews: boolean;
    fetchAgainStats: boolean;
  }
}

export {}
