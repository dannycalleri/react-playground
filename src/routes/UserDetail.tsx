import React from "react";
import { useParams } from "react-router-dom";
import type { StateProps } from "../types";

type Props = StateProps;

export function UserDetail(props: Props) {
  // TODO: check if possible to add types here
  const params = useParams();

  // TODO: check if the user actually exists

  return (
    <>
      {/* placholder reading from param */}
      <h1>User {params.userId}</h1>
    </>
  );
}
