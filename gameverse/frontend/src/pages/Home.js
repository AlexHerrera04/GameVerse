import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { useAuth } from '../context/AuthContext';
import { gamesAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const { user, loading: authLoading } = useAuth();
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
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-badge">La millor plataforma de videojocs</div>

          <h1 className="hero-title">
            Descobreix, Juga
            <br />
            <span className="hero-accent">Comparteix</span>
          </h1>

          <p className="hero-subtitle">
            Cerca entre milers de videojocs, llegeix i escriu reviews, gestiona els teus favorits i connecta amb la comunitat gamer.
          </p>

          <div className="hero-cta">
            <Link to="/search" className="btn btn-primary hero-btn">Cercar jocs</Link>
            {!authLoading && !user && (
              <Link to="/register" className="btn btn-secondary hero-btn">Unir-se ara</Link>
            )}
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-num">900K+</span>
              <span className="stat-label">Jocs</span>
            </div>
            <div className="hero-stat">
              <span className="stat-num">∞</span>
              <span className="stat-label">Reviews</span>
            </div>
            <div className="hero-stat">
              <span className="stat-num">50+</span>
              <span className="stat-label">Plataformes</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Tendències</h2>
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

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Millor valorats</h2>
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