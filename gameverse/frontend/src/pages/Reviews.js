import React, { useState, useEffect } from 'react';
import ReviewCard from '../components/ReviewCard';
import { reviewsAPI } from '../services/api';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await reviewsAPI.getAll(p);
      setReviews(res.data.reviews);
      setTotalPages(res.data.pages);
      setTotal(res.data.total);
      setPage(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    load(1);
  }, []);

  return (
    <div className="reviews-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Reviews de la comunitat</h1>
          <p className="page-subtitle">
            {total > 0 ? `${total} reviews publicades` : 'Opinions dels gamers sobre videojocs'}
          </p>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : reviews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">REV</div>
            <h3>Encara no hi ha reviews</h3>
            <p>Cerca un joc i escriu la primera review!</p>
          </div>
        ) : (
          <>
            <div className="reviews-grid">
              {reviews.map(r => (
                <ReviewCard
                  key={r.id}
                  review={r}
                  onDelete={id => setReviews(prev => prev.filter(x => x.id !== id))}
                  onUpdate={updated => setReviews(prev => prev.map(x => x.id === updated.id ? updated : x))}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" disabled={page === 1} onClick={() => load(page - 1)}>←</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`page-btn ${p === page ? 'active' : ''}`}
                    onClick={() => load(p)}
                  >
                    {p}
                  </button>
                ))}
                <button className="page-btn" disabled={page === totalPages} onClick={() => load(page + 1)}>→</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reviews;