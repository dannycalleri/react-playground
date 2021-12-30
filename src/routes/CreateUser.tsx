import React, { useState } from "react";
import { UsersList } from "../components/UsersList";
import { Button } from "../ui";
import type { StateProps } from "../types";
import { createUser } from "../state/users";

type Props = StateProps;

function Create(props: Props) {
  const [name, setName] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    props.state.dispatch(createUser(name));
    // reset field
    setName("");
  }

  return (
    <>
      <h1>New User</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" onChange={handleNameChange} value={name} />

        <UsersList users={props.state.data} />

        <Button type="button">Select friend</Button>
        <Button type="button">New friend</Button>

        <div>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </>
  );
}

export function CreateUser(props: Props) {
  return (
    <>
      <Create state={props.state} />
    </>
  );
}
