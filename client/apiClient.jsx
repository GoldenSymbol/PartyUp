// ════════════════════════════════════════════════════════════════════
// apiClient — single chokepoint for all server data access.
// Phase 2: this now talks to the real Node/Express/MongoDB API at
// API_BASE instead of the in-memory mock arrays. Every call still goes
// through jQuery's $.ajax (spec section 20 — "JQuery Ajax sends GET/POST
// request to server... Response returns JSON... Client updates the UI"),
// just pointed at the real server now instead of the static games.json
// stand-in used before the backend existed.
//
// Screens never talk to the network directly — they only call Api.* and
// useApi(), exactly as before, so nothing in screens.jsx/auth.jsx/app.jsx
// had to change for this swap except the two auth submit handlers that
// now need to actually send the password the form already collects.
//
// Backend responses use Mongo's `_id` and (for sessions) populate some
// references for convenience. The normalize* helpers below translate
// that back into the flat {id, ...} shape the existing screens already
// expect (the same shape data.jsx's mock arrays used), and keep the
// global GAMES/USERS/SESSIONS arrays from data.jsx in sync so the
// synchronous gameById()/userById()/SESSIONS.find() lookups sprinkled
// through the screens keep working unchanged.
// ════════════════════════════════════════════════════════════════════

const API_BASE = window.PARTYUP_API_BASE || 'http://localhost:5000/api';
const TOKEN_KEY = 'partyup_token';

function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; }
}
function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch (e) { /* localStorage unavailable — token just won't persist across reloads */ }
}

// ─── Socket.io — real-time chat transport (spec section 17/28). REST under
// /chat/:sessionId/messages still loads history; this carries live messages. ──
const SOCKET_BASE = API_BASE.replace(/\/api\/?$/, '');
let socket = null;
const joinedRooms = new Set();
function getSocket() {
  if (!socket) {
    socket = io(SOCKET_BASE, { autoConnect: false });
    // Rooms are per-connection server-side, so reconnects (network blips) need to rejoin.
    socket.on('connect', () => joinedRooms.forEach((sessionId) => socket.emit('joinRoom', sessionId)));
  }
  return socket;
}
function connectSocket() {
  const s = getSocket();
  s.auth = { token: getToken() };
  if (!s.connected) s.connect();
  return s;
}
function disconnectSocket() {
  if (socket && socket.connected) socket.disconnect();
}

// jQuery $.ajax wrapper — every Api call (read or write) flows through this.
function request(path, { method = 'GET', body } = {}) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    $.ajax({
      url: API_BASE + path,
      method,
      dataType: 'json',
      contentType: body !== undefined ? 'application/json' : undefined,
      data: body !== undefined ? JSON.stringify(body) : undefined,
      headers: token ? { Authorization: 'Bearer ' + token } : {},
    })
      .done((data) => resolve(data))
      .fail((xhr) => {
        const message = (xhr.responseJSON && xhr.responseJSON.error) || `Request failed: ${xhr.status}`;
        reject(new Error(message));
      });
  });
}

// ─── Normalization: backend shape → the flat {id,...} shape screens expect ──
function idOf(ref) {
  if (!ref) return null;
  return typeof ref === 'object' ? ref._id : ref;
}
function shortDate(iso) {
  return iso ? String(iso).slice(0, 10) : '';
}

// Cosmetic fields (title/sub/bg/accent/vibe) are purely a frontend concern —
// the backend Game model only stores name/genre/platforms/description, so
// GameCover's styling is mapped here by name, same values data.jsx used to
// ship inline. Unknown games fall back to a generic tile.
const GAME_VISUALS = {
  'valorant': { title: 'VALORANT', sub: '', bg: 'linear-gradient(135deg,#ff4655 0%,#7a1a22 100%)', accent: '#0f1923', vibe: 'tactical' },
  'fortnite': { title: 'FORTNITE', sub: '', bg: 'linear-gradient(180deg,#7e3ff2 0%,#1d0a52 100%)', accent: '#00d4ff', vibe: 'storm' },
  'minecraft': { title: 'MINECRAFT', sub: '', bg: 'linear-gradient(180deg,#4a8a3a 0%,#1f4218 100%)', accent: '#9BD66B', vibe: 'pixel' },
  'fifa': { title: 'FIFA', sub: '', bg: 'linear-gradient(160deg,#0a3a1a 0%,#021a0a 100%)', accent: '#4ADE80', vibe: '' },
  'league of legends': { title: 'LEAGUE OF', sub: 'LEGENDS', bg: 'linear-gradient(180deg,#0a3a6e 0%,#020c1f 100%)', accent: '#C8A765', vibe: 'crest' },
  'rocket league': { title: 'ROCKET', sub: 'LEAGUE', bg: 'linear-gradient(135deg,#FF7A18 0%,#1a0a3a 70%,#05010a 100%)', accent: '#3FA8FF', vibe: 'storm' },
  'apex legends': { title: 'APEX', sub: 'LEGENDS', bg: 'linear-gradient(180deg,#c4a014 0%,#1a1408 100%)', accent: '#E8C547', vibe: 'apex' },
  'call of duty': { title: 'WARZONE', sub: 'CALL OF DUTY', bg: 'linear-gradient(160deg,#3a4a3a 0%,#1a201a 60%,#0a0e0a 100%)', accent: '#8FA37A', vibe: 'military' },
};
function visualsFor(name) {
  return GAME_VISUALS[String(name || '').toLowerCase()] || {
    title: String(name || '').toUpperCase(), sub: '',
    bg: 'linear-gradient(160deg,#2a2a3a 0%,#0a0a12 100%)', accent: '#5B5CFF', vibe: '',
  };
}

function normalizeGame(g) {
  if (!g) return null;
  const v = visualsFor(g.name);
  return {
    id: g._id, name: g.name, title: v.title, sub: v.sub, bg: v.bg, accent: v.accent, vibe: v.vibe,
    genre: g.genre, platforms: g.platforms, description: g.description, popularityScore: g.popularityScore,
  };
}
function normalizeUser(u) {
  if (!u) return null;
  return {
    id: u._id, name: u.username, username: u.username, email: u.email,
    role: u.role, platform: u.platform, region: u.region, skillLevel: u.skillLevel,
    favoriteGames: (u.favoriteGames || []).map(idOf),
  };
}
function normalizeSession(s) {
  if (!s) return null;
  return {
    id: s._id, title: s.title, gameId: idOf(s.gameId), hostId: idOf(s.hostId),
    platform: s.platform, region: s.region, mode: s.mode, skillLevel: s.skillLevel,
    description: s.description, maxPlayers: s.maxPlayers,
    members: (s.members || []).map(idOf),
    privacy: s.privacy, status: s.status, startTime: s.startTime,
    createdAt: shortDate(s.createdAt),
  };
}
function normalizePost(p) {
  if (!p) return null;
  return {
    id: p._id, authorId: idOf(p.authorId), sessionId: idOf(p.sessionId),
    content: p.content, likes: p.likes, comments: p.comments, createdAt: shortDate(p.createdAt),
  };
}
function normalizeRequest(r) {
  if (!r) return null;
  return {
    id: r._id, userId: idOf(r.userId), sessionId: idOf(r.sessionId),
    status: r.status, message: r.message, createdAt: shortDate(r.createdAt),
  };
}
function normalizeMessage(m) {
  if (!m) return null;
  return { id: m._id, sessionId: idOf(m.sessionId), senderId: idOf(m.senderId), content: m.content, createdAt: m.createdAt };
}

// ─── Cache sync: keep the global GAMES/USERS/SESSIONS arrays (from
// data.jsx) merged with whatever the backend just returned, so the
// synchronous gameById()/userById()/SESSIONS.find() call sites elsewhere
// in screens.jsx keep resolving correctly without being rewritten. Merge
// (not replace) so a filtered fetch never evicts entries a different
// screen already cached. ──
function upsertById(arr, item) {
  if (!item) return item;
  const idx = arr.findIndex((x) => x.id === item.id);
  if (idx >= 0) arr[idx] = item;
  else arr.push(item);
  return item;
}
function mergeMany(arr, items) {
  items.forEach((item) => upsertById(arr, item));
  return items;
}

const Api = {
  auth: {
    // identifier = email or username; password is required by the real backend
    // (the old mock accepted any password — see auth.jsx for the matching change).
    async login(identifier, password) {
      const data = await request('/auth/login', { method: 'POST', body: { identifier, password } });
      setToken(data.token);
      connectSocket();
      const user = normalizeUser(data.user);
      window.CURRENT_USER_ID = user.id;
      upsertById(USERS, user);
      return user;
    },
    async me() {
      if (!getToken()) return null;
      const data = await request('/auth/me');
      connectSocket();
      const user = normalizeUser(data);
      upsertById(USERS, user);
      return user;
    },
    logout() {
      setToken(null);
      disconnectSocket();
    },
  },

  games: {
    async list({ q } = {}) {
      const qs = q ? `?q=${encodeURIComponent(q)}` : '';
      const data = await request(`/games${qs}`);
      return mergeMany(GAMES, data.map(normalizeGame));
    },
    async get(id) {
      const data = await request(`/games/${id}`);
      return upsertById(GAMES, normalizeGame(data));
    },
    // Catalog management (spec 6.2/11.2) — hosts only, enforced server-side too.
    async create(data) {
      const res = await request('/games', { method: 'POST', body: data });
      return upsertById(GAMES, normalizeGame(res));
    },
    async update(id, patch) {
      const res = await request(`/games/${id}`, { method: 'PUT', body: patch });
      return upsertById(GAMES, normalizeGame(res));
    },
    async remove(id) {
      await request(`/games/${id}`, { method: 'DELETE' });
      const idx = GAMES.findIndex((g) => g.id === id);
      if (idx >= 0) GAMES.splice(idx, 1);
      return true;
    },
  },

  users: {
    async list({ q, region, platform, skillLevel, favoriteGame } = {}) {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (region) params.set('region', region);
      if (platform) params.set('platform', platform);
      if (skillLevel) params.set('skillLevel', skillLevel);
      if (favoriteGame) params.set('favoriteGame', favoriteGame);
      const qs = params.toString() ? `?${params.toString()}` : '';
      const data = await request(`/users${qs}`);
      return mergeMany(USERS, data.map(normalizeUser));
    },
    async get(id) {
      const data = await request(`/users/${id}`);
      return upsertById(USERS, normalizeUser(data));
    },
    // Registration — the "create a user" mock action now means a real account.
    async create(data) {
      const body = {
        username: data.name, email: data.email, password: data.password,
        region: data.region, platform: data.platform, skillLevel: data.skillLevel,
        favoriteGames: data.favoriteGames || [],
      };
      const res = await request('/auth/register', { method: 'POST', body });
      setToken(res.token);
      const user = normalizeUser(res.user);
      window.CURRENT_USER_ID = user.id;
      upsertById(USERS, user);
      return user;
    },
    // Edit Profile (spec 9.14 / 11.1) — persists to MongoDB; own profile only (enforced server-side too).
    async update(id, patch) {
      const res = await request(`/users/${id}`, { method: 'PUT', body: patch });
      return upsertById(USERS, normalizeUser(res));
    },
  },

  sessions: {
    async list({ gameId, platform, region, skillLevel, mode, status, availability } = {}) {
      const params = new URLSearchParams();
      if (gameId) params.set('game', gameId);
      if (platform) params.set('platform', platform);
      if (region) params.set('region', region);
      if (skillLevel) params.set('skillLevel', skillLevel);
      if (mode) params.set('mode', mode);
      if (status) params.set('status', status);
      if (availability) params.set('availability', availability);
      // No filters → the plain list route; otherwise the search route.
      const qs = params.toString();
      const data = await request(qs ? `/sessions/search?${qs}` : '/sessions');
      return mergeMany(SESSIONS, data.map(normalizeSession));
    },
    async get(id) {
      const data = await request(`/sessions/${id}`);
      return upsertById(SESSIONS, normalizeSession(data));
    },
    async create(data) {
      const body = {
        title: data.title, gameId: data.gameId, platform: data.platform, region: data.region,
        mode: data.mode, skillLevel: data.skillLevel, description: data.description,
        maxPlayers: data.maxPlayers, privacy: data.privacy, startTime: data.startTime,
      };
      const res = await request('/sessions', { method: 'POST', body });
      return upsertById(SESSIONS, normalizeSession(res));
    },
    async update(id, patch) {
      const res = await request(`/sessions/${id}`, { method: 'PUT', body: patch });
      return upsertById(SESSIONS, normalizeSession(res));
    },
    async remove(id) {
      await request(`/sessions/${id}`, { method: 'DELETE' });
      const idx = SESSIONS.findIndex((x) => x.id === id);
      if (idx >= 0) SESSIONS.splice(idx, 1);
      return true;
    },
    async join(id) {
      const res = await request(`/sessions/${id}/join`, { method: 'POST' });
      return upsertById(SESSIONS, normalizeSession(res));
    },
    async leave(id) {
      const res = await request(`/sessions/${id}/leave`, { method: 'POST' });
      return upsertById(SESSIONS, normalizeSession(res));
    },
    async removeMember(id, userId) {
      const res = await request(`/sessions/${id}/members/${userId}`, { method: 'DELETE' });
      return upsertById(SESSIONS, normalizeSession(res));
    },
  },

  requests: {
    async listForSession(sessionId) {
      const data = await request(`/requests/session/${sessionId}`);
      return data.map(normalizeRequest);
    },
    // userId kept in the signature for interface parity with the old mock —
    // the backend now derives "my" requests from the JWT, not a client-supplied id.
    async listForUser(userId) {
      const data = await request('/requests/my');
      return data.map(normalizeRequest);
    },
    async create({ sessionId, message }) {
      const res = await request('/requests', { method: 'POST', body: { sessionId, message } });
      return normalizeRequest(res);
    },
    async approve(id) {
      const res = await request(`/requests/${id}/approve`, { method: 'PUT' });
      const sid = idOf(res.sessionId);
      if (sid) Api.sessions.get(sid).catch(() => {}); // refresh the session's member list in the cache
      return normalizeRequest(res);
    },
    async reject(id) {
      const res = await request(`/requests/${id}/reject`, { method: 'PUT' });
      return normalizeRequest(res);
    },
    async remove(id) {
      await request(`/requests/${id}`, { method: 'DELETE' });
      return true;
    },
  },

  posts: {
    async listForSession(sessionId) {
      const data = await request(`/posts?sessionId=${sessionId}`);
      return data.map(normalizePost);
    },
    async listFeedForUser(userId) {
      const data = await request(`/posts?feedFor=${userId}`);
      return data.map(normalizePost);
    },
    async create({ sessionId, content }) {
      const res = await request('/posts', { method: 'POST', body: { sessionId, content } });
      return normalizePost(res);
    },
    async update(id, patch) {
      const res = await request(`/posts/${id}`, { method: 'PUT', body: patch });
      return normalizePost(res);
    },
    async remove(id) {
      await request(`/posts/${id}`, { method: 'DELETE' });
      return true;
    },
  },

  chat: {
    // History still loads over REST/MongoDB (spec 9.13) — sockets only carry live messages.
    async listForSession(sessionId) {
      const data = await request(`/chat/${sessionId}/messages`);
      return data.map(normalizeMessage);
    },
    // Sends over the live Socket.io room when connected (server persists + broadcasts);
    // falls back to the REST endpoint — which also broadcasts — if the socket isn't up.
    async send({ sessionId, content }) {
      const s = connectSocket();
      if (s.connected) {
        s.emit('sendMessage', { sessionId, content });
        return null;
      }
      const res = await request(`/chat/${sessionId}/messages`, { method: 'POST', body: { content } });
      return normalizeMessage(res);
    },
    // Joins the session's chat room and streams incoming messages to onMessage.
    // Returns an unsubscribe function that also leaves the room.
    join(sessionId, onMessage) {
      const s = connectSocket();
      const handler = (msg) => onMessage(normalizeMessage(msg));
      joinedRooms.add(sessionId);
      s.emit('joinRoom', sessionId);
      s.on('receiveMessage', handler);
      return () => {
        joinedRooms.delete(sessionId);
        s.off('receiveMessage', handler);
        s.emit('leaveRoom', sessionId);
      };
    },
  },

  stats: {
    postsPerMonth() {
      return request('/stats/posts-per-month');
    },
    async sessionsPerGame() {
      const data = await request('/stats/sessions-per-game');
      return data.map((d) => ({ gameId: d.gameId, game: d.game ? { title: d.game } : null, count: d.count }));
    },
    usersByPlatform() {
      return request('/stats/users-by-platform');
    },
    requestsByStatus() {
      return request('/stats/requests-by-status');
    },
  },

  // Fetches the public catalogs (games + users) once up front so synchronous
  // lookups (gameById/userById, GAMES.map in RegisterScreen, etc.) have real
  // data before the first meaningful render — see the boot gate in app.jsx.
  async bootstrap() {
    await Promise.all([Api.games.list({}), Api.users.list({})]);
  },
};
window.Api = Api;

// Tiny hook so screens can consume the async Api without hand-rolling
// loading state every time: const { data, loading } = useApi(() => Api.games.list(), [q])
function useApi(fetcher, deps) {
  const [state, setState] = React.useState({ data: null, loading: true });
  React.useEffect(() => {
    let alive = true;
    setState((s) => ({ data: s.data, loading: true }));
    fetcher().then((data) => { if (alive) setState({ data, loading: false }); });
    return () => { alive = false; };
    // eslint-disable-next-line
  }, deps);
  return state;
}
window.useApi = useApi;
