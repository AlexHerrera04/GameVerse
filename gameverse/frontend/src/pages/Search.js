import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { gamesAPI } from '../services/api';
import './Search.css';

const ORDERINGS = [
  { value: '-added', label: 'Tendències' },
  { value: '-rating', label: 'Millor valorats' },
  { value: '-released', label: 'Més nous' },
  { value: 'released', label: 'Més antics' },
  { value: 'name', label: 'Nom A-Z' },
  { value: '-metacritic', label: 'Metacritic' },
];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [games, setGames] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedPlatform, setSelectedPlatform] = useState(searchParams.get('platform') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [ordering, setOrdering] = useState(searchParams.get('ordering') || '-added');

  const inputRef = useRef();

  useEffect(() => {
    Promise.all([
      gamesAPI.getPlatforms(),
      gamesAPI.getGenres(),
    ]).then(([pRes, gRes]) => {
      setPlatforms(pRes.data.results || []);
      setGenres(gRes.data.results || []);
    }).catch(() => {});
  }, []);

  const search = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, page_size: 20, ordering };
      if (query.trim()) params.search = query.trim();
      if (selectedPlatform) params.platforms = selectedPlatform;
      if (selectedGenre) params.genres = selectedGenre;

      const res = await gamesAPI.getGames(params);
      setGames(res.data.results);
      setTotal(res.data.count);
      setTotalPages(Math.ceil(res.data.count / 20));
      setPage(p);

      const newParams = {};
      if (query.trim()) newParams.q = query.trim();
      if (selectedPlatform) newParams.platform = selectedPlatform;
      if (selectedGenre) newParams.genre = selectedGenre;
      if (ordering !== '-added') newParams.ordering = ordering;
      setSearchParams(newParams, { replace: true });
    } catch {}
    setLoading(false);
  }, [query, selectedPlatform, selectedGenre, ordering, setSearchParams]);

  useEffect(() => { search(1); }, [ordering, selectedPlatform, selectedGenre]);

  const handleSubmit = (e) => {
    e.preventDefault();
    search(1);
  };

  const handlePageChange = (p) => {
    search(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    if (start > 1) { pages.push(1); if (start > 2) pages.push('...'); }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) { if (end < totalPages - 1) pages.push('...'); pages.push(totalPages); }
    return (
      <div className="pagination">
        <button className="page-btn" disabled={page === 1} onClick={() => handlePageChange(page - 1)}>←</button>
        {pages.map((p, i) =>
          p === '...' ? <span key={`el${i}`} className="page-ellipsis">…</span> :
          <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => handlePageChange(p)}>{p}</button>
        )}
        <button className="page-btn" disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>→</button>
      </div>
    );
  };

  return (
    <div className="search-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">🔍 Cercador de jocs</h1>
          <p className="page-subtitle">{total > 0 ? `${total.toLocaleString()} jocs trobats` : 'Cerca qualsevol videojoc'}</p>
        </div>

        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-input-wrap">
            <input
              ref={inputRef}
              className="search-input form-input"
              type="text"
              placeholder="Nom del joc..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary search-btn">Cercar</button>
          </div>

          <div className="search-filters">
            <select className="form-select" value={selectedPlatform} onChange={e => setSelectedPlatform(e.target.value)}>
              <option value="">Totes les plataformes</option>
              {platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>

            <select className="form-select" value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
              <option value="">Tots els gèneres</option>
              {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>

            <select className="form-select" value={ordering} onChange={e => setOrdering(e.target.value)}>
              {ORDERINGS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </form>

        {loading ? (
          <div className="loading-container"><div className="spinner" /><span>Cercant...</span></div>
        ) : games.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎮</div>
            <h3>Cap joc trobat</h3>
            <p>Prova amb uns altres termes de cerca o filtres.</p>
          </div>
        ) : (
          <>
            <div className="games-grid">
              {games.map(game => <GameCard key={game.id} game={game} />)}
            </div>
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
