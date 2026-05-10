const { run, get, all, runGetLastId } = require('../config/database');

const getReviewsByGame = (req, res) => {
  const { game_id } = req.params;
  const reviews = all(
    `SELECT r.*, u.username, u.avatar,
     (SELECT COUNT(*) FROM review_likes WHERE review_id = r.id) as likes_count
     FROM reviews r JOIN users u ON r.user_id = u.id
     WHERE r.game_id = ? ORDER BY r.created_at DESC`,
    [game_id]
  );
  const likedIds = req.user
    ? new Set(all('SELECT review_id FROM review_likes WHERE user_id = ?', [req.user.id]).map(r => r.review_id))
    : new Set();
  res.json(reviews.map(r => ({ ...r, user_liked: likedIds.has(r.id) ? 1 : 0 })));
};

const getAllReviews = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 12;
  const offset = (page - 1) * limit;
  const totalRow = get('SELECT COUNT(*) as count FROM reviews');
  const total = totalRow ? totalRow.count : 0;
  const reviews = all(
    `SELECT r.*, u.username, u.avatar,
     (SELECT COUNT(*) FROM review_likes WHERE review_id = r.id) as likes_count
     FROM reviews r JOIN users u ON r.user_id = u.id
     ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  const likedIds = req.user
    ? new Set(all('SELECT review_id FROM review_likes WHERE user_id = ?', [req.user.id]).map(r => r.review_id))
    : new Set();
  res.json({
    reviews: reviews.map(r => ({ ...r, user_liked: likedIds.has(r.id) ? 1 : 0 })),
    total, page, pages: Math.ceil(total / limit)
  });
};

const createReview = (req, res) => {
  const { game_id, game_name, game_slug, game_background_image, title, content, rating } = req.body;
  if (!game_id || !game_name || !title || !content || !rating) return res.status(400).json({ error: 'All fields required' });
  if (rating < 1 || rating > 10) return res.status(400).json({ error: 'Rating 1-10' });

  const id = runGetLastId(
    'INSERT INTO reviews (user_id, game_id, game_name, game_slug, game_background_image, title, content, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, game_id, game_name, game_slug || '', game_background_image || null, title, content, rating]
  );
  const review = get(
    'SELECT r.*, u.username, u.avatar FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.id = ?',
    [id]
  );
  res.status(201).json({ ...review, likes_count: 0, user_liked: 0 });
};

const updateReview = (req, res) => {
  const { title, content, rating } = req.body;
  const review = get('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
  if (!review) return res.status(404).json({ error: 'Not found' });
  if (review.user_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

  run(
    'UPDATE reviews SET title = ?, content = ?, rating = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title || review.title, content || review.content, rating || review.rating, req.params.id]
  );
  const updated = get(
    `SELECT r.*, u.username, u.avatar,
     (SELECT COUNT(*) FROM review_likes WHERE review_id = r.id) as likes_count
     FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.id = ?`,
    [req.params.id]
  );
  res.json({ ...updated, user_liked: 0 });
};

const deleteReview = (req, res) => {
  const review = get('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
  if (!review) return res.status(404).json({ error: 'Not found' });
  if (review.user_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
  run('DELETE FROM review_likes WHERE review_id = ?', [req.params.id]);
  run('DELETE FROM reviews WHERE id = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
};

const toggleLike = (req, res) => {
  const review = get('SELECT id FROM reviews WHERE id = ?', [req.params.id]);
  if (!review) return res.status(404).json({ error: 'Not found' });
  const existing = get('SELECT * FROM review_likes WHERE user_id = ? AND review_id = ?', [req.user.id, req.params.id]);
  if (existing) {
    run('DELETE FROM review_likes WHERE user_id = ? AND review_id = ?', [req.user.id, req.params.id]);
  } else {
    run('INSERT INTO review_likes (user_id, review_id) VALUES (?, ?)', [req.user.id, req.params.id]);
  }
  const countRow = get('SELECT COUNT(*) as count FROM review_likes WHERE review_id = ?', [req.params.id]);
  res.json({ liked: !existing, likes_count: countRow ? countRow.count : 0 });
};

const getMyReviews = (req, res) => {
  const reviews = all(
    `SELECT r.*, u.username, u.avatar,
     (SELECT COUNT(*) FROM review_likes WHERE review_id = r.id) as likes_count
     FROM reviews r JOIN users u ON r.user_id = u.id
     WHERE r.user_id = ? ORDER BY r.created_at DESC`,
    [req.user.id]
  );
  res.json(reviews.map(r => ({ ...r, user_liked: 0 })));
};

module.exports = { getReviewsByGame, getAllReviews, createReview, updateReview, deleteReview, toggleLike, getMyReviews };
