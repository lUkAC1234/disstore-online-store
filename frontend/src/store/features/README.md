# Slice Structure

Here is a brief structure of declaring and using slices, basic rules of initialization, best practices and so on:

```ts
import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
  value: number;
}

export interface CounterActions {
  increment: () => void;
  decrement: () => void;
  incrementByAmount: (value: number) => void;
  decrementByAmount: (value: number) => void;
}

export interface CounterProps extends CounterState, CounterActions {}

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    decrementByAmount: (state, action) => {
      state.value -= action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount, decrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
```

So, this was just a brief declaration technique of slices, definitely there are tons of ways of doing it better, this was just solid setup of the slice.
