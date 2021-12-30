import React from "react";
import { useParams } from "react-router-dom";

export function UserDetail() {
  // TODO: check if possible to add types here
  const params = useParams();
  return (
    <>
      <h1>User {params.userId}</h1>
    </>
  );
}
