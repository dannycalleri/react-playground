import React from "react";
import { Link } from "react-router-dom";

interface User {
  name: string;
  id: number;
}

interface UsersListProps {
  users: User[];
}

export function UsersList(props: UsersListProps) {
  const { users } = props;
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <Link to={`/users/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  );
}