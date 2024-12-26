import { ORIGIN } from "constants/API";
import { getWithTranslation } from "i18n/hooks";
import { PureComponent, ReactNode } from "react";
import { autoBindMethods } from "utils/hooks/bind";
import { debounce } from "utils/hooks/debounce";
import { FetchContext } from "./ContextCollection";
import FetchWorker from "utils/classes/FetchWorker";

export { FetchContext };

class FetchContextProvider extends PureComponent<FetchContextProps, FetchContextState> implements BindMethods {
  state: Readonly<FetchContextState> = {
    news: null,
    stats: null,
    statsGraphData: {
      stats: {
        color: "orange",
        dataList: [],
      },
    },
    loadingNews: false,
    loadingStats: false,
    successNews: false,
    successStats: false,
    errNews: "",
    errStats: "",
    fetchAgainNews: false,
    fetchAgainStats: false,
  };

  methods: BindItem[] = [
    { func: this.handleOnLanguageChanged, context: this },
  ];

  get API_urls() {
    return {
      news: `${ORIGIN}/${this.props.i18n.language}/api/news`,
      stats: `${ORIGIN}/${this.props.i18n.language}/api/trees/statistics`,
    };
  }

  set API_urls(value: { news: string, stats: string }) {
    this.API_urls = {
      news: value.news,
      stats: value.stats,
    };
  }

  newsWorker: FetchWorker<News> = new FetchWorker({
    url: this.API_urls.news,
    onLoading: () => {
      this.setState(prevState => ({
        ...prevState,
        loadingNews: true,
      }));
    },
    onSuccess: (response) => {
      this.setState(prevState => ({
        ...prevState,
        loadingNews: false,
        successNews: true,
        news: response.data,
      }));
    },
    onError: () => {
      this.setState(prevState => ({
        ...prevState,
        loadingNews: false,
        successNews: false,
        news: null,
        errNews: "Ошибка при загрузке новостей!",
      }));
    },
  });

  statsWorker: FetchWorker<StatsRequested> = new FetchWorker({
    url: this.API_urls.stats,
    onLoading: () => {
      this.setState(prevState => ({
        ...prevState,
        loadingStats: true,
      }));
    },
    onSuccess: (response) => {
      const data: StatsRequested = response.data;
      this.processStats(data);
    },
    onError: () => {
      this.setState(prevState => ({
        ...prevState,
        loadingStats: false,
        successStats: false,
        stats: null,
        errStats: "Ошибка при загрузке статистики!",
      }));
    },
  });

  constructor(props: Readonly<FetchContextProps>) {
    super(props);
    autoBindMethods(this);
  }

  render(): ReactNode {
    return (
      <FetchContext.Provider value={{...this.state}}>
        {this.props.children}
      </FetchContext.Provider>
    );
  }

  componentDidMount(): void {
    this.debouncedInitialLoad();
    this.props.i18n.on("languageChanged", this.handleOnLanguageChanged);
  }

  componentWillUnmount(): void {
    this.props.i18n.off("languageChanged", this.handleOnLanguageChanged);
  }

  debouncedInitialLoad: () => void = debounce(() => {
    this.newsWorker.fetchData();
    this.statsWorker.fetchData();
  }, 100);

  handleOnLanguageChanged(): void {
    this.newsWorker.fetchData(this.API_urls.news);
  }

  processStats(data: {
    all_count: number;
    yesterday_count: number;
    period_data: PeriodData[];
  }): void {
    this.setState(prevState => {
      const periodData: PeriodData[] = data?.period_data;
      const sortedPeriodData: PeriodData[] = periodData?.sort((a, b) => {
        const prevDate: number = Number(new Date(a.created_day));
        const nextDate: number = Number(new Date(b.created_day));
        return prevDate - nextDate;
      });

      const graphData: DataPoint[] = [];
      for (let i = 0; i < sortedPeriodData?.length; ++i) {
        const item = sortedPeriodData[i];

        graphData.push({
          date: new Date(item.created_day),
          value: item.count,
        });
      }

      const updatedDate: string = this.getComputedDate(sortedPeriodData?.[sortedPeriodData?.length - 1]?.created_day || "");
      // const dateToday: Date = new Date();
      // const yesterday: number = dateToday.getDate() - 1;
      // const updatedDateDay: number = new Date(updatedDate).getDate();
      // let treesQtyYesterday: number = sortedPeriodData?.[sortedPeriodData?.length - 1]?.count;

      // if (yesterday !== updatedDateDay) {
      //   treesQtyYesterday = 0;
      // }

      return {
        ...prevState,
        loadingStats: false,
        successStats: true,
        stats: {
          ...prevState.stats,
          treesQty: data?.all_count,
          // treesQtyYesterday: treesQtyYesterday,
          treesQtyYesterday: data?.yesterday_count,
          periodData: sortedPeriodData,
          updatedDate: updatedDate,
        },
        statsGraphData: {
          ...prevState.statsGraphData,
          stats: {
            ...prevState.statsGraphData.stats,
            dataList: graphData,
          },
        },
      };
    });
  }

  getComputedDate(date_input: string): string {
    return date_input.split("T")[0];
  }
}

const TranslatedFetchContextProvider = getWithTranslation(FetchContextProvider);

export default TranslatedFetchContextProvider;
