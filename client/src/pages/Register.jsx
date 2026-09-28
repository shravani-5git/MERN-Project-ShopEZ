import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account');
    }
  }

  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <div className="auth-badge mb-3">+</div>
        <h2 className="mb-2">Create your account.</h2>
        <p className="muted mb-4">Save your orders and check out faster next time.</p>
        {error && <div className="alert alert-danger border-0 rounded-3">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full name</label>
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-brand w-100" type="submit">Create account</button>
        </form>
        <p className="text-center mt-4 mb-0 muted">
          Already registered? <Link to="/login" className="fw-bold text-decoration-none">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
