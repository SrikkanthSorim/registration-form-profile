import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', dob: '', image: null });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!form.name || !form.email || !form.password || !form.dob || !form.image) {
      setError('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('password', form.password);
    formData.append('dob', form.dob);
    formData.append('image', form.image);

    try {
      setLoading(true);
      await api.post('/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Registration successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Create Account</h1>
        <p className="subtitle">Register to create your profile.</p>

        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Enter name" />

          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter email" />

          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter password" />

          <label>Date of Birth</label>
          <input name="dob" type="date" value={form.dob} onChange={handleChange} />

          <label>Profile Image</label>
          <input name="image" type="file" accept="image/*" onChange={handleChange} />

          <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        </form>

        <p className="footer-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
