import React, { useReducer } from "react";
import { Routes, Route } from "react-router-dom";
import { Users } from "./routes/Users";
import { UserDetail } from "./routes/UserDetail";
import { CreateUser } from "./routes/CreateUser";
import { usersReducer } from "./state/users";
import type { User } from "./types";

// the initial state could by hydrated from server
const users: User[] = [
  { name: "Daniele", id: 1 },
  { name: "Travis", id: 2 },
];

function App() {
  const [usersState, dispatch] = useReducer(usersReducer, users);

  return (
    <Routes>
      <Route
        path="/"
        element={<Users state={{ data: usersState, dispatch }} />}
      />
      <Route
        path="/users/new"
        element={<CreateUser state={{ data: usersState, dispatch }} />}
      />
      <Route
        path="/users/:userId"
        element={<UserDetail state={{ data: usersState, dispatch }} />}
      />
      <Route
        path="*"
        element={
          <main style={{ padding: "1rem" }}>
            <p>There's nothing here!</p>
          </main>
        }
      />
    </Routes>
  );
}

export default App;
