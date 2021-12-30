import React from "react";
import { UsersList } from "../components/UsersList";
import { users } from "../data/users";
import { Button } from "../ui";

export function CreateUser() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("trying to send form");
  }

  return (
    <>
      <h1>New User</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" />

        <UsersList users={users} />

        <Button type="button">Select friend</Button>
        <Button type="button">New friend</Button>

        <div>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </>
  );
}
