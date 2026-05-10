import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gamesAPI, reviewsAPI } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import ReviewCard from '../components/ReviewCard';
import './GameDetail.css';

const StarRating = ({ value, onChange, max = 5 }) => (
  <div className="star-rating-row">
    {Array.from({ length: max }, (_, i) => i + 1).map(n => (
      <button
        key={n}
        type="button"
        className={`star-btn ${n <= value ? 'active' : ''}`}
        onClick={() => onChange(n)}
      >
        {n <= value ? '★' : '☆'}
      </button>
    ))}
    <span className="star-label">{value}/5</span>
  </div>
);

const GameDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite, rateGame, favorites } = useFavorites();

  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(7);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [showAllDesc, setShowAllDesc] = useState(false);

  const fav = isFavorite(parseInt(id));
  const favData = favorites.find(f => f.game_id === parseInt(id));

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [gameRes, reviewsRes] = await Promise.all([
          gamesAPI.getGameDetail(id),
          reviewsAPI.getByGame(id),
        ]);
        setGame(gameRes.data);
        setReviews(reviewsRes.data);
      } catch {}
      setLoading(false);
    };
    load();
  }, [id]);

  const handleFav = async () => {
    if (!user) return alert('Inicia sessió per afegir favorits');
    if (fav) await removeFavorite(parseInt(id));
    else await addFavorite(game);
  };

  const handleRate = async (rating) => {
    if (!fav) {
      alert('Afegeix el joc a favorits primer!');
      return;
    }
    await rateGame(parseInt(id), rating);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewTitle || !reviewContent) return;
    setSubmitting(true);
    try {
      const res = await reviewsAPI.create({
        game_id: game.id,
        game_name: game.name,
        game_slug: game.slug,
        game_background_image: game.background_image,
        title: reviewTitle,
        content: reviewContent,
        rating: reviewRating,
      });
      setReviews(prev => [res.data, ...prev]);
      setReviewTitle('');
      setReviewContent('');
      setReviewRating(7);
      setShowReviewForm(false);
    } catch {} finally {
      setSubmitting(false);
    }
  };

  const shareProfile = () => {
    const url = `${window.location.origin}/profile/${user?.username}`;
    navigator.clipboard?.writeText(url);
    alert(`Enllaç copiat: ${url}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <span>Carregant...</span>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="loading-container">
        <p>Joc no trobat</p>
      </div>
    );
  }

  const desc = game.description_raw || '';
  const shortDesc = desc.substring(0, 500);

  return (
    <div className="game-detail">
      <div
        className="game-hero"
        style={{ backgroundImage: game.background_image ? `url(${game.background_image})` : 'none' }}
      >
        <div className="game-hero-overlay" />
        <div className="container game-hero-content">
          <div className="game-hero-badges">
            {game.genres?.slice(0, 3).map(g => (
              <span
                key={g.id}
                className="badge"
                style={{
                  background: 'rgba(124,58,237,0.2)',
                  color: '#a855f7',
                  border: '1px solid rgba(124,58,237,0.3)'
                }}
              >
                {g.name}
              </span>
            ))}
          </div>

          <h1 className="game-hero-title">{game.name}</h1>

          <div className="game-hero-meta">
            {game.rating > 0 && <span className="game-hero-rating">{game.rating.toFixed(1)}</span>}
            {game.metacritic && <span className="metacritic-score">{game.metacritic} Metacritic</span>}
            {game.released && (
              <span className="game-released">
                {new Date(game.released).toLocaleDateString('ca-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>

          <div className="game-hero-actions">
            <button className={`btn ${fav ? 'btn-danger' : 'btn-primary'}`} onClick={handleFav}>
              {fav ? 'Treure de favorits' : 'Afegir a favorits'}
            </button>

            {user && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowReviewForm(!showReviewForm);
                  setActiveTab('reviews');
                }}
              >
                Escriure review
              </button>
            )}

            {user && (
              <button className="btn btn-secondary" onClick={shareProfile}>
                Compartir perfil
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container game-detail-body">
        <aside className="game-sidebar">
          {fav && (
            <div className="sidebar-card">
              <h3 className="sidebar-title">La meva puntuació</h3>
              <StarRating value={favData?.user_rating || 0} onChange={handleRate} />
            </div>
          )}

          <div className="sidebar-card">
            <h3 className="sidebar-title">Informació</h3>
            <dl className="info-list">
              {game.released && (
                <>
                  <dt>Llançament</dt>
                  <dd>{game.released}</dd>
                </>
              )}
              {game.playtime > 0 && (
                <>
                  <dt>Durada</dt>
                  <dd>{game.playtime}h avg</dd>
                </>
              )}
              {game.developers?.length > 0 && (
                <>
                  <dt>Desenvolupador</dt>
                  <dd>{game.developers.map(d => d.name).join(', ')}</dd>
                </>
              )}
              {game.publishers?.length > 0 && (
                <>
                  <dt>Publisher</dt>
                  <dd>{game.publishers.map(p => p.name).join(', ')}</dd>
                </>
              )}
              {game.esrb_rating && (
                <>
                  <dt>ESRB</dt>
                  <dd>{game.esrb_rating.name}</dd>
                </>
              )}
              {game.ratings_count > 0 && (
                <>
                  <dt>Valoracions</dt>
                  <dd>{game.ratings_count.toLocaleString()}</dd>
                </>
              )}
            </dl>
          </div>

          {game.platforms?.length > 0 && (
            <div className="sidebar-card">
              <h3 className="sidebar-title">Plataformes</h3>
              <div className="sidebar-platforms">
                {game.platforms.map(({ platform }) => (
                  <span key={platform.id} className="platform-chip">{platform.name}</span>
                ))}
              </div>
            </div>
          )}

          {game.tags?.length > 0 && (
            <div className="sidebar-card">
              <h3 className="sidebar-title">Etiquetes</h3>
              <div className="sidebar-tags">
                {game.tags.slice(0, 15).map(t => (
                  <span key={t.id} className="tag-chip">{t.name}</span>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="game-main">
          <div className="tabs">
            {['about', 'screenshots', 'reviews'].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {{
                  about: 'Sobre',
                  screenshots: 'Captures',
                  reviews: `Reviews (${reviews.length})`
                }[tab]}
              </button>
            ))}
          </div>

          {activeTab === 'about' && (
            <div className="tab-content">
              {desc && (
                <div className="game-description">
                  <p>
                    {showAllDesc ? desc : shortDesc}
                    {!showAllDesc && desc.length > 500 && '...'}
                  </p>

                  {desc.length > 500 && (
                    <button
                      className="btn btn-secondary btn-sm show-more-btn"
                      onClick={() => setShowAllDesc(!showAllDesc)}
                    >
                      {showAllDesc ? 'Menys ↑' : 'Llegir més ↓'}
                    </button>
                  )}
                </div>
              )}

              {game.ratings?.length > 0 && (
                <div className="rating-breakdown">
                  <h3 className="section-subtitle">Distribució de puntuacions</h3>
                  {game.ratings.map(r => (
                    <div key={r.id} className="rating-bar-row">
                      <span className="rating-bar-label">{r.title}</span>
                      <div className="rating-bar-track">
                        <div
                          className="rating-bar-fill"
                          style={{
                            width: `${r.percent}%`,
                            background: r.id === 5 ? '#22c55e' : r.id === 4 ? '#06b6d4' : r.id === 3 ? '#f59e0b' : '#ef4444'
                          }}
                        />
                      </div>
                      <span className="rating-bar-pct">{r.percent.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'screenshots' && (
            <div className="tab-content">
              {game.screenshots?.length > 0 ? (
                <div className="screenshots-grid">
                  {game.screenshots.map(s => (
                    <a key={s.id} href={s.image} target="_blank" rel="noreferrer">
                      <img src={s.image} alt="Screenshot" className="screenshot-img" loading="lazy" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">IMG</div>
                  <h3>No hi ha captures</h3>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="tab-content">
              {showReviewForm && user && (
                <form className="review-form" onSubmit={handleReviewSubmit}>
                  <h3 className="review-form-title">Nova review</h3>

                  <div className="form-group">
                    <label className="form-label">Títol</label>
                    <input
                      className="form-input"
                      value={reviewTitle}
                      onChange={e => setReviewTitle(e.target.value)}
                      placeholder="Un títol descriptiu"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Puntuació: {reviewRating}/10</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={reviewRating}
                      onChange={e => setReviewRating(parseInt(e.target.value))}
                      className="rating-slider"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Opinió</label>
                    <textarea
                      className="form-textarea"
                      value={reviewContent}
                      onChange={e => setReviewContent(e.target.value)}
                      placeholder="Comparteix la teva experiència..."
                      rows={5}
                      required
                    />
                  </div>

                  <div className="review-form-actions">
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? 'Publicant...' : 'Publicar review'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowReviewForm(false)}>
                      Cancel·lar
                    </button>
                  </div>
                </form>
              )}

              {!user && (
                <div className="review-cta">
                  <p>Inicia sessió per escriure una review!</p>
                  <Link to="/login" className="btn btn-primary">Iniciar sessió</Link>
                </div>
              )}

              {reviews.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">REV</div>
                  <h3>Sense reviews encara</h3>
                  <p>Sigues el primer en opinar sobre aquest joc.</p>
                </div>
              ) : (
                <div className="reviews-list">
                  {reviews.map(r => (
                    <ReviewCard
                      key={r.id}
                      review={r}
                      onDelete={reviewId => setReviews(prev => prev.filter(x => x.id !== reviewId))}
                      onUpdate={updated => setReviews(prev => prev.map(x => (x.id === updated.id ? updated : x)))}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GameDetail;