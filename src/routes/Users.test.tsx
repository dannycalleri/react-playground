import { render } from "@testing-library/react";
import { Users } from "./Users";

jest.mock("react-router-dom", () => {
  return {
    Link: (props: any) => {
      const { to, children } = props;
      return (
        <>
          <a href={to}>{children}</a>
        </>
      );
    },
  };
});

describe("Users route", () => {
  it("should render correctly", () => {
    const { asFragment } = render(
      <Users
        state={{ data: [{ id: 1, name: "Sandro" }], dispatch: jest.fn() }}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
