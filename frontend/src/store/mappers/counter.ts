import { decrement, decrementByAmount, increment, incrementByAmount } from "store/features/counterSlice";
import { RootState } from "store/Redux-store";

const mapStateToProps = (state: RootState) => ({
  value: state.counter.value,
});

const mapDispatchProps = {
  increment,
  decrement,
  incrementByAmount,
  decrementByAmount,
};

const counterMap = {
  mapStateToProps,
  mapDispatchProps,
};

export default counterMap;
