import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Navbar />
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <Login onSuccess={() => setIsLoggedIn(true)} />
      )}
    </>
  );
}

export default App;
