import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserForm } from "./UserForm";

describe("UserForm", () => {
  it("should render correctly", () => {
    const { asFragment } = render(
      <UserForm
        title="This is a title"
        name="Daniele"
        friends={[]}
        state={{ data: [{ id: 1, name: "Sandro" }], dispatch: () => {} }}
        saveFunction={jest.fn()}
        openNewFriendWindow={jest.fn()}
        cleanUpFieldsOnSave={false}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  // NOTE: more granular tests could have been written here
  it("should behave correctly", async () => {
    const save = jest.fn();
    const open = jest.fn();

    render(
      <UserForm
        title="This is a title"
        name="Daniele"
        friends={[]}
        state={{ data: [{ id: 1, name: "Sandro" }], dispatch: () => {} }}
        saveFunction={save}
        openNewFriendWindow={open}
        cleanUpFieldsOnSave={false}
      />
    );

    expect(screen.getByRole("heading")).toHaveTextContent("This is a title");

    userEvent.click(screen.getByRole("button", { name: /select friend/i }));
    await screen.findByRole("list");

    expect(screen.getByRole("listitem")).toHaveTextContent("Sandro");

    userEvent.click(
      screen.getByRole("button", {
        name: /new friend/i,
      })
    );
    userEvent.click(
      screen.getByRole("button", {
        name: /save/i,
      })
    );
    expect(save).toHaveBeenCalled();
  });

  it("should show success message when saved correctly", async () => {
    const save = async () => {
      return { id: 1, name: "Daniele" };
    };
    const onSave = jest.fn();

    render(
      <UserForm
        title="This is a title"
        name="Daniele"
        friends={[]}
        state={{ data: [{ id: 1, name: "Sandro" }], dispatch: () => {} }}
        saveFunction={save}
        openNewFriendWindow={jest.fn()}
        onSave={onSave}
        cleanUpFieldsOnSave={false}
      />
    );

    userEvent.click(
      screen.getByRole("button", {
        name: /save/i,
      })
    );
    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });
    expect(
      screen.getByText(/operation completed successfully!/i)
    ).toBeDefined();
  });
});
