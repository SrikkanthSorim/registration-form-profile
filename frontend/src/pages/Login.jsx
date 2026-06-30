import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/login', form);
      localStorage.setItem('userEmail', form.email);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Login</h1>
        <p className="subtitle">Login to view your profile.</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter email" />

          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter password" />

          <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>

        <p className="footer-text">
          New user? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
