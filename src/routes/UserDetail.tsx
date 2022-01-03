import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UsersApi from "../api/users";
import { Edit } from "../components/EditUser";
import { GENERIC_ERROR } from "../errors";
import { createUser, editUser } from "../state/users";
import type { StateProps, User } from "../types";

type Props = StateProps;

export function UserDetail(props: Props) {
  const { state } = props;
  // TODO: check if possible to add types here
  const params = useParams();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [error, setError] = useState(false);

  async function create(name: string, friends: number[]) {
    // NOTE: I'm passing store.data down to the UsersApi because the current
    // implementation works in memory and I wanted to segregate
    // the majority of the implementation logic there
    const newUser = await UsersApi.createUser(state.data, name, friends);
    if (newUser) {
      state.dispatch(createUser(newUser.id, newUser.name, newUser.friends));
    }

    return newUser;
  }

  async function edit(name: string, friends: number[]) {
    if (!user) {
      throw new Error(GENERIC_ERROR);
    }

    const newUser = await UsersApi.editUser(state.data, user.id, name, friends);
    if (newUser) {
      state.dispatch(editUser(newUser.id, newUser.name, newUser.friends));
    }

    return newUser;
  }

  useEffect(() => {
    try {
      // NOTE: userId parameter will be available for sure, otherwise the route won't match
      const userId = parseInt(params.userId!!);
      const user = state.data.find((u) => u.id === userId);
      const userExists = Boolean(user);
      if (!userExists) {
        setError(true);
      } else {
        setUser(user);
      }
    } catch (error) {
      // TODO: show more specific error component here
      console.error(error);
      setError(true);
    }
  }, [params.userId, state.data]);

  const userIndex = state.data.findIndex((u) => u.id === user?.id);
  const users = [
    ...state.data.slice(0, userIndex),
    ...state.data.slice(userIndex + 1),
  ];

  return (
    <>
      {/* placholder reading from param */}
      {error && (
        <>
          <h1>User {params.userId}</h1>Some error occurred
        </>
      )}

      {!error && (
        <Edit
          title={`User ${params.userId}`}
          state={{
            dispatch: state.dispatch,
            data: users,
          }}
          name={user?.name}
          friends={user?.friends}
          newUserFunction={create}
          mainWindowFunction={edit}
          cleanUpFieldsOnSave={false}
        />
      )}
    </>
  );
}
