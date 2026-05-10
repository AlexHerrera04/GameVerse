const axios = require('axios');

const RAWG_BASE = 'https://api.rawg.io/api';
const API_KEY = process.env.RAWG_API_KEY;

const normalizeSearchText = (value = '') =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const getPlatforms = async (req, res) => {
  try {
    const response = await axios.get(`${RAWG_BASE}/platforms`, {
      params: { key: API_KEY, page_size: 40 }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch platforms' });
  }
};

const getGames = async (req, res) => {
  try {
    const {
      search, platforms, dates, ordering, page = 1,
      page_size = 20, genres, tags
    } = req.query;

    const params = { key: API_KEY, page, page_size };

    if (search) {
      params.search = search;
      params.search_precise = true;
    }

    if (platforms) params.platforms = platforms;
    if (dates) params.dates = dates;
    if (ordering) params.ordering = ordering;
    if (genres) params.genres = genres;
    if (tags) params.tags = tags;

    const response = await axios.get(`${RAWG_BASE}/games`, { params });

    if (!search) {
      return res.json(response.data);
    }

    const normalizedQuery = normalizeSearchText(search);
    const filteredResults = (response.data.results || []).filter((game) =>
      normalizeSearchText(game.name).includes(normalizedQuery)
    );

    res.json({
      ...response.data,
      count: filteredResults.length,
      results: filteredResults,
      next: null,
      previous: null
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};

const getGameDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const [gameRes, screenshotsRes, trailersRes] = await Promise.all([
      axios.get(`${RAWG_BASE}/games/${id}`, { params: { key: API_KEY } }),
      axios.get(`${RAWG_BASE}/games/${id}/screenshots`, { params: { key: API_KEY } }),
      axios.get(`${RAWG_BASE}/games/${id}/movies`, { params: { key: API_KEY } }).catch(() => ({ data: { results: [] } }))
    ]);

    res.json({
      ...gameRes.data,
      screenshots: screenshotsRes.data.results,
      trailers: trailersRes.data.results
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch game details' });
  }
};

const getUpcoming = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const response = await axios.get(`${RAWG_BASE}/games`, {
      params: {
        key: API_KEY,
        dates: `${today},${nextYear}`,
        ordering: '-added',
        page_size: 20,
        page: req.query.page || 1
      }
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch upcoming games' });
  }
};

const getGenres = async (req, res) => {
  try {
    const response = await axios.get(`${RAWG_BASE}/genres`, {
      params: { key: API_KEY }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
};

module.exports = { getPlatforms, getGames, getGameDetail, getUpcoming, getGenres };