import { render } from "@testing-library/react";
import DateComputed from "./DateComputed";

test('renders DateComputed component', () => {
  render(<DateComputed date={new Date()} />);
});
