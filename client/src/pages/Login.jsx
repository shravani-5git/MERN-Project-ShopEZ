import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in');
    }
  }

  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <div className="auth-badge mb-3">S</div>
        <h2 className="mb-2">Welcome back.</h2>
        <p className="muted mb-4">Sign in to manage your bag and orders.</p>
        {error && <div className="alert alert-danger border-0 rounded-3">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-brand w-100" type="submit">Sign in</button>
        </form>
        <p className="text-center mt-4 mb-0 muted">
          New here? <Link to="/register" className="fw-bold text-decoration-none">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
