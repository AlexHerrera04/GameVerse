import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('La contrasenya ha de tenir com a mínim 6 caràcters'); return; }
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error en registrar-se');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="auth-logo">🎮</div>
          <h1 className="auth-title">Uneix-te a GameVerse</h1>
          <p className="auth-subtitle">Crea el teu compte gratuïtament</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom d'usuari</label>
            <input
              className="form-input"
              type="text"
              placeholder="el_teu_nick"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              minLength={3}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="el@teu.email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contrasenya</label>
            <input
              className="form-input"
              type="password"
              placeholder="Mínim 6 caràcters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? 'Creant compte...' : 'Crear compte'}
          </button>
        </form>

        <p className="auth-switch">
          Ja tens compte? <Link to="/login">Inicia sessió</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
