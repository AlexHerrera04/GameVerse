import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { favoritesAPI } from '../services/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const loadFavorites = useCallback(async () => {
    if (!user) { setFavorites([]); setFavoriteIds(new Set()); return; }
    try {
      const res = await favoritesAPI.getAll();
      setFavorites(res.data);
      setFavoriteIds(new Set(res.data.map(f => f.game_id)));
    } catch {}
  }, [user]);

  useEffect(() => { loadFavorites(); }, [loadFavorites]);

  const addFavorite = useCallback(async (game) => {
    const res = await favoritesAPI.add({
      game_id: game.id,
      game_name: game.name,
      game_slug: game.slug,
      game_background_image: game.background_image,
      game_rating: game.rating,
      game_released: game.released,
    });
    setFavorites(prev => [res.data, ...prev]);
    setFavoriteIds(prev => new Set([...prev, game.id]));
    return res.data;
  }, []);

  const removeFavorite = useCallback(async (gameId) => {
    await favoritesAPI.remove(gameId);
    setFavorites(prev => prev.filter(f => f.game_id !== gameId));
    setFavoriteIds(prev => { const next = new Set(prev); next.delete(gameId); return next; });
  }, []);

  const rateGame = useCallback(async (gameId, rating) => {
    const res = await favoritesAPI.rate(gameId, rating);
    setFavorites(prev => prev.map(f => f.game_id === gameId ? res.data : f));
    return res.data;
  }, []);

  const isFavorite = useCallback((gameId) => favoriteIds.has(gameId), [favoriteIds]);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, addFavorite, removeFavorite, rateGame, loadFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
};
