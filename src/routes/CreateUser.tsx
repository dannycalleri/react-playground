import React from "react";
import UsersApi from "../api/users";
import { Edit } from "../components/EditUser";
import { createUser } from "../state/users";
import type { StateProps } from "../types";

type Props = StateProps;

export function CreateUser(props: Props) {
  const { state } = props;

  async function save(name: string, friends: number[]) {
    // NOTE: I'm passing store.data down to the UsersApi because the current
    // implementation works in memory and I wanted to segregate
    // the majority of the implementation logic there
    const newUser = await UsersApi.createUser(state.data, name, friends);
    if (newUser) {
      state.dispatch(createUser(newUser.id, newUser.name, newUser.friends));
    }

    return newUser;
  }

  return <Edit title="New User" state={props.state} saveFunction={save} />;
}
