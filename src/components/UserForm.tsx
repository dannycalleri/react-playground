import React, { useEffect, useState } from "react";
import { UsersList } from "./UsersList";
import { Button } from "../ui";
import { Loading } from "../ui";
import { User, StateProps } from "../types";
import {
  EMPTY_USER_NAME,
  MAX_RETRIES_HIT,
  USER_ALREADY_EXISTS,
} from "../errors";

interface UserFormProps extends StateProps {
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

export function UserForm(props: UserFormProps) {
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
  const [success, setSuccess] = useState(false);
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
    setSuccess(false);

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
      setSuccess(true);
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
      setSuccess(false);
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
      {success && <p>Operation completed successfully!</p>}
      {error && <p>Error: {error}. Please try again.</p>}
      {loading ? <Loading /> : form}
    </>
  );
}
