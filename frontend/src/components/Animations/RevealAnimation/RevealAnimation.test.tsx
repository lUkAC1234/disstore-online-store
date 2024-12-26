import { render } from "@testing-library/react";
import RevealAnimation from "./RevealAnimation";

test('renders RevealAnimation component', () => {
  render(
    <RevealAnimation>
      <h1>Reveal Animation</h1>
    </RevealAnimation>
  );
});
