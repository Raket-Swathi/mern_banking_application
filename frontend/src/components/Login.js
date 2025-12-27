import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API = 'http://localhost:5000/api/auth';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        return setError(data.error || 'Login failed');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      console.error('LOGIN ERROR:', err);
      setError('Login failed (network)');
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Login</h2>
      <p className="card-subtitle">Enter your details to continue.</p>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="label">Username</label>
          <input
            className="input"
            name="username"
            value={form.username}
            onChange={onChange}
            placeholder="jhon"
          />
        </div>
        <div className="form-group">
          <label className="label">Password</label>
          <input
            className="input"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="********"
          />
        </div>

        {error && <p className="text-error">{error}</p>}

        <button type="submit" className="btn btn-primary" style={{ marginTop: 6 }}>
          Login
        </button>
      </form>

      <p className="text-muted" style={{ marginTop: 10 }}>
        New user? <Link to="/register" className="link">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
