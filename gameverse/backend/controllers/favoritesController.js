const { run, get, all, runGetLastId } = require('../config/database');

const getFavorites = (req, res) => {
  const favorites = all('SELECT * FROM favorites WHERE user_id = ? ORDER BY added_at DESC', [req.user.id]);
  res.json(favorites);
};

const addFavorite = (req, res) => {
  const { game_id, game_name, game_slug, game_background_image, game_rating, game_released } = req.body;
  if (!game_id || !game_name) return res.status(400).json({ error: 'game_id and game_name required' });

  const existing = get('SELECT id FROM favorites WHERE user_id = ? AND game_id = ?', [req.user.id, game_id]);
  if (existing) return res.status(409).json({ error: 'Already in favorites' });

  const id = runGetLastId(
    'INSERT INTO favorites (user_id, game_id, game_name, game_slug, game_background_image, game_rating, game_released) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, game_id, game_name, game_slug || '', game_background_image || null, game_rating || 0, game_released || null]
  );
  const fav = get('SELECT * FROM favorites WHERE id = ?', [id]);
  res.status(201).json(fav);
};

const removeFavorite = (req, res) => {
  const existing = get('SELECT id FROM favorites WHERE user_id = ? AND game_id = ?', [req.user.id, req.params.gameId]);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  run('DELETE FROM favorites WHERE user_id = ? AND game_id = ?', [req.user.id, req.params.gameId]);
  res.json({ message: 'Removed' });
};

const rateGame = (req, res) => {
  const { rating } = req.body;
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });
  const existing = get('SELECT id FROM favorites WHERE user_id = ? AND game_id = ?', [req.user.id, req.params.gameId]);
  if (!existing) return res.status(404).json({ error: 'Not in favorites' });
  run('UPDATE favorites SET user_rating = ? WHERE user_id = ? AND game_id = ?', [rating, req.user.id, req.params.gameId]);
  const fav = get('SELECT * FROM favorites WHERE user_id = ? AND game_id = ?', [req.user.id, req.params.gameId]);
  res.json(fav);
};

module.exports = { getFavorites, addFavorite, removeFavorite, rateGame };