import React from "react";
import { Link } from "react-router-dom";
import { UsersList } from "../components/UsersList";
import type { StateProps } from "../types";

type Props = StateProps;

export function Users(props: Props) {
  const users = props.state.data;

  return (
    <>
      <h1>Users</h1>
      <Link to={`/users/new`}>New User</Link>
      <UsersList users={users} />
    </>
  );
}
