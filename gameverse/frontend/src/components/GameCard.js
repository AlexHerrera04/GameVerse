import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import './GameCard.css';

const platformIcons = {
  'PC': 'PC',
  'PlayStation': 'PS',
  'Xbox': 'XB',
  'Nintendo Switch': 'NS',
  'iOS': 'iOS',
  'Android': 'AND',
  'macOS': 'MAC',
  'Linux': 'LNX',
};

const getPlatformIcon = (name) => {
  for (const [key, icon] of Object.entries(platformIcons)) {
    if (name.includes(key)) return icon;
  }
  return 'PLT';
};

const GameCard = ({ game }) => {
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const fav = isFavorite(game.id);

  const handleFav = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert('Inicia sessió per afegir favorits');
    try {
      if (fav) await removeFavorite(game.id);
      else await addFavorite(game);
    } catch {}
  };

  const rating = game.rating ? game.rating.toFixed(1) : '—';
  const ratingColor = game.rating >= 4 ? '#22c55e' : game.rating >= 3 ? '#f59e0b' : '#ef4444';

  return (
    <Link to={`/game/${game.id}`} className="game-card card">
      <div className="game-card-image-wrap">
        {game.background_image ? (
          <img src={game.background_image} alt={game.name} className="game-card-image" loading="lazy" />
        ) : (
          <div className="game-card-no-image">Sense imatge</div>
        )}

        <button
          className={`fav-btn ${fav ? 'active' : ''}`}
          onClick={handleFav}
          title={fav ? 'Treure de favorits' : 'Afegir a favorits'}
        >
          {fav ? 'OK' : '+'}
        </button>

        {game.metacritic && (
          <span className="metacritic-badge">{game.metacritic}</span>
        )}
      </div>

      <div className="game-card-body">
        <h3 className="game-card-title">{game.name}</h3>

        <div className="game-card-meta">
          {game.released && (
            <span className="game-card-date">{game.released.substring(0, 4)}</span>
          )}
          <div className="game-card-rating" style={{ color: ratingColor }}>
            {rating}
          </div>
        </div>

        {game.platforms && game.platforms.length > 0 && (
          <div className="game-card-platforms">
            {game.platforms.slice(0, 4).map(({ platform }) => (
              <span key={platform.id} className="platform-icon" title={platform.name}>
                {getPlatformIcon(platform.name)}
              </span>
            ))}
            {game.platforms.length > 4 && (
              <span className="platform-more">+{game.platforms.length - 4}</span>
            )}
          </div>
        )}

        {game.genres && game.genres.length > 0 && (
          <div className="game-card-genres">
            {game.genres.slice(0, 2).map(g => (
              <span key={g.id} className="genre-tag">{g.name}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default GameCard;