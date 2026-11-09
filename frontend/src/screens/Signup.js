import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { apiRequest, errorMessage } from '../api';

const Signup = () => {
  const [credentials, setCredentials] = useState({ name: '', email: '', password: '', location: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const json = await apiRequest('/api/createUser', { method: 'POST', body: credentials });
      if (!json || !json.success) {
        setError(errorMessage(json));
      } else {
        navigate('/login');
      }
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onChange = (event) => setCredentials({ ...credentials, [event.target.name]: event.target.value });

  return (
    <AuthLayout title="Create your account" subtitle="It takes less than a minute.">
      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" autoComplete="name" required value={credentials.name} onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name="email" autoComplete="email" aria-describedby="emailHelp" required value={credentials.email} onChange={onChange} />
          <div id="emailHelp" className="form-text">We&apos;ll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" autoComplete="new-password" aria-describedby="passwordHelp" required minLength={5} value={credentials.password} onChange={onChange} />
          <div id="passwordHelp" className="form-text">At least 5 characters.</div>
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="form-label">Delivery address</label>
          <input type="text" className="form-control" id="location" name="location" autoComplete="street-address" required value={credentials.location} onChange={onChange} />
        </div>
        <button type="submit" className="btn btn-success w-100 mb-3" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Sign up'}
        </button>
        <p className="text-center small text-body-secondary mb-0">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
