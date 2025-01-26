declare global {
  interface DateComputedProps {
    className?: string;
    date: Date;
    order?:
      | "day/month/year"
      | "year/month/day"
      | "year/day/month"
      | "month/day/year";
    orderStyle?: string;
    includeTime?: boolean;
    timeOrder?:
      | "hours:minutes"
      | "hours:minutes:seconds"
      | "hours:minutes:seconds:milliseconds";
    updateEverySecond?: boolean;
    customUpdateMS?: number;
  }

  interface DateComputedState {
    date: Date;
  }
}

export {}
