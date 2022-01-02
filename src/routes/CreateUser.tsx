import React, { useEffect, useState } from "react";
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

interface CreateProps {
  friends: number[];
  openNewFriendWindow: () => void;
  disabled?: boolean;
  onSave?: (id: number) => void;
}

type Props = CreateProps & StateProps;

function Loading() {
  return <>Loading...</>;
}

function Create(props: Props) {
  const {
    state,
    friends: friendsProp,
    onSave,
    openNewFriendWindow,
    disabled = false,
  } = props;
  const [isDisabled, setDisabled] = useState(disabled);
  const [error, setError] = useState<string | undefined>(undefined);
  const [retry, setRetry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [friends, setFriends] = useState(new Set<number>(friendsProp));
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

      const friendsArray = Array.from(friends);

      // NOTE: I'm passing store.data down to the UsersApi because the current
      // implementation works in memory and I wanted to segregate
      // the majority of the implementation logic there
      const newUser = await UsersApi.createUser(state.data, name, friendsArray);
      if (newUser) {
        state.dispatch(createUser(newUser.id, newUser.name, newUser.friends));
      }

      // reset fields
      setName("");
      setFriends(new Set());
      setLoading(false);
      onSave?.(newUser.id);
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

      setLoading(false);
    }
  }

  useEffect(() => {
    setDisabled(disabled);
  }, [disabled]);

  useEffect(() => {
    setFriends(new Set(friendsProp));
  }, [friendsProp]);

  const form = (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={isDisabled}>
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
                <Button onClick={openNewFriendWindow} type="button">
                  New friend
                </Button>
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
      </fieldset>
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

export function CreateUser(props: StateProps) {
  const [numberOfWindows, setNumberOfWindows] = useState(1);
  const [createdFriend, setCreatedFriend] = useState<number | undefined>(
    undefined
  );

  function handleSave(id: number) {
    // TODO: feed the user id to the active (topmost) window so that it can be used as input for friends
    console.log(`id of the user just saved: ${id}`);

    if (numberOfWindows > 1) {
      setCreatedFriend(id);
    } else {
      setCreatedFriend(undefined);
    }

    if (numberOfWindows > 1) {
      setNumberOfWindows(numberOfWindows - 1);
    }
  }

  function openNewFriendWindow() {
    setNumberOfWindows(numberOfWindows + 1);
  }

  return (
    <>
      {Array(numberOfWindows)
        .fill(0)
        .map((_, i) => {
          const isWindowTopmost =
            numberOfWindows === 1 || i === numberOfWindows - 1;

          return (
            <Create
              key={i}
              friends={createdFriend ? [createdFriend] : []}
              disabled={!isWindowTopmost}
              onSave={handleSave}
              openNewFriendWindow={openNewFriendWindow}
              state={props.state}
            />
          );
        })}
    </>
  );
}
