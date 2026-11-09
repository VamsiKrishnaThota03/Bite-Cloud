import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { apiRequest, errorMessage } from '../api';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const json = await apiRequest('/api/loginuser', { method: 'POST', body: credentials });
      if (!json || !json.success) {
        setError(errorMessage(json, 'Invalid email or password'));
      } else {
        localStorage.setItem('authToken', json.authToken);
        navigate('/');
      }
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onChange = (event) => setCredentials({ ...credentials, [event.target.name]: event.target.value });

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to start adding dishes to your cart.">
      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name="email" autoComplete="email" required value={credentials.email} onChange={onChange} />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" autoComplete="current-password" required value={credentials.password} onChange={onChange} />
        </div>
        <button type="submit" className="btn btn-success w-100 mb-3" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
        <p className="text-center small text-body-secondary mb-0">
          New here? <Link to="/createuser">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;
