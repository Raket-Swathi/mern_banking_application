import React, { useState } from "react";
import axios from "axios";

const BASE_URL = "https://banking-backend-xtvz.onrender.com";

function Login({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        username,
        password,
      });

      alert("Login successful");
      onSuccess();
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <div className="card p-4 shadow">
        <h4 className="text-center mb-3">Login</h4>

        <input
          className="form-control mb-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-primary w-100" onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
