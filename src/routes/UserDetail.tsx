import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UsersApi from "../api/users";
import { Edit } from "../components/EditUser";
import { GENERIC_ERROR } from "../errors";
import { editUser } from "../state/users";
import type { StateProps, User } from "../types";

type Props = StateProps;

export function UserDetail(props: Props) {
  const { state } = props;
  // TODO: check if possible to add types here
  const params = useParams();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [error, setError] = useState(false);

  async function save(name: string, friends: number[]) {
    console.log("editing");
    console.log(name, friends);

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
      }

      setUser(user);
    } catch (error) {
      // TODO: show more specific error component here
      console.error(error);
      setError(true);
    }
  }, [params.userId, state.data]);

  console.log(user);

  return (
    <>
      {/* placholder reading from param */}
      <h1>User {params.userId}</h1>
      {error && <>Some error occurred</>}

      <Edit
        state={state}
        name={user?.name}
        friends={user?.friends}
        saveFunction={save}
        cleanUpFieldsOnSave={false}
      />
    </>
  );
}
