require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DB then start server
initDb().then(() => {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api', require('./routes/games'));
  app.use('/api/favorites', require('./routes/favorites'));
  app.use('/api/reviews', require('./routes/reviews'));

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/*', (req, res) => res.status(404).json({ error: 'Not found' }));

  app.listen(PORT, () => {
    console.log(`GameVerse backend running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
