const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { run, get, all, runGetLastId } = require('../config/database');

const register = (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password min 6 chars' });

  const existing = get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
  if (existing) return res.status(409).json({ error: 'Username or email already exists' });

  const password_hash = bcrypt.hashSync(password, 10);
  const id = runGetLastId(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    [username, email, password_hash]
  );

  const token = jwt.sign({ id, username, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id, username, email, bio: '', avatar: null } });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const user = get('SELECT * FROM users WHERE email = ?', [email]);
  if (!user || !bcrypt.compareSync(password, user.password_hash))
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, username: user.username, email: user.email, bio: user.bio, avatar: user.avatar } });
};

const getMe = (req, res) => {
  const user = get('SELECT id, username, email, bio, avatar, created_at FROM users WHERE id = ?', [req.user.id]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

const updateProfile = (req, res) => {
  const { bio, avatar } = req.body;
  run('UPDATE users SET bio = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [bio || '', avatar || null, req.user.id]);
  const user = get('SELECT id, username, email, bio, avatar FROM users WHERE id = ?', [req.user.id]);
  res.json(user);
};

const getPublicProfile = (req, res) => {
  const user = get('SELECT id, username, bio, avatar, created_at FROM users WHERE username = ?', [req.params.username]);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const reviews = all(
    `SELECT r.id, r.user_id, r.game_id, r.game_name, r.game_slug, r.game_background_image,
     r.title, r.content, r.rating, r.created_at, u.username, u.avatar
     FROM reviews r JOIN users u ON r.user_id = u.id
     WHERE r.user_id = ? ORDER BY r.created_at DESC LIMIT 10`,
    [user.id]
  );
  const favorites = all('SELECT * FROM favorites WHERE user_id = ? ORDER BY added_at DESC LIMIT 20', [user.id]);
  res.json({ user, reviews, favorites });
};

module.exports = { register, login, getMe, updateProfile, getPublicProfile };
