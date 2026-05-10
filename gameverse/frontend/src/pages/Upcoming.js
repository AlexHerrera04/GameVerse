import React, { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';
import { gamesAPI } from '../services/api';
import './Upcoming.css';

const Upcoming = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await gamesAPI.getUpcoming(p);
      if (p === 1) setGames(res.data.results);
      else setGames(prev => [...prev, ...res.data.results]);
      setTotal(res.data.count);
      setHasMore(!!res.data.next);
      setPage(p);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    load(1);
  }, []);

  return (
    <div className="upcoming-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Pròximament</h1>
          <p className="page-subtitle">
            {total > 0 ? `${total.toLocaleString()} jocs a camí` : 'Els propers llançaments de videojocs'}
          </p>
        </div>

        {loading && page === 1 ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : (
          <>
            <div className="games-grid">
              {games.map(game => <GameCard key={game.id} game={game} />)}
            </div>

            {loading && <div className="loading-more"><div className="spinner" /></div>}

            {hasMore && !loading && (
              <div className="load-more-wrap">
                <button className="btn btn-secondary load-more-btn" onClick={() => load(page + 1)}>
                  Carregar més
                </button>
              </div>
            )}

            {!hasMore && games.length > 0 && (
              <p className="end-message">Has vist tots els pròxims llançaments</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Upcoming;