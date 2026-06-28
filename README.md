# PartyUp — Game Partner Social Network

PartyUp is a web app for gamers to find people to play with. Players browse a
catalog of games, create or search **sessions** (squads/duos looking for
players), send **join requests** to sessions, get approved or rejected by the
host, chat with their session in **real time**, post short updates to a feed,
and view live **statistics** about the platform.

The project is split into a Node/Express/MongoDB **backend API** and a
no-build, React-in-the-browser **frontend**.

---

## Tech Stack

**Backend (`server/`)**
- Node.js + Express 4 (REST API)
- MongoDB + Mongoose 8 (data layer)
- JSON Web Tokens (`jsonwebtoken`) for auth, `bcryptjs` for password hashing
- Socket.io 4 for real-time session chat
- `dotenv` for configuration, `nodemon` for development
- MongoDB aggregation pipelines for the statistics endpoints

**Frontend (`client/`)**
- React 18 (UMD build, loaded from CDN — **no bundler / no build step**)
- Babel Standalone transpiles the `.jsx` files in the browser
- jQuery `$.ajax` for all REST calls (single chokepoint in `apiClient.jsx`)
- Socket.io client for live chat
- D3 v7 for the statistics charts
- Plain HTML/CSS entry point (`PartyUp.html`); desktop dashboard layout that
  collapses to a mobile bottom-nav below 900px

> The frontend has **no `package.json`** — every library is pulled from a CDN
> inside `PartyUp.html`, and JSX is compiled live by Babel. It only needs to be
> served as static files.

---

## Project Structure

```
PartyUp/
├── client/                     # Frontend (static, no build)
│   ├── PartyUp.html            # Entry point — loads React/Babel/jQuery/Socket.io/D3 + all .jsx
│   ├── apiClient.jsx           # Api.* — all REST/Socket access; normalizes backend → UI shape
│   ├── app.jsx                 # App bootstrap / boot gate
│   ├── auth.jsx                # Login & register screens
│   ├── screens.jsx             # Main screens
│   ├── desktop-screens.jsx     # Desktop dashboard screens
│   ├── desktop-modals.jsx      # Desktop modal dialogs
│   ├── data.jsx                # Global GAMES/USERS/SESSIONS caches + helpers
│   ├── visuals.jsx             # Game cover art / styling
│   ├── ios-frame.jsx           # Mobile frame wrapper
│   ├── tweaks-panel.jsx        # Dev tweak panel
│   ├── games.json              # Static game data (legacy mock stand-in)
│   └── uploads/                # Image assets
│
├── server/                     # Backend API
│   ├── server.js               # Bootstrap: loads env, connects DB, starts HTTP + Socket.io
│   ├── app.js                  # Express app: middleware + route mounting
│   ├── socket.js               # Socket.io real-time chat (JWT-authenticated rooms)
│   ├── config/db.js            # MongoDB connection (uses MONGO_URI)
│   ├── models/                 # Mongoose schemas: User, Game, Session, Post, JoinRequest, ChatMessage
│   ├── controllers/            # Route handlers (auth, user, game, session, post, request, chat, stats)
│   ├── routes/                 # Express routers, one per resource
│   ├── middleware/             # authMiddleware (JWT protect), errorMiddleware (404 + error handler)
│   ├── seed/seedData.js        # Seed script — demo users, games, sessions, posts, requests, chat
│   ├── .env.example            # Example environment variables
│   └── package.json            # Backend dependencies + scripts
│
└── Docs/                       # Project specification, requirements, syllabus (PDF)
```

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** running locally (default `mongodb://127.0.0.1:27017/partyup`) or a
  MongoDB connection string

---

## How to Run the Backend

From the `server/` directory:

```bash
cd server
npm install
```

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

`.env` contents:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/partyup
JWT_SECRET=change_me
```

Then start the API:

```bash
npm run dev      # development, auto-reload via nodemon
# or
npm start        # production-style, plain node
```

On success you'll see:

```
[db] Connected to MongoDB at mongodb://127.0.0.1:27017/partyup
[server] PartyUp API listening on http://localhost:5000
```

Health check: `GET http://localhost:5000/api/health`

---

## How to Run the Seed

The seed script wipes the relevant collections and inserts the demo dataset
(8 games, 5 users, 10 sessions, posts, join requests, and chat messages).

From the `server/` directory (requires `.env` with `MONGO_URI` set):

```bash
cd server
npm run seed
```

Expected output:

```
[seed] Connected to MongoDB at ...
[seed] Cleared existing collections
[seed] Inserted demo data:
  users:         5
  games:         8
  sessions:      10
  posts:         5
  join requests: 4
  chat messages: 6
[seed] Done — demo password for all users is "demo123"
```

> ⚠️ The seed **deletes all existing** users, games, sessions, posts, join
> requests, and chat messages before inserting. Don't run it against data you
> want to keep.

---

## How to Run the Frontend

The frontend is static and has no build step, but it **must be served over
HTTP** (not opened via `file://`) so Babel can load the `.jsx` files and the
browser can call the API.

From the **project root**, run:

```bash
npx serve client -l 5180
```

Then open:

```
http://localhost:5180/PartyUp.html
```

> A different port can be used, but the backend's CORS configuration must allow
> that origin. Port **5180** is the tested default.

The frontend calls the API at `http://localhost:5000/api` by default. To point
it elsewhere, set `window.PARTYUP_API_BASE` before the app scripts load.

**Order of operations:** start MongoDB → run the seed → start the backend →
serve the frontend.

---

## Demo Users

All seeded users share the password **`demo123`**. You can log in with either
the **username** or the **email** as the identifier.

| Username | Email                | Role    | Platform    | Region | Skill        |
|----------|----------------------|---------|-------------|--------|--------------|
| Menalu   | menalu@partyup.com   | regular | PC          | Israel | Intermediate |
| Niv      | niv@partyup.com      | host    | PlayStation | Israel | Advanced     |
| Trngo    | trngo@partyup.com    | regular | PC          | Europe | Beginner     |
| Mosh     | mosh@partyup.com     | regular | Xbox        | Israel | Intermediate |
| Noa      | noa@partyup.com      | host    | PC          | Israel | Advanced     |

> `host` users have the extra ability to manage the game catalog
> (create/update/delete games), enforced server-side.

---

## Main Features

- **Authentication** — register, login (by username *or* email), JWT-based
  sessions, `/api/auth/me` to restore the logged-in user. Passwords hashed with
  bcrypt.
- **Game catalog** — browse/search games; hosts can create, update, and delete
  games (`host`-only, enforced server-side).
- **User profiles** — list/search users (filter by region, platform, skill
  level, favorite game); edit your own profile (own-profile-only, enforced
  server-side).
- **Sessions** — create, list, and **search** sessions with filters (game,
  platform, region, skill level, mode, status, availability); update/delete your
  own; join/leave; hosts can remove members.
- **Join requests** — request to join a session with a message; host approves or
  rejects; view "my requests" and requests for a session; approval adds the user
  to the session's member list.
- **Feed / posts** — create posts tied to a session, view per-session and
  personalized feeds, update/delete your own posts (likes/comments fields).
- **Real-time chat** — Socket.io rooms per session, JWT-authenticated; only
  session members can join/send. History loads over REST; live messages stream
  over the socket (with a REST fallback when the socket is down).
- **Statistics** — MongoDB aggregations rendered as D3 charts:
  posts-per-month, sessions-per-game, users-by-platform, requests-by-status.
- **Responsive UI** — desktop dashboard layout that collapses to a mobile
  bottom-nav layout below 900px width.

### API Surface (mounted under `/api`)

| Resource   | Routes |
|------------|--------|
| `auth`     | `POST /register`, `POST /login`, `GET /me` 🔒 |
| `users`    | `GET /`, `GET /:id`, `PUT /:id` 🔒 |
| `games`    | `GET /`, `GET /:id`, `POST /` 🔒, `PUT /:id` 🔒, `DELETE /:id` 🔒 |
| `sessions` | `GET /`, `GET /search`, `GET /:id`, `POST /` 🔒, `PUT /:id` 🔒, `DELETE /:id` 🔒, `POST /:id/join` 🔒, `POST /:id/leave` 🔒, `DELETE /:id/members/:userId` 🔒 |
| `requests` | `GET /`, `GET /my` 🔒, `GET /session/:sessionId`, `POST /` 🔒, `PUT /:id/approve` 🔒, `PUT /:id/reject` 🔒, `DELETE /:id` 🔒 |
| `posts`    | `GET /`, `GET /:id`, `POST /` 🔒, `PUT /:id` 🔒, `DELETE /:id` 🔒 |
| `chat`     | `GET /:sessionId/messages`, `POST /:sessionId/messages` 🔒 |
| `stats`    | `GET /posts-per-month`, `GET /sessions-per-game`, `GET /users-by-platform`, `GET /requests-by-status` |

🔒 = requires `Authorization: Bearer <token>` (JWT). Plus `GET /api/health`.

Real-time chat (Socket.io): client events `joinRoom`, `leaveRoom`,
`sendMessage`; server events `receiveMessage`, `chatError`. Connection requires
a valid JWT in the socket handshake `auth.token`.

---

## Suggested Demo Flow

1. Start MongoDB, run `npm run seed`, start the backend (`npm run dev`), and
   serve the frontend.
2. **Log in** as `Noa` (a host) with password `demo123`.
3. Browse the **game catalog** and the seeded **sessions** (e.g. "Valorant
   Ranked Squad").
4. **Search/filter** sessions by game, platform, or skill level.
5. **Create a new session** as the host.
6. In a second browser (or after logging out), log in as `Menalu` and **send a
   join request** to one of Noa's sessions.
7. Back as the host, **approve** the request and watch the member join the
   session.
8. Open the session **chat** and exchange a couple of live messages between the
   two users (real-time via Socket.io).
9. **Post** an update to the feed from a session.
10. Open the **statistics** view to see the D3 charts populated from the seeded
    data (sessions per game, users by platform, requests by status, posts per
    month).

---

## Requirement Coverage

| Requirement                          | Where it lives |
|--------------------------------------|----------------|
| Node.js + Express server             | `server/app.js`, `server/server.js` |
| MongoDB + Mongoose models            | `server/models/*`, `server/config/db.js` |
| User registration & login            | `server/controllers/authController.js` |
| Password hashing (bcrypt)            | `authController.js`, `seed/seedData.js` |
| JWT authentication & protected routes| `server/middleware/authMiddleware.js` |
| Full CRUD resources                  | sessions, games, posts, requests, users controllers |
| Search / filtering                   | `sessionController` (`/search`), `userController` |
| Relationships between collections    | sessions↔games/users, posts↔sessions, requests↔sessions, chat↔sessions |
| jQuery Ajax calls                    | `client/apiClient.jsx` (`request()` wrapper using `$.ajax`) |
| Socket.io / WebSockets chat          | `server/socket.js`, client `Api.chat` (live rooms per session) |
| D3.js graphs from MongoDB data       | `server/controllers/statsController.js`, D3 charts in client |
| React Video component                | `client/screens.jsx` / `client/desktop-screens.jsx` |
| React Canvas component               | `client/visuals.jsx` (`SkillBadgeCanvas` — arc gauge drawn per member skill level) |
| CSS3: text-shadow, transition, multiple-columns, font-face, border-radius | `client/PartyUp.html` (`@font-face`, transitions, border-radius, animations) |
| Seed / demo data                     | `server/seed/seedData.js` |
| Responsive frontend                  | `client/PartyUp.html` + screen `.jsx` files |

---

## Environment Variables

Defined in `server/.env` (template in `server/.env.example`):

| Variable     | Description                          | Example |
|--------------|--------------------------------------|---------|
| `PORT`       | Port the API listens on              | `5000` |
| `MONGO_URI`  | MongoDB connection string (required) | `mongodb://127.0.0.1:27017/partyup` |
| `JWT_SECRET` | Secret used to sign/verify JWTs      | `change_me` |

> `MONGO_URI` is required by both the server and the seed script — they exit
> immediately if it isn't set. Change `JWT_SECRET` to a strong value for any
> non-local use.

Frontend (optional, set on `window` before scripts load):

| Variable                | Description                       | Default |
|-------------------------|-----------------------------------|---------|
| `window.PARTYUP_API_BASE` | Base URL for API calls          | `http://localhost:5000/api` |

---

## Submission Notes

- The backend includes authentication, CRUD, join requests, real-time chat,
  statistics, seed data, and frontend integration.
- The frontend deliberately has **no build pipeline**: React/Babel/jQuery/
  Socket.io/D3 are loaded from CDNs and JSX is transpiled in-browser. This keeps
  setup minimal but means the page must be served over HTTP.
- The frontend currently loads libraries from CDN, so internet access is required
  unless local copies are prepared.
- `client/games.json` is a legacy static stand-in from before the backend
  existed; live game data now comes from the API.
- All demo accounts use the password `demo123`. Change `JWT_SECRET` and real
  credentials before any public deployment.
- The seed script is destructive (clears collections first) — intended for demo
  setup, not for use against production data.

---

## Team Members

- Menalu — [contribution]
- [Team member] — [contribution]
- [Team member] — [contribution]
