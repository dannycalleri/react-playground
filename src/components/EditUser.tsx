import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { UsersList } from "./UsersList";
import { Button } from "../ui";
import type { User, StateProps } from "../types";
import {
  EMPTY_USER_NAME,
  MAX_RETRIES_HIT,
  USER_ALREADY_EXISTS,
} from "../errors";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

import styles from "./EditUser.module.scss";

interface EditUserProps extends StateProps {
  name: string;
  friends: number[];
  openNewFriendWindow: () => void;
  saveFunction: (name: string, friends: number[]) => Promise<User>;
  title: string;
  saveOrAbort?: boolean;
  disabled?: boolean;
  onAbort?: () => void;
  onSave?: (id: number) => void;
  cleanUpFieldsOnSave: boolean;
}

function Loading() {
  return <>Loading...</>;
}

function EditUser(props: EditUserProps) {
  const {
    title,
    name: nameProp,
    friends: friendsProp,
    saveFunction,
    onSave,
    onAbort,
    openNewFriendWindow,
    disabled = false,
    saveOrAbort = false,
    cleanUpFieldsOnSave,
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
      const newUser = await saveFunction(name, friendsArray);

      if (cleanUpFieldsOnSave) {
        setName("");
        setFriends(new Set());
      }

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

  useEffect(() => {
    setName(nameProp);
  }, [nameProp]);

  const form = (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={isDisabled}>
        {saveOrAbort && (
          <div>
            <p>Save or Abort the current operation?</p>
            <Button type="submit">Save</Button>
            <Button onClick={() => onAbort?.()} type="button">
              Abort
            </Button>
          </div>
        )}

        {retry && (
          <>
            <p>Operation failed, please retry</p>
            <Button type="submit">Retry</Button>
          </>
        )}

        {!retry && (
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
      <h1>{title}</h1>
      {error && <p>Error: {error}. Please try again.</p>}
      {loading ? <Loading /> : form}
    </>
  );
}

interface EditProps extends StateProps {
  title: string;
  name?: string;
  friends?: number[];
  cleanUpFieldsOnSave?: boolean;
  mainWindowFunction: (name: string, friends: number[]) => Promise<User>;
  newUserFunction: (name: string, friends: number[]) => Promise<User>;
}

export function Edit(props: EditProps) {
  const {
    title,
    friends = [],
    name = "",
    cleanUpFieldsOnSave = true,
    mainWindowFunction,
    newUserFunction,
  } = props;
  const topmostWindowRef = useRef<HTMLDivElement>(null);
  const [saveOrAbort, setSaveOrAbort] = useState(false);
  const [windows, setWindows] = useState<{ friends: number[] }[]>([
    { friends: [] },
  ]);
  // const [numberOfWindows, setNumberOfWindows] = useState(1);
  // const [createdFriend, setCreatedFriend] = useState<number | undefined>(
  //   undefined
  // );

  function handleSave(id: number) {
    // TODO: feed the user id to the active (topmost) window so that it can be used as input for friends
    console.log(`id of the user just saved: ${id}`);

    setSaveOrAbort(false);

    // if (windows.length > 1) {
    //   setCreatedFriend(id);
    // } else {
    //   setCreatedFriend(undefined);
    // }

    if (windows.length > 1) {
      setNumberOfWindows(numberOfWindows - 1);
    }
  }

  function openNewFriendWindow() {
    setNumberOfWindows(numberOfWindows + 1);
  }

  function handleAbort() {
    setSaveOrAbort(false);
    setNumberOfWindows(numberOfWindows - 1);
  }

  useOnClickOutside(topmostWindowRef, () => {
    console.log("clicked outside");
    setSaveOrAbort(true);
  });

  return (
    <div className={styles["windows-container"]}>
      {Array(numberOfWindows)
        .fill(0)
        .map((_, i) => {
          const isWindowTopmost =
            numberOfWindows === 1 || i === numberOfWindows - 1;
          const isFirstWindow = i === 0;

          let newFriends: number[] = [...friends];
          if (createdFriend) {
            newFriends = [createdFriend, ...friends];
          }

          if (!isFirstWindow) {
            newFriends = [];
          }

          return (
            <div
              ref={
                isWindowTopmost && numberOfWindows > 1 ? topmostWindowRef : null
              }
              className={classNames(styles.window, {
                [styles.disabled]: !isWindowTopmost,
              })}
              key={i}
            >
              <EditUser
                title={isFirstWindow ? title : "New User"}
                cleanUpFieldsOnSave={cleanUpFieldsOnSave}
                saveFunction={
                  isFirstWindow ? mainWindowFunction : newUserFunction
                }
                name={isFirstWindow ? name : ""}
                friends={newFriends}
                disabled={!isWindowTopmost}
                onSave={handleSave}
                onAbort={handleAbort}
                openNewFriendWindow={openNewFriendWindow}
                saveOrAbort={
                  isWindowTopmost && numberOfWindows > 1 && saveOrAbort
                }
                state={props.state}
              />
            </div>
          );
        })}
    </div>
  );
}
