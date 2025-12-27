import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="card" style={{ maxWidth: 520 }}>
      <h1 className="card-title">Welcome to Secure Banking</h1>
      <p className="card-subtitle">
        A simple demo where you can register, login, and manage your own account balance.
      </p>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <Link to="/register">
          <button className="btn btn-primary">Register</button>
        </Link>
        <Link to="/login">
          <button className="btn btn-secondary">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
