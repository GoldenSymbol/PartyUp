// PartyUp — main app + tiny stack router

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#5B5CFF",
  "bg": "#0E1A3A",
  "showFlag": true,
  "density": "comfortable"
}/*EDITMODE-END*/;

const FavCtx = React.createContext({ favGames: [], toggleFavGame: () => {} });
window.FavCtx = FavCtx;

// ─── Web layout shell ────────────────────────────────────────────────
// Default render mode: a normal, responsive, centered web app container.
// No iOS bezel / status bar / dynamic island / home indicator — same
// screens, same nav, same data layer, just without the phone frame.
function WebShell({ bg, children }) {
  return (
    <div style={{
      position: 'relative', width: '100%', maxWidth: 1160, minHeight: '100vh',
      overflow: 'hidden', background: bg,
    }}>
      {children}
    </div>
  );
}
window.WebShell = WebShell;

// Logged-in demo user — switched by LoginScreen via Api.auth.login()
const UserCtx = React.createContext({ userId: 'menalu', user: null, setUserId: () => {} });
window.UserCtx = UserCtx;

function App() {
  const [t, setTweak] = useTweaks(DEFAULTS);
  // Override theme tokens live
  React.useEffect(() => {
    window.TH.accent = t.accent;
    window.TH.bg = t.bg;
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.accent, t.bg]);

  // Logged-in user — drives host/regular permissions across session screens
  const [userId, setUserIdState] = React.useState(window.CURRENT_USER_ID || 'menalu');
  const setUserId = React.useCallback((id) => { window.CURRENT_USER_ID = id; setUserIdState(id); }, []);
  const userCtxValue = React.useMemo(() => ({ userId, user: userById(userId), setUserId }), [userId]);

  // Favorite games — global app state, seeded from the logged-in user's profile
  const [favGames, setFavGames] = React.useState(() => [...(userById(userId)?.favoriteGames || [])]);
  const toggleFavGame = React.useCallback((id) => {
    setFavGames(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }, []);
  const favCtxValue = React.useMemo(() => ({ favGames, toggleFavGame }), [favGames, toggleFavGame]);

  // Stack-based router. Tab routes (search/profile/recent/fav) replace the bottom of the stack.
  const [stack, setStack] = React.useState([{ route: 'login', state: {} }]);
  // Track navigation direction for animation: 'push' (slide right→left), 'pop' (slide left→right), 'tab' (fade up)
  const [navDir, setNavDir] = React.useState('tab');
  const top = stack[stack.length - 1];

  const nav = React.useMemo(() => ({
    push: (route, state = {}) => { setNavDir('push'); setStack(s => [...s, { route, state }]); },
    pop:  () => setStack(s => { if (s.length > 1) { setNavDir('pop'); return s.slice(0, -1); } return s; }),
    reset: (route, state = {}) => { setNavDir('tab'); setStack([{ route, state }]); },
  }), []);

  const onTab = (id) => {
    if (id === 'search')  nav.reset('search');
    if (id === 'profile') nav.reset('profile');
    if (id === 'recent')  nav.reset('recent');
    if (id === 'fav')     nav.reset('fav');
  };

  // Map route → tab id (for highlighting)
  const tabFor = (r) => {
    if (['search','console','sessions','sessiondetail','joined','create','hostlive','mysessions','stats'].includes(r)) return 'search';
    return r === 'fav' ? 'fav' : r;
  };

  const screen = (() => {
    switch (top.route) {
      case 'login':         return <LoginScreen        nav={nav} />;
      case 'register':      return <RegisterScreen     nav={nav} />;
      case 'search':        return <SearchScreen       nav={nav} state={top.state} />;
      case 'console':       return <ConsoleScreen      nav={nav} state={top.state} />;
      case 'sessions':      return <SessionsListScreen nav={nav} state={top.state} />;
      case 'sessiondetail': return <SessionDetailScreen nav={nav} state={top.state} />;
      case 'joined':        return <JoinedScreen       nav={nav} state={top.state} />;
      case 'create':        return <CreateScreen       nav={nav} state={top.state} />;
      case 'hostlive':      return <HostLiveScreen     nav={nav} state={top.state} />;
      case 'profile':       return <MyProfileScreen    nav={nav} />;
      case 'recent':        return <RecentScreen       nav={nav} />;
      case 'fav':           return <FavoritesScreen    nav={nav} />;
      case 'mysessions':    return <MySessionsScreen   nav={nav} />;
      case 'stats':         return <StatsDashboardScreen nav={nav} />;
      default: return null;
    }
  })();

  return (
    <UserCtx.Provider value={userCtxValue}>
    <FavCtx.Provider value={favCtxValue}>
    <div style={{
      minHeight:'100vh', display:'flex', justifyContent:'center',
      background:`radial-gradient(circle at 30% 0%, #1a2a6e 0%, #0a0e1f 70%)`,
    }}>
      <WebShell bg={t.bg}>
        <div style={{position:'absolute', inset:0, background: t.bg, zIndex:-1}}/>
        <div style={{position:'absolute', inset:0, background: t.bg}}>
          {/* The screen, animated on stack change */}
          <div key={stack.length+':'+top.route} style={{
            position:'absolute', inset:0,
            animation: (navDir === 'push'  ? 'slideIn'     : navDir === 'pop' ? 'slideInBack' : 'tabSwap')
                       + ' .32s cubic-bezier(.2,.7,.2,1)',
            // NB: no fill-mode → transform reverts after animation so picker stacking-context is not trapped
          }}>
            {screen}
          </div>
          {!['login','register'].includes(top.route) && (
            <BottomNav active={tabFor(top.route)} onNav={onTab} />
          )}
        </div>
      </WebShell>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Theme">
          <TweakColor label="Accent" value={t.accent} onChange={v=>setTweak('accent', v)}
            options={['#5B5CFF','#FF4757','#3FD16A','#FFB13A','#E347FF']}/>
          <TweakColor label="Background" value={t.bg} onChange={v=>setTweak('bg', v)}
            options={['#0E1A3A','#0A0A12','#1B0E2E','#0E2A2A']}/>
        </TweakSection>
        <TweakSection title="Quick navigation">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
            <button onClick={()=>nav.reset('login')} style={tbtn}>Login</button>
            <button onClick={()=>nav.reset('register')} style={tbtn}>Register</button>
            <button onClick={()=>nav.reset('search')} style={tbtn}>Search</button>
            <button onClick={()=>nav.push('console',{gameId:'valorant'})} style={tbtn}>Game · Valorant</button>
            <button onClick={()=>nav.push('sessions',{gameId:'valorant'})} style={tbtn}>Sessions list</button>
            <button onClick={()=>nav.push('sessiondetail',{sessionId:'s1'})} style={tbtn}>Session details</button>
            <button onClick={()=>nav.push('create',{gameId:'valorant'})} style={tbtn}>Create session</button>
            <button onClick={()=>nav.push('hostlive',{sessionId:'s1'})} style={tbtn}>Manage (host)</button>
            <button onClick={()=>nav.reset('mysessions')} style={tbtn}>My sessions</button>
            <button onClick={()=>nav.reset('stats')} style={tbtn}>Statistics</button>
            <button onClick={()=>nav.reset('profile')} style={tbtn}>My profile</button>
            <button onClick={()=>nav.push('joined',{sessionId:'s2'})} style={tbtn}>Joined ✓</button>
          </div>
        </TweakSection>
        <TweakSection title="Demo login as">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
            {USERS.map(u => (
              <button key={u.id} onClick={()=>{ setUserId(u.id); nav.reset('search'); }} style={tbtn}>
                {u.name} {u.role === 'host' ? '(host)' : ''}
              </button>
            ))}
          </div>
        </TweakSection>
      </TweaksPanel>
    </div>
    </FavCtx.Provider>
    </UserCtx.Provider>
  );
}

const tbtn = {
  background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)',
  color:'#fff', padding:'8px 10px', borderRadius:8, fontSize:12, cursor:'pointer',
  fontFamily:'inherit', textAlign:'left',
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
