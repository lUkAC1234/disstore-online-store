import { PureComponent } from "react";
import { putZero } from "./DateComputed.utils";
import { COMPONENT } from "services/utils/Injectors";

@COMPONENT<DateComputed>({
  template: (_this) => {
    return (
      <time className={_this.props.className}>
        {_this.computedDate}
      </time>
    );
  }
})
class DateComputed extends PureComponent<DateComputedProps, DateComputedState> {
  intervalRef: SetInterval;

  state: Readonly<DateComputedState> = {
    date: this.props.date,
  };

  get computedDate(): string {
    const style: string = this.props.orderStyle ?? "/";
    let computedResult: string;
    let time: string;

    const { date } = this.state;
    const year = date.getFullYear();
    const month = putZero(date.getMonth()+1);
    const day = putZero(date.getDate());
    const hours = putZero(date.getHours());
    const minutes = putZero(date.getMinutes());
    const seconds = putZero(date.getSeconds());
    const milliseconds = putZero(date.getMilliseconds());

    if (this.props.order) {
      switch (this.props.order) {
        case "day/month/year":
          computedResult = `${day}${style}${month}${style}${year}`;
          break;
        case "year/day/month":
          computedResult = `${year}${style}${day}${style}${month}`;
          break;
        case "year/month/day":
          computedResult = `${year}${style}${month}${style}${day}`;
          break;
      }
    } else {
      computedResult = `${day}${style}${month}${style}${year}`;
    }

    if (this.props.includeTime) {
      if (this.props.timeOrder) {
        switch (this.props.timeOrder) {
          case "hours:minutes":
            time = `${hours}:${minutes}`;
            break;
          case "hours:minutes:seconds":
            time = `${hours}:${minutes}:${seconds}`;
            break;
          case "hours:minutes:seconds:milliseconds":
            time = `${hours}:${minutes}:${seconds}:${milliseconds}`;
            break;
          default:
            time = `${hours}:${minutes}`;
            break;
        }
      }

      computedResult += ` ${time}`;
    }

    return computedResult;
  }

  componentDidMount(): void {
    this.manageInterval();
  }

  componentDidUpdate(prevProps: Readonly<DateComputedProps>): void {
    if (prevProps.updateEverySecond !== this.props.updateEverySecond) {
      this.manageInterval();
    }
  }

  componentWillUnmount(): void {
    this.stopInterval();
  }

  manageInterval(): void {
    if (this.props.updateEverySecond) {
      this.intervalRef = setInterval(() => this.setState({ date: new Date() }), this.props.customUpdateMS ?? 1000);
    } else {
      this.stopInterval();
    }
  }

  stopInterval(): void {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
    }
  }
}

export default DateComputed;
