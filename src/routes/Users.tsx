import React from "react";
import { Link } from "react-router-dom";
import { UsersList } from "../components/UsersList";
import { users } from "../data/users";

export function Users() {
  return (
    <>
      <h1>Users</h1>
      <Link to={`/users/new`}>New User</Link>
      <UsersList users={users} />
    </>
  );
}
