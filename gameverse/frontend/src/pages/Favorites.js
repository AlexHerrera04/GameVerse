import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import './Favorites.css';

const StarRating = ({ value, onChange, max = 10 }) => (
  <div className="inline-stars">
    {Array.from({ length: max }, (_, i) => i + 1).map(n => (
      <button key={n} type="button" className={`star-inline ${n <= value ? 'on' : ''}`} onClick={() => onChange(n)}>
        {n <= value ? '★' : '☆'}
      </button>
    ))}
    <span className="inline-stars-label">{value > 0 ? `${value}/10` : 'Sense puntuació'}</span>
  </div>
);

const FavoriteItem = ({ fav, onRemove, onRate }) => {
  const [showRate, setShowRate] = useState(false);

  const shareGame = () => {
    const url = `${window.location.origin}/game/${fav.game_id}`;
    navigator.clipboard?.writeText(url);
    alert(`Enllaç copiat!\n${url}`);
  };

  return (
    <div className="fav-item card">
      <Link to={`/game/${fav.game_id}`} className="fav-item-image-wrap">
        {fav.game_background_image ? (
          <img src={fav.game_background_image} alt={fav.game_name} className="fav-item-image" loading="lazy" />
        ) : (
          <div className="fav-item-no-image">🎮</div>
        )}
      </Link>

      <div className="fav-item-body">
        <div className="fav-item-header">
          <Link to={`/game/${fav.game_id}`} className="fav-item-title">{fav.game_name}</Link>
          <div className="fav-item-meta">
            {fav.game_released && <span className="fav-item-year">{fav.game_released.substring(0, 4)}</span>}
            {fav.game_rating > 0 && <span className="fav-item-rawg">⭐ {fav.game_rating.toFixed(1)} RAWG</span>}
          </div>
        </div>

        <div className="fav-item-rating">
          {showRate ? (
            <StarRating value={fav.user_rating || 0} onChange={r => { onRate(fav.game_id, r); setShowRate(false); }} />
          ) : (
            <div className="fav-rating-display">
              {fav.user_rating ? (
                <span className="user-rating-badge">La meva puntuació: {fav.user_rating}/10</span>
              ) : (
                <span className="no-rating">Sense puntuació</span>
              )}
              <button className="btn btn-secondary btn-sm" onClick={() => setShowRate(true)}>
                {fav.user_rating ? '✏️ Canviar' : '⭐ Puntuar'}
              </button>
            </div>
          )}
        </div>

        <div className="fav-item-actions">
          <button className="btn btn-secondary btn-sm" onClick={shareGame}>🔗 Compartir</button>
          <Link to={`/game/${fav.game_id}`} className="btn btn-secondary btn-sm">📖 Detalls</Link>
          <button className="btn btn-danger btn-sm" onClick={() => onRemove(fav.game_id)}>🗑️ Treure</button>
        </div>
      </div>
    </div>
  );
};

const Favorites = () => {
  const { user } = useAuth();
  const { favorites, removeFavorite, rateGame } = useFavorites();

  const shareList = () => {
    const url = `${window.location.origin}/profile/${user.username}`;
    navigator.clipboard?.writeText(url);
    alert(`Perfil compartit!\n${url}\n\nLa gent podrà veure la teva llista de favorits i reviews!`);
  };

  if (!user) return (
    <div className="favorites-page">
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">❤️</div>
          <h3>Inicia sessió per veure els teus favorits</h3>
          <Link to="/login" className="btn btn-primary">Iniciar sessió</Link>
        </div>
      </div>
    </div>
  );

  const avgRating = favorites.filter(f => f.user_rating).length > 0
    ? (favorites.filter(f => f.user_rating).reduce((s, f) => s + f.user_rating, 0) / favorites.filter(f => f.user_rating).length).toFixed(1)
    : null;

  return (
    <div className="favorites-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">❤️ Els meus favorits</h1>
            <p className="page-subtitle">{favorites.length} jocs guardats{avgRating ? ` • Puntuació mitjana: ${avgRating}/10` : ''}</p>
          </div>
          {favorites.length > 0 && (
            <button className="btn btn-secondary" onClick={shareList}>🔗 Compartir la meva llista</button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎮</div>
            <h3>Encara no tens favorits</h3>
            <p>Cerca jocs i afegeix-los a la teva col·lecció personal.</p>
            <Link to="/search" className="btn btn-primary">Cercar jocs</Link>
          </div>
        ) : (
          <div className="favorites-list">
            {favorites.map(fav => (
              <FavoriteItem
                key={fav.id}
                fav={fav}
                onRemove={removeFavorite}
                onRate={rateGame}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
