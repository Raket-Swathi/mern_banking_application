import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API = 'http://localhost:5000/api/auth';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        return setError(data.error || `Registration failed (status ${res.status})`);
      }
      alert('Registration successful, please login');
      navigate('/login');
    } catch (err) {
      console.error('REGISTER FETCH ERROR:', err);
      setError('Registration failed (network)');
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Register</h2>
      <p className="card-subtitle">Create an account to access your dashboard.</p>

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
          <label className="label">Email</label>
          <input
            className="input"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="jhon@gmail.com"
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
          Register
        </button>
      </form>

      <p className="text-muted" style={{ marginTop: 10 }}>
        Already have an account? <Link to="/login" className="link">Login</Link>
      </p>
    </div>
  );
};

export default Register;
