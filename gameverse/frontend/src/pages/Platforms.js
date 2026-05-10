import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gamesAPI } from '../services/api';
import './Platforms.css';

const platformIcons = {
  'PC': '🖥️', 'PlayStation': '🎮', 'Xbox': '🟢', 'Nintendo': '🔴',
  'iOS': '📱', 'Android': '📱', 'macOS': '🍎', 'Linux': '🐧',
  'Atari': '👾', 'Sega': '🎯', 'Commodore': '💾',
};

const getPlatformIcon = (name) => {
  for (const [key, icon] of Object.entries(platformIcons)) {
    if (name.includes(key)) return icon;
  }
  return '🕹️';
};

const Platforms = () => {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gamesAPI.getPlatforms()
      .then(res => setPlatforms(res.data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div className="platforms-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">🖥️ Plataformes</h1>
          <p className="page-subtitle">Explora jocs per plataforma de joc</p>
        </div>

        <div className="platforms-grid">
          {platforms.map(p => (
            <Link key={p.id} to={`/search?platform=${p.id}`} className="platform-card card">
              <div className="platform-icon-big">{getPlatformIcon(p.name)}</div>
              <div className="platform-info">
                <h3 className="platform-name">{p.name}</h3>
                {p.games_count > 0 && (
                  <span className="platform-count">{p.games_count.toLocaleString()} jocs</span>
                )}
                {p.year_start && <span className="platform-year">Des de {p.year_start}</span>}
              </div>
              <div className="platform-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Platforms;
