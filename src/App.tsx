import React from "react";
import { Routes, Route } from "react-router-dom";
import { Users } from "./routes/Users";
import { UserDetail } from "./routes/UserDetail";
import { CreateUser } from "./routes/CreateUser";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Users />} />
      <Route path="/users/new" element={<CreateUser />} />
      <Route path="/users/:userId" element={<UserDetail />} />
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
