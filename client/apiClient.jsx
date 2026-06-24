// ════════════════════════════════════════════════════════════════════
// apiClient — single chokepoint for all "server" data access.
// Everything here is mocked against the in-memory arrays from data.jsx,
// but every call returns a Promise so screens already talk to it the
// same way they will talk to the real Node/Express/MongoDB API later
// (see Docs/PartyUp Project Specification.pdf section 23 for the
// matching REST endpoint list this mirrors).
// ════════════════════════════════════════════════════════════════════

function apiDelay(value, ms = 80) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function nextId(prefix, list) {
  return prefix + (list.reduce((max, x) => Math.max(max, parseInt(String(x.id).replace(/\D/g, ''), 10) || 0), 0) + 1);
}

function sessionWithStatus(s) {
  return { ...s, status: s.members.length >= s.maxPlayers ? 'full' : s.status };
}

const Api = {
  auth: {
    // Demo "login" — resolves an identifier (email or username) to one of
    // the seeded demo users; falls back to Menalu (the regular-user demo account).
    login(identifier) {
      const handle = String(identifier || '').split('@')[0].trim().toLowerCase();
      const match = USERS.find((u) => u.name.toLowerCase() === handle || u.id === handle);
      window.CURRENT_USER_ID = match ? match.id : 'menalu';
      return apiDelay(userById(window.CURRENT_USER_ID));
    },
    me() {
      return apiDelay(userById(window.CURRENT_USER_ID));
    },
  },

  games: {
    // Uses jQuery's $.ajax to GET the games catalog (spec section 20 — "Loading games list").
    // games.json today is a static file standing in for the future GET /api/games endpoint;
    // falls back to the in-memory seed if the request fails (e.g. opened without a dev server).
    list({ q } = {}) {
      const term = (q || '').toLowerCase();
      const filterAndWrap = (list) => apiDelay(list.filter((g) => !term || (g.title + ' ' + g.sub).toLowerCase().includes(term)));
      if (typeof $ === 'undefined') return filterAndWrap(GAMES);
      return new Promise((resolve) => {
        $.ajax({ url: 'games.json', dataType: 'json', method: 'GET' })
          .done((data) => filterAndWrap(data).then(resolve))
          .fail(() => filterAndWrap(GAMES).then(resolve));
      });
    },
    get(id) {
      return apiDelay(gameById(id));
    },
  },

  users: {
    list({ q, region, platform, skillLevel, favoriteGame } = {}) {
      const term = (q || '').toLowerCase();
      const result = USERS.filter((u) =>
        (!term || u.name.toLowerCase().includes(term)) &&
        (!region || u.region === region) &&
        (!platform || u.platform === platform) &&
        (!skillLevel || u.skillLevel === skillLevel) &&
        (!favoriteGame || u.favoriteGames.includes(favoriteGame))
      );
      return apiDelay(result);
    },
    get(id) {
      return apiDelay(userById(id));
    },
    create(data) {
      const user = {
        id: nextId('u', USERS).toLowerCase(),
        name: data.name,
        role: 'regular',
        platform: data.platform,
        region: data.region,
        skillLevel: data.skillLevel,
        favoriteGames: data.favoriteGames || [],
      };
      USERS.push(user);
      return apiDelay(user);
    },
  },

  sessions: {
    list({ gameId, platform, region, skillLevel, mode, availability } = {}) {
      const result = SESSIONS.filter((s) =>
        (!gameId || s.gameId === gameId) &&
        (!platform || s.platform === platform) &&
        (!region || s.region === region) &&
        (!skillLevel || s.skillLevel === skillLevel) &&
        (!mode || s.mode === mode) &&
        (!availability || availability === 'any' || (availability === 'open' ? s.members.length < s.maxPlayers : true))
      ).map(sessionWithStatus);
      return apiDelay(result);
    },
    get(id) {
      const s = SESSIONS.find((x) => x.id === id);
      return apiDelay(s ? sessionWithStatus(s) : null);
    },
    create(data) {
      const session = {
        id: nextId('s', SESSIONS),
        title: data.title,
        gameId: data.gameId,
        hostId: window.CURRENT_USER_ID,
        platform: data.platform,
        region: data.region,
        mode: data.mode,
        skillLevel: data.skillLevel,
        description: data.description || '',
        maxPlayers: data.maxPlayers,
        members: [window.CURRENT_USER_ID],
        privacy: data.privacy,
        status: 'open',
        startTime: data.startTime || 'Flexible',
        createdAt: new Date().toISOString().slice(0, 10),
      };
      SESSIONS.unshift(session);
      return apiDelay(session);
    },
    update(id, patch) {
      const s = SESSIONS.find((x) => x.id === id);
      if (s) Object.assign(s, patch);
      return apiDelay(s);
    },
    remove(id) {
      const idx = SESSIONS.findIndex((x) => x.id === id);
      if (idx >= 0) SESSIONS.splice(idx, 1);
      return apiDelay(true);
    },
    // Public sessions join instantly; private sessions go through requests.create() instead.
    join(id) {
      const s = SESSIONS.find((x) => x.id === id);
      if (s && !s.members.includes(window.CURRENT_USER_ID) && s.members.length < s.maxPlayers) {
        s.members.push(window.CURRENT_USER_ID);
      }
      return apiDelay(s ? sessionWithStatus(s) : null);
    },
    leave(id) {
      const s = SESSIONS.find((x) => x.id === id);
      if (s) s.members = s.members.filter((m) => m !== window.CURRENT_USER_ID);
      return apiDelay(s ? sessionWithStatus(s) : null);
    },
    removeMember(id, userId) {
      const s = SESSIONS.find((x) => x.id === id);
      if (s) s.members = s.members.filter((m) => m !== userId);
      return apiDelay(s ? sessionWithStatus(s) : null);
    },
  },

  requests: {
    listForSession(sessionId) {
      return apiDelay(JOIN_REQUESTS.filter((r) => r.sessionId === sessionId));
    },
    listForUser(userId) {
      return apiDelay(JOIN_REQUESTS.filter((r) => r.userId === userId));
    },
    create({ sessionId, message }) {
      const existing = JOIN_REQUESTS.find((r) => r.sessionId === sessionId && r.userId === window.CURRENT_USER_ID && r.status === 'pending');
      if (existing) return apiDelay(existing);
      const req = { id: nextId('jr', JOIN_REQUESTS), userId: window.CURRENT_USER_ID, sessionId, status: 'pending', message: message || '', createdAt: new Date().toISOString().slice(0, 10) };
      JOIN_REQUESTS.unshift(req);
      return apiDelay(req);
    },
    approve(id) {
      const r = JOIN_REQUESTS.find((x) => x.id === id);
      if (r) {
        r.status = 'approved';
        const s = SESSIONS.find((x) => x.id === r.sessionId);
        if (s && !s.members.includes(r.userId)) s.members.push(r.userId);
      }
      return apiDelay(r);
    },
    reject(id) {
      const r = JOIN_REQUESTS.find((x) => x.id === id);
      if (r) r.status = 'rejected';
      return apiDelay(r);
    },
    remove(id) {
      const idx = JOIN_REQUESTS.findIndex((x) => x.id === id);
      if (idx >= 0) JOIN_REQUESTS.splice(idx, 1);
      return apiDelay(true);
    },
  },

  posts: {
    listForSession(sessionId) {
      return apiDelay(POSTS.filter((p) => p.sessionId === sessionId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    },
    // Home feed: posts from sessions the user joined, plus posts about their favorite games.
    listFeedForUser(userId) {
      const user = userById(userId);
      const mySessionIds = SESSIONS.filter((s) => s.members.includes(userId)).map((s) => s.id);
      const result = POSTS.filter((p) => {
        const session = SESSIONS.find((s) => s.id === p.sessionId);
        if (!session) return false;
        const aboutFavoriteGame = user && user.favoriteGames.includes(session.gameId);
        return mySessionIds.includes(p.sessionId) || session.privacy === 'public' || aboutFavoriteGame;
      }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return apiDelay(result);
    },
    create({ sessionId, content }) {
      const post = { id: nextId('p', POSTS), authorId: window.CURRENT_USER_ID, sessionId, content, likes: 0, comments: 0, createdAt: new Date().toISOString().slice(0, 10) };
      POSTS.unshift(post);
      return apiDelay(post);
    },
    update(id, patch) {
      const p = POSTS.find((x) => x.id === id);
      if (p && p.authorId === window.CURRENT_USER_ID) Object.assign(p, patch);
      return apiDelay(p);
    },
    remove(id) {
      const idx = POSTS.findIndex((x) => x.id === id && x.authorId === window.CURRENT_USER_ID);
      if (idx >= 0) POSTS.splice(idx, 1);
      return apiDelay(true);
    },
  },

  chat: {
    listForSession(sessionId) {
      return apiDelay(CHAT_MESSAGES.filter((m) => m.sessionId === sessionId).sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
    },
    send({ sessionId, content }) {
      const msg = { id: nextId('m', CHAT_MESSAGES), sessionId, senderId: window.CURRENT_USER_ID, content, createdAt: new Date().toISOString() };
      CHAT_MESSAGES.push(msg);
      return apiDelay(msg, 30);
    },
  },

  stats: {
    postsPerMonth() {
      const byMonth = {};
      POSTS.forEach((p) => {
        const key = p.createdAt.slice(0, 7);
        byMonth[key] = (byMonth[key] || 0) + 1;
      });
      return apiDelay(Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b)).map(([month, count]) => ({ month, count })));
    },
    sessionsPerGame() {
      const byGame = {};
      SESSIONS.forEach((s) => { byGame[s.gameId] = (byGame[s.gameId] || 0) + 1; });
      return apiDelay(Object.entries(byGame).map(([gameId, count]) => ({ gameId, game: gameById(gameId), count })).sort((a, b) => b.count - a.count));
    },
    usersByPlatform() {
      const byPlatform = {};
      USERS.forEach((u) => { byPlatform[u.platform] = (byPlatform[u.platform] || 0) + 1; });
      return apiDelay(Object.entries(byPlatform).map(([platform, count]) => ({ platform, count })));
    },
    requestsByStatus() {
      const byStatus = { pending: 0, approved: 0, rejected: 0 };
      JOIN_REQUESTS.forEach((r) => { byStatus[r.status] = (byStatus[r.status] || 0) + 1; });
      return apiDelay(Object.entries(byStatus).map(([status, count]) => ({ status, count })));
    },
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
