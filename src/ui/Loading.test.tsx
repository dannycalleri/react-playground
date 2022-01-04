import { render } from "@testing-library/react";
import { Loading } from ".";

describe("Loading", () => {
  it("should render correctly", () => {
    const { asFragment } = render(<Loading />);
    expect(asFragment()).toMatchSnapshot();
  });
});
