import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reviewsAPI } from '../services/api';
import './ReviewCard.css';

const ReviewCard = ({ review, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(review.likes_count || 0);
  const [liked, setLiked] = useState(review.user_liked || false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(review.title);
  const [editContent, setEditContent] = useState(review.content);
  const [editRating, setEditRating] = useState(review.rating);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!user) return;
    try {
      const res = await reviewsAPI.like(review.id);
      setLikes(res.data.likes_count);
      setLiked(res.data.liked);
    } catch {}
  };

  const handleDelete = async () => {
    if (!window.confirm('Eliminar aquesta review?')) return;
    try {
      await reviewsAPI.delete(review.id);
      onDelete && onDelete(review.id);
    } catch {}
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await reviewsAPI.update(review.id, { title: editTitle, content: editContent, rating: editRating });
      onUpdate && onUpdate(res.data);
      setEditing(false);
    } catch {} finally { setLoading(false); }
  };

  const ratingColor = review.rating >= 8 ? '#22c55e' : review.rating >= 6 ? '#f59e0b' : '#ef4444';
  const dateStr = new Date(review.created_at).toLocaleDateString('ca-ES', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="review-card card">
      {review.game_background_image && (
        <div className="review-card-game-banner" style={{ backgroundImage: `url(${review.game_background_image})` }}>
          <div className="review-card-game-overlay" />
          <Link to={`/game/${review.game_id}`} className="review-card-game-name">{review.game_name}</Link>
        </div>
      )}

      <div className="review-card-body">
        {editing ? (
          <div className="review-edit-form">
            <input className="form-input" value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Títol" />
            <textarea className="form-textarea" value={editContent} onChange={e => setEditContent(e.target.value)} rows={4} />
            <div className="review-edit-rating">
              <label className="form-label">Puntuació: {editRating}/10</label>
              <input type="range" min="1" max="10" value={editRating} onChange={e => setEditRating(parseInt(e.target.value))} className="rating-slider" />
            </div>
            <div className="review-edit-actions">
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={loading}>Guardar</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>Cancel·lar</button>
            </div>
          </div>
        ) : (
          <>
            <div className="review-card-header">
              <div className="review-card-score" style={{ background: ratingColor + '22', color: ratingColor, borderColor: ratingColor + '44' }}>
                {review.rating}<span>/10</span>
              </div>
              <div className="review-card-info">
                <h3 className="review-title">{review.title}</h3>
                <div className="review-meta">
                  <Link to={`/profile/${review.username}`} className="review-author">
                    <div className="review-avatar">{review.username[0].toUpperCase()}</div>
                    {review.username}
                  </Link>
                  <span className="review-date">{dateStr}</span>
                </div>
              </div>
            </div>

            <p className="review-content">{review.content}</p>

            <div className="review-actions">
              <button
                className={`review-action-btn ${liked ? 'liked' : ''}`}
                onClick={handleLike}
                disabled={!user}
                title={user ? 'M\'agrada' : 'Inicia sessió per donar like'}
              >
                {liked ? '❤️' : '🤍'} {likes}
              </button>

              {!review.game_background_image && (
                <Link to={`/game/${review.game_id}`} className="review-action-btn game-link">
                  🎮 {review.game_name}
                </Link>
              )}

              {user && user.id === review.user_id && (
                <div className="review-owner-actions">
                  <button className="review-action-btn" onClick={() => setEditing(true)}>✏️ Editar</button>
                  <button className="review-action-btn danger" onClick={handleDelete}>🗑️ Eliminar</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
