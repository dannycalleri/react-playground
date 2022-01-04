import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserFormManager } from "./UserFormManager";

describe("UserFormManager", () => {
  it("should render correctly", () => {
    const { asFragment } = render(
      <UserFormManager
        title="This is a title"
        mainWindowFunction={jest.fn()}
        newUserFunction={jest.fn()}
        state={{ data: [{ id: 1, name: "Sandro" }], dispatch: jest.fn() }}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("should open a new window correctly", () => {
    const mainWindowFunction = jest.fn();
    const newUserFunction = jest.fn();
    const dispatch = jest.fn();
    render(
      <UserFormManager
        title="This is a title"
        mainWindowFunction={mainWindowFunction}
        newUserFunction={newUserFunction}
        state={{ data: [{ id: 1, name: "Sandro" }], dispatch: dispatch }}
      />
    );

    userEvent.click(
      screen.getByRole("button", {
        name: /new friend/i,
      })
    );

    expect(screen.getAllByRole("dialog")).toHaveLength(2);
  });

  it("should ask user to save or abort when clicking outside the dialog", () => {
    const mainWindowFunction = jest.fn();
    const newUserFunction = jest.fn();
    const dispatch = jest.fn();
    render(
      <UserFormManager
        title="This is a title"
        mainWindowFunction={mainWindowFunction}
        newUserFunction={newUserFunction}
        state={{ data: [{ id: 1, name: "Sandro" }], dispatch: dispatch }}
      />
    );

    userEvent.click(
      screen.getByRole("button", {
        name: /new friend/i,
      })
    );
    userEvent.click(screen.getAllByRole("dialog")[0]);

    expect(
      screen.getByText(/save or abort the current operation\?/i)
    ).toBeDefined();
  });
});
