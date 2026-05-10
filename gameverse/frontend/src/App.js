import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import GameDetail from './pages/GameDetail';
import Platforms from './pages/Platforms';
import Upcoming from './pages/Upcoming';
import Reviews from './pages/Reviews';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import './assets/global.css';

const App = () => (
  <Router>
    <AuthProvider>
      <FavoritesProvider>
        <ToastProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/game/:id" element={<GameDetail />} />
            <Route path="/platforms" element={<Platforms />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route
              path="*"
              element={
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    gap: '1rem'
                  }}
                >
                  <div style={{ fontSize: '4rem' }}>404</div>
                  <h1>404 - Pàgina no trobada</h1>
                  <a href="/" className="btn btn-primary">Tornar a l'inici</a>
                </div>
              }
            />
          </Routes>
        </ToastProvider>
      </FavoritesProvider>
    </AuthProvider>
  </Router>
);

export default App;