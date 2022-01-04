import { render } from "@testing-library/react";
import { Button } from ".";

describe("Button", () => {
  it("should render correctly", () => {
    const { asFragment } = render(<Button type="submit">Send</Button>);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render correctly with different type", () => {
    const { asFragment } = render(<Button type="button">Send</Button>);
    expect(asFragment()).toMatchSnapshot();
  });
});
