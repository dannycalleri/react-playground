import { render } from "@testing-library/react";
import { UsersList } from "./UsersList";

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

describe("UsersList", () => {
  it("should render correctly", () => {
    const { asFragment } = render(
      <UsersList
        users={[
          { id: 1, name: "Daniele" },
          { id: 2, name: "Sandro" },
        ]}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
