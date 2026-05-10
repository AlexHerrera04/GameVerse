import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Inject token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// AUTH
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  getPublicProfile: (username) => api.get(`/auth/profile/${username}`),
};

// GAMES
export const gamesAPI = {
  getPlatforms: () => api.get('/platforms'),
  getGames: (params) => api.get('/games', { params }),
  getGameDetail: (id) => api.get(`/games/${id}`),
  getUpcoming: (page) => api.get('/games/upcoming', { params: { page } }),
  getGenres: () => api.get('/genres'),
};

// FAVORITES
export const favoritesAPI = {
  getAll: () => api.get('/favorites'),
  add: (data) => api.post('/favorites', data),
  remove: (gameId) => api.delete(`/favorites/${gameId}`),
  rate: (gameId, rating) => api.patch(`/favorites/${gameId}/rating`, { rating }),
};

// REVIEWS
export const reviewsAPI = {
  getAll: (page) => api.get('/reviews', { params: { page } }),
  getMine: () => api.get('/reviews/mine'),
  getByGame: (gameId) => api.get(`/reviews/game/${gameId}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  like: (id) => api.post(`/reviews/${id}/like`),
};

export default api;
