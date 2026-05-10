import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/search', label: '🔍 Cerca' },
    { to: '/platforms', label: '🖥️ Plataformes' },
    { to: '/upcoming', label: '🚀 Pròximament' },
    { to: '/reviews', label: '⭐ Reviews' },
  ];

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-icon">🎮</span>
          <span className="brand-text">GameVerse</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          {user && (
            <NavLink to="/favorites" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              ❤️ Favorits
            </NavLink>
          )}

          <div className="navbar-auth">
            {user ? (
              <div className="user-menu">
                <Link to={`/profile/${user.username}`} className="user-avatar-link" onClick={() => setMenuOpen(false)}>
                  <div className="user-avatar">{user.username[0].toUpperCase()}</div>
                  <span className="user-name">{user.username}</span>
                </Link>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Sortir</button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>Entrar</Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Registrar-se</Link>
              </div>
            )}
          </div>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
