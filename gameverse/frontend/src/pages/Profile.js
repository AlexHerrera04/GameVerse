import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import ReviewCard from '../components/ReviewCard';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reviews');

  useEffect(() => {
    authAPI.getPublicProfile(username)
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [username]);

  const shareProfile = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert('Enllaç de perfil copiat!');
  };

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  if (!data) {
    return (
      <div className="loading-container">
        <div className="empty-state">
          <div className="empty-state-icon">USR</div>
          <h3>Usuari no trobat</h3>
          <Link to="/" className="btn btn-primary">Tornar a l'inici</Link>
        </div>
      </div>
    );
  }

  const { user, reviews, favorites } = data;
  const avgRating = favorites.filter(f => f.user_rating).length > 0
    ? (favorites.filter(f => f.user_rating).reduce((s, f) => s + f.user_rating, 0) / favorites.filter(f => f.user_rating).length).toFixed(1)
    : null;

  const joinDate = new Date(user.created_at).toLocaleDateString('ca-ES', {
    year: 'numeric',
    month: 'long'
  });

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="container">
          <div className="profile-hero-inner">
            <div className="profile-avatar-big">{user.username[0].toUpperCase()}</div>

            <div className="profile-hero-info">
              <h1 className="profile-username">{user.username}</h1>
              {user.bio && <p className="profile-bio">{user.bio}</p>}

              <div className="profile-meta">
                <span>Membre des de {joinDate}</span>
                <span>{reviews.length} reviews</span>
                <span>{favorites.length} favorits</span>
                {avgRating && <span>Puntuació mitjana: {avgRating}/5</span>}
              </div>
            </div>

            <button className="btn btn-secondary" onClick={shareProfile}>
              Compartir perfil
            </button>
          </div>
        </div>
      </div>

      <div className="container profile-body">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviews.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorits ({favorites.length})
          </button>
        </div>

        {activeTab === 'reviews' && (
          reviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">REV</div>
              <h3>Sense reviews encara</h3>
            </div>
          ) : (
            <div className="reviews-grid">
              {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
            </div>
          )
        )}

        {activeTab === 'favorites' && (
          favorites.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">JOC</div>
              <h3>Sense favorits</h3>
            </div>
          ) : (
            <div className="profile-favorites-grid">
              {favorites.map(f => (
                <Link key={f.id} to={`/game/${f.game_id}`} className="profile-fav-card card">
                  {f.game_background_image ? (
                    <img
                      src={f.game_background_image}
                      alt={f.game_name}
                      className="profile-fav-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="profile-fav-no-img">Sense imatge</div>
                  )}

                  <div className="profile-fav-info">
                    <span className="profile-fav-name">{f.game_name}</span>
                    {f.user_rating && <span className="profile-fav-rating">{f.user_rating}/5</span>}
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Profile;