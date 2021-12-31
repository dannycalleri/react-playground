import React, { useState } from "react";
import { UsersList } from "../components/UsersList";
import { Button } from "../ui";
import { createUser } from "../state/users";
import type { StateProps, User } from "../types";

type Props = StateProps;

function Create(props: Props) {
  const [name, setName] = useState("");
  const [friends, setFriends] = useState(new Set<number>());
  const [friendsVisible, setFriendsVisible] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handleSelectFriendClick = (e: React.MouseEvent) =>
    setFriendsVisible(true);

  const handleFriendToggle = (user: User) => {
    const newSet = new Set(friends);
    if (newSet.has(user.id)) {
      newSet.delete(user.id);
    } else {
      newSet.add(user.id);
    }

    setFriends(newSet);
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // TODO: checks on name (empty, etc)
    // if (name.trim() === "") {
    //   return;
    // }

    props.state.dispatch(createUser(name, Array.from(friends)));

    // reset fields
    setName("");
    setFriends(new Set());
  }

  return (
    <>
      <h1>New User</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" onChange={handleNameChange} value={name} />

        <div>
          <div>
            <Button onClick={handleSelectFriendClick} type="button">
              Select friend
            </Button>
            <Button type="button">New friend</Button>
          </div>

          {friendsVisible && (
            <UsersList
              users={props.state.data}
              render={(user) => (
                <>
                  {user.name}{" "}
                  <Button
                    type="button"
                    onClick={() => handleFriendToggle(user)}
                  >
                    {friends.has(user.id) ? "Remove" : "Add"}
                  </Button>
                </>
              )}
            />
          )}
        </div>

        <div>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </>
  );
}

export function CreateUser(props: Props) {
  return (
    <>
      <Create state={props.state} />
    </>
  );
}
