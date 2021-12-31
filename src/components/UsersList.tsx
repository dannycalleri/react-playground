import React from "react";
import { Link } from "react-router-dom";
import type { User } from "../types";

interface UsersListProps {
  users: User[];
  render?: (user: User) => React.ReactNode;
}

export function UsersList(props: UsersListProps) {
  const { users, render } = props;
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {render ? (
            render(user)
          ) : (
            <Link to={`/users/${user.id}`}>{user.name}</Link>
          )}
        </li>
      ))}
    </ul>
  );
}
