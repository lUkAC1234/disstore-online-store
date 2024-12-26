import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { autoBindMethods } from "utils/hooks/bind";
import { PlantTreesContext } from "./ContextCollection";

export { PlantTreesContext };

export interface PlantTreesContextProps extends PropsWithChildren {}
export interface PlantTreesContextState {
  min: number;
  max: number;
  step: number;
  value: number;
  valueForRange: number;
  overallAmount: number;
  singleTreePrice: number;
  insetValue: number;
  achievements: {
    trees: number;
    people: number;
    o2Element: number;
  };
  certName: string;
}
export interface PlantTreesContextStateWithActions extends PlantTreesContextState {
  setValue: (value: number) => void;
  setRangeValue: (value: number) => void;
  setCertName: (value: string) => void;
}

class PlantTreesContextProvider extends PureComponent<PlantTreesContextProps, PlantTreesContextState> implements BindMethods {
  state: Readonly<PlantTreesContextState> = {
    min: 0,
    max: 1000,
    step: 1,
    value: 0,
    valueForRange: 0,
    overallAmount: 0,
    singleTreePrice: 30000,
    insetValue: 0,
    achievements: {
      trees: 0,
      people: 0,
      o2Element: 0,
    },
    certName: "",
  };

  static logCount: number = 0;

  methods: BindItem[] = [
    { func: this.setValue, context: this },
    { func: this.setRangeValue, context: this },
  ];

  constructor(props: Readonly<PlantTreesContextProps>) {
    super(props);
    autoBindMethods(this);
  }

  render(): ReactNode {
    return (
      <PlantTreesContext.Provider value={{
        ...this.state,
        setValue: this.setValue,
        setRangeValue: this.setRangeValue,
        setCertName: this.setCertName,
      }}>
        {this.props.children}
      </PlantTreesContext.Provider>
    );
  }

  componentDidUpdate(_prevProps: Readonly<PlantTreesContextProps>, prevState: Readonly<PlantTreesContextState>): void {
    if (prevState.value !== this.state.value) {
      this.setInsetValue(this.state.value);
    }
  }

  setCertName = (value: string): void => {
    this.setState(prevState => ({
      ...prevState,
      certName: value,
    }));
  }

  setValue(value: number): void {
    this.setState(prevState => {
      const overallAmount: number = this.calculateOverallAmount(value);

      if (value > 1000) return;
      else if (value < 0) return;

      if (value <= 100) {
        return {
          ...prevState,
          value,
          valueForRange: value,
          overallAmount,
        };
      }

      return {
        ...prevState,
        value,
        overallAmount,
      };
    });
  }

  setInsetValue(value: number): void {
    this.setState(prevState => {
      let insetValue: number;

      if (value >= 100) insetValue = 100;
      else insetValue = (value / 100) * 100;

      return {
        ...prevState,
        insetValue,
      };
    });
  }

  setRangeValue(value: number): void {
    this.setState(prevState => ({
      ...prevState,
      value,
      valueForRange: value,
      overallAmount: this.calculateOverallAmount(value),
    }));
  }

  calculateOverallAmount(value: number): number {
    return Math.ceil(value * this.state.singleTreePrice);
  }
}

export default PlantTreesContextProvider;
