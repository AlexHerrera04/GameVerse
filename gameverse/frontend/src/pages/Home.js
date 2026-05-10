import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { gamesAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [trendRes, topRes] = await Promise.all([
          gamesAPI.getGames({ ordering: '-added', page_size: 6, page: 1 }),
          gamesAPI.getGames({ ordering: '-rating', page_size: 6, page: 1 }),
        ]);
        setTrending(trendRes.data.results);
        setTopRated(topRes.data.results);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-badge">🎮 La millor plataforma de videojocs</div>
          <h1 className="hero-title">
            Descobreix, Juga<br />
            <span className="hero-accent">Comparteix</span>
          </h1>
          <p className="hero-subtitle">
            Cerca entre milers de videojocs, llegeix i escriu reviews, gestiona els teus favorits i connecta amb la comunitat gamer.
          </p>
          <div className="hero-cta">
            <Link to="/search" className="btn btn-primary hero-btn">🔍 Cercar jocs</Link>
            <Link to="/register" className="btn btn-secondary hero-btn">Unir-se ara</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><span className="stat-num">500K+</span><span className="stat-label">Jocs</span></div>
            <div className="hero-stat"><span className="stat-num">∞</span><span className="stat-label">Reviews</span></div>
            <div className="hero-stat"><span className="stat-num">50+</span><span className="stat-label">Plataformes</span></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {[
              { icon: '🔍', title: 'Cerca avançada', desc: 'Filtra per plataforma, gènere, any i molt més', to: '/search' },
              { icon: '⭐', title: 'Reviews', desc: 'Llegeix i escriu opinions sobre qualsevol joc', to: '/reviews' },
              { icon: '❤️', title: 'Favorits', desc: 'Guarda i puntua els teus jocs preferits', to: '/favorites' },
              { icon: '🚀', title: 'Pròximament', desc: 'Descobreix els propers llançaments', to: '/upcoming' },
            ].map(f => (
              <Link to={f.to} key={f.title} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">🔥 Tendències</h2>
            <Link to="/search" className="section-link">Veure tots →</Link>
          </div>
          {loading ? (
            <div className="loading-container"><div className="spinner" /></div>
          ) : (
            <div className="games-grid">
              {trending.map(game => <GameCard key={game.id} game={game} />)}
            </div>
          )}
        </div>
      </section>

      {/* Top Rated */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">🏆 Millor valorats</h2>
            <Link to="/search?ordering=-rating" className="section-link">Veure tots →</Link>
          </div>
          {loading ? (
            <div className="loading-container"><div className="spinner" /></div>
          ) : (
            <div className="games-grid">
              {topRated.map(game => <GameCard key={game.id} game={game} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
