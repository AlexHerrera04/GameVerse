# 🎮 GameVerse

Plataforma de videojocs fullstack: cerca, reviews, favorits, puntuació i perfils compartibles.

---

## 🏗️ Arquitectura

```
gameverse/
├── backend/              # Node.js + Express API REST
│   ├── config/           # Connexió base de dades SQLite
│   ├── controllers/      # Lògica de negoci
│   ├── middleware/        # Auth JWT
│   ├── routes/           # Endpoints API
│   └── server.js         # Entrada
├── frontend/             # React SPA
│   ├── public/           # HTML base
│   └── src/
│       ├── assets/       # CSS global
│       ├── components/   # Components reutilitzables
│       ├── context/      # AuthContext, FavoritesContext
│       ├── pages/        # Pàgines de l'app
│       └── services/     # Crides a l'API
├── database/             # Fitxer SQLite (generat automàticament)
└── package.json          # Scripts arrel
```

---

## 🚀 Arrancada ràpida

### Prerequisits
- Node.js 18+
- npm 9+

### Instal·lació i arrancada

```bash
# 1. Instal·lar dependències (backend + frontend)
cd backend && npm install
cd ../frontend && npm install

# 2. Arrencar el backend (terminal 1)
cd backend
npm run dev        # amb hot-reload (nodemon)
# o
npm start          # producció

# 3. Arrencar el frontend (terminal 2)
cd frontend
npm start
```

L'app estarà disponible a:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api

---

## 🗄️ Base de dades — Diagrama ER

```
┌─────────────────────┐       ┌──────────────────────────┐
│        users        │       │        favorites         │
├─────────────────────┤       ├──────────────────────────┤
│ id (PK)             │──┐    │ id (PK)                  │
│ username (UNIQUE)   │  │    │ user_id (FK → users.id)  │
│ email (UNIQUE)      │  ├───►│ game_id                  │
│ password_hash       │  │    │ game_name                │
│ avatar              │  │    │ game_slug                │
│ bio                 │  │    │ game_background_image    │
│ created_at          │  │    │ game_rating              │
│ updated_at          │  │    │ game_released            │
└─────────────────────┘  │    │ user_rating (1-10)       │
                          │    │ added_at                 │
                          │    └──────────────────────────┘
                          │
                          │    ┌──────────────────────────┐
                          │    │         reviews          │
                          │    ├──────────────────────────┤
                          ├───►│ id (PK)                  │
                          │    │ user_id (FK → users.id)  │
                          │    │ game_id                  │
                          │    │ game_name                │
                          │    │ game_slug                │
                          │    │ game_background_image    │
                          │    │ title                    │
                          │    │ content                  │
                          │    │ rating (1-10)            │
                          │    │ created_at               │
                          │    │ updated_at               │
                          │    └──────────────┬───────────┘
                          │                   │
                          │    ┌──────────────▼───────────┐
                          │    │       review_likes       │
                          │    ├──────────────────────────┤
                          └───►│ user_id (FK)             │
                               │ review_id (FK)           │
                               │ PRIMARY KEY (user_id,    │
                               │             review_id)   │
                               └──────────────────────────┘
```

---

## 📐 Diagrama UML — Components React

```
App
├── AuthProvider (context)
│   └── FavoritesProvider (context)
│       └── ToastProvider
│           ├── Navbar
│           └── Routes
│               ├── Home          → GameCard[]
│               ├── Search        → GameCard[]
│               ├── GameDetail    → ReviewCard[]
│               ├── Platforms
│               ├── Upcoming      → GameCard[]
│               ├── Reviews       → ReviewCard[]
│               ├── Favorites     → FavoriteItem[]
│               ├── Login
│               ├── Register
│               └── Profile       → ReviewCard[], FavCard[]
```

---

## 🔌 Endpoints del Backend

### Autenticació `/api/auth`

| Mètode | Endpoint | Auth | Descripció |
|--------|----------|------|------------|
| POST | `/api/auth/register` | ❌ | Registre nou usuari |
| POST | `/api/auth/login` | ❌ | Login, retorna JWT |
| GET | `/api/auth/me` | ✅ | Dades usuari actual |
| PUT | `/api/auth/me` | ✅ | Actualitza perfil |
| GET | `/api/auth/profile/:username` | ❌ | Perfil públic |

### Jocs (proxy RAWG) `/api`

| Mètode | Endpoint | Descripció |
|--------|----------|------------|
| GET | `/api/platforms` | Llista plataformes |
| GET | `/api/genres` | Llista gèneres |
| GET | `/api/games` | Cerca jocs (params: search, platforms, genres, ordering, page) |
| GET | `/api/games/upcoming` | Pròxims llançaments |
| GET | `/api/games/:id` | Detall + captures + tràilers |

### Favorits `/api/favorites`

| Mètode | Endpoint | Auth | Descripció |
|--------|----------|------|------------|
| GET | `/api/favorites` | ✅ | Els meus favorits |
| POST | `/api/favorites` | ✅ | Afegir favorit |
| DELETE | `/api/favorites/:gameId` | ✅ | Eliminar favorit |
| PATCH | `/api/favorites/:gameId/rating` | ✅ | Puntuar joc (1-10) |

### Reviews `/api/reviews`

| Mètode | Endpoint | Auth | Descripció |
|--------|----------|------|------------|
| GET | `/api/reviews` | Opcional | Totes les reviews (paginat) |
| GET | `/api/reviews/mine` | ✅ | Les meves reviews |
| GET | `/api/reviews/game/:game_id` | Opcional | Reviews d'un joc |
| POST | `/api/reviews` | ✅ | Crear review |
| PUT | `/api/reviews/:id` | ✅ | Editar review (propietari) |
| DELETE | `/api/reviews/:id` | ✅ | Eliminar review (propietari) |
| POST | `/api/reviews/:id/like` | ✅ | Toggle like |

### Format de dades

**POST /api/auth/register**
```json
{ "username": "string", "email": "string", "password": "string(min6)" }
```

**POST /api/favorites**
```json
{
  "game_id": 3498,
  "game_name": "Grand Theft Auto V",
  "game_slug": "grand-theft-auto-v",
  "game_background_image": "https://...",
  "game_rating": 4.47,
  "game_released": "2013-09-17"
}
```

**POST /api/reviews**
```json
{
  "game_id": 3498,
  "game_name": "Grand Theft Auto V",
  "game_slug": "grand-theft-auto-v",
  "game_background_image": "https://...",
  "title": "Una obra mestra",
  "content": "Increïble joc...",
  "rating": 9
}
```

---

## 🛠️ Tecnologies

**Frontend:** React 18, React Router v6, Axios, CSS Variables  
**Backend:** Node.js, Express, better-sqlite3, bcryptjs, jsonwebtoken  
**Base de dades:** SQLite (fitxer local `database/gameverse.db`)  
**API externa:** RAWG Video Games Database API  

---

## 🌐 Variables d'entorn

**backend/.env**
```
PORT=5000
JWT_SECRET=gameverse_super_secret_jwt_key_2024
RAWG_API_KEY=a2d2dd7004cb4cf097f702052f5f8b15
NODE_ENV=development
```

**frontend/.env**
```
REACT_APP_API_URL=http://localhost:5000/api
```
