import React, { useState } from "react";
import { UsersList } from "../components/UsersList";
import { Button } from "../ui";
import { createUser } from "../state/users";
import UsersApi from "../api/users";
import type { StateProps, User } from "../types";
import {
  EMPTY_USER_NAME,
  MAX_RETRIES_HIT,
  USER_ALREADY_EXISTS,
} from "../errors";

type Props = StateProps;

function Loading() {
  return <>Loading...</>;
}

function Create(props: Props) {
  const { state } = props;
  const [error, setError] = useState<string | undefined>(undefined);
  const [retry, setRetry] = useState(false);
  const [loading, setLoading] = useState(false);
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);
    setRetry(false);
    setLoading(true);

    try {
      if (name.trim() === "") {
        throw new Error(EMPTY_USER_NAME);
      }

      const userExists = Boolean(state.data.find((u) => u.name === name));
      if (userExists) {
        throw new Error(USER_ALREADY_EXISTS);
      }

      const friendsArray = Array.from(friends);
      await UsersApi.createUser(name, friendsArray);
      state.dispatch(createUser(name, friendsArray));

      // reset fields
      setName("");
      setFriends(new Set());
    } catch (error) {
      console.error(error);
      const message = (error as Error).message;
      console.error(message);
      if (message === MAX_RETRIES_HIT) {
        setRetry(true);
      } else if (message === USER_ALREADY_EXISTS) {
        setError("User already exists");
      } else {
        setError("Generic error");
      }
    } finally {
      setLoading(false);
    }
  }

  const form = (
    <form onSubmit={handleSubmit}>
      {retry ? (
        <>
          <p>Please retry</p>
          <Button type="submit">Retry</Button>
        </>
      ) : (
        <>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            onChange={handleNameChange}
            value={name}
          />
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
          </div>{" "}
        </>
      )}
    </form>
  );

  return (
    <>
      <h1>New User</h1>
      {error && <p>Error: {error}. Please try again.</p>}
      {loading ? <Loading /> : form}
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
