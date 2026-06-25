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
// Auth screens (login/register) render full-bleed on the page background
// with no header/sidebar chrome, capped at a normal "login page" width.
function WebShell({ bg, maxWidth = 1200, children }) {
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: bg }}>
      <div style={{ position: 'relative', width: '100%', maxWidth, margin: '0 auto', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
}
window.WebShell = WebShell;

// Logged-in demo user — switched by LoginScreen via Api.auth.login()
const UserCtx = React.createContext({ userId: 'menalu', user: null, setUserId: () => {} });
window.UserCtx = UserCtx;

// ─── Desktop dashboard shell — header + sidebar + main content ───────
// This is the default layout once a user is logged in: a fixed left
// sidebar for primary navigation, a top header with brand + the
// logged-in user, and a main content area that the active screen
// renders into. Below ~900px wide the sidebar/header hide and the
// existing mobile BottomNav takes over (see .pu-sidebar/.pu-mobilenav
// in PartyUp.html), so the same markup works for both.
const EXTRA_NAV_ITEMS = [
{ id: 'mysessions', label: 'My Sessions', icon: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="3.5" stroke={c} strokeWidth="1.8" /><circle cx="17" cy="10" r="2.5" stroke={c} strokeWidth="1.8" /><path d="M3 19c1-3 3.3-4.5 6-4.5s5 1.5 6 4.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg> },
{ id: 'stats', label: 'Statistics', icon: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M4 20V10M11 20V4M18 20v-7" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg> }];


function Sidebar({ active, onNav }) {
  const rowStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: 12, width: '100%',
    background: isActive ? 'rgba(91,92,255,0.16)' : 'transparent',
    border: 'none', borderRadius: 12, padding: '11px 14px', cursor: 'pointer',
    color: isActive ? '#fff' : TH.dim, fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
    textAlign: 'left', transition: 'background .15s, color .15s'
  });
  return (
    <div className="pu-sidebar" style={{
      /* no inline `display` — the .pu-sidebar class owns show/hide per breakpoint
         in PartyUp.html; an inline display value would always win over the
         media query and defeat the mobile/desktop toggle. */
      width: 240, flexShrink: 0, minHeight: '100vh', flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.06)', padding: '20px 14px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px 22px' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(140deg,#5B5CFF 0%,#7B5CFF 60%,#FF4DBF 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6.5 8h11c2 0 3.5 1.7 3.5 3.7L20 16c-.2 1.5-1.5 2.5-3 2.5-1 0-1.9-.6-2.4-1.5l-.6-1.2H10l-.6 1.2c-.5.9-1.4 1.5-2.4 1.5-1.5 0-2.8-1-3-2.5L3 11.7C3 9.7 4.5 8 6.5 8z" stroke="#fff" strokeWidth="1.8" />
          </svg>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>Party<span style={{ color: TH.accent }}>Up</span></div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map((it) => (
          <button key={it.id} onClick={() => onNav(it.id)} style={rowStyle(active === it.id)}>
            {it.icon(20, active === it.id ? '#fff' : TH.dim)}
            {it.label}
          </button>
        ))}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '10px 4px' }} />
        {EXTRA_NAV_ITEMS.map((it) => (
          <button key={it.id} onClick={() => onNav(it.id)} style={rowStyle(active === it.id)}>
            {it.icon(20, active === it.id ? '#fff' : TH.dim)}
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TopHeader({ user }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0
    }}>
      <div className="pu-header-brand" style={{ fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
        Party<span style={{ color: TH.accent }}>Up</span>
      </div>
      {user &&
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{user.name}</div>
          <div style={{ color: TH.dim, fontSize: 11 }}>{user.role === 'host' ? 'Host' : 'Player'} · {user.platform}</div>
        </div>
        <Avatar name={user.name} size={36} />
      </div>
      }
    </div>);

}

function DesktopShell({ bg, user, active, onNav, routeKey, animation, showMobileNav, children }) {
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: bg, display: 'flex' }}>
      <Sidebar active={active} onNav={onNav} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <TopHeader user={user} />
        <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
          <div key={routeKey} style={{ position: 'absolute', inset: 0, animation }}>
            {children}
          </div>
          {showMobileNav &&
          <div className="pu-mobilenav">
            <BottomNav active={active} onNav={onNav} />
          </div>
          }
        </div>
      </div>
    </div>
  );
}
window.DesktopShell = DesktopShell;

function App() {
  const [t, setTweak] = useTweaks(DEFAULTS);
  // Override theme tokens live
  React.useEffect(() => {
    window.TH.accent = t.accent;
    window.TH.bg = t.bg;
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.accent, t.bg]);

  // Boot gate — fetch the public games+users catalogs once before the first
  // real render, so synchronous lookups elsewhere (gameById/userById, the
  // GAMES.map in RegisterScreen, etc.) never see stale/empty data on first paint.
  const [booted, setBooted] = React.useState(false);
  React.useEffect(() => {
    Api.bootstrap()
      .catch((err) => console.error('[bootstrap] failed to reach the API server', err))
      .finally(() => setBooted(true));
  }, []);

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

  // All sidebar/bottom-nav destinations are top-level routes — just reset the stack to them.
  const onTab = (id) => nav.reset(id);

  // Map route → nav id (for highlighting). The session-creation/browsing flow
  // is reached from Search, so it stays grouped under the Search tab; My
  // Sessions and Statistics are their own top-level sidebar destinations.
  const tabFor = (r) => {
    if (['search','console','sessions','sessiondetail','joined','create','hostlive'].includes(r)) return 'search';
    return r;
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

  const isAuthRoute = ['login', 'register'].includes(top.route);
  const animation = (navDir === 'push' ? 'slideIn' : navDir === 'pop' ? 'slideInBack' : 'tabSwap') + ' .32s cubic-bezier(.2,.7,.2,1)';
  // NB: no fill-mode → transform reverts after animation so picker stacking-context is not trapped

  if (!booted) {
    return (
      <div style={{
        width: '100%', minHeight: '100vh', background: t.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontFamily: 'inherit', fontSize: 15,
      }}>
        Loading PartyUp…
      </div>
    );
  }

  return (
    <UserCtx.Provider value={userCtxValue}>
    <FavCtx.Provider value={favCtxValue}>
    {isAuthRoute ? (
      <WebShell bg={t.bg} maxWidth={460}>
        <div key={stack.length+':'+top.route} style={{ position:'absolute', inset:0, animation }}>
          {screen}
        </div>
      </WebShell>
    ) : (
      <DesktopShell
        bg={t.bg}
        user={userCtxValue.user}
        active={tabFor(top.route)}
        onNav={onTab}
        routeKey={stack.length+':'+top.route}
        animation={animation}
        showMobileNav>
        {screen}
      </DesktopShell>
    )}

    <TweaksPanel title="Tweaks">
        <TweakSection title="Theme">
          <TweakColor label="Accent" value={t.accent} onChange={v=>setTweak('accent', v)}
            options={['#5B5CFF','#FF4757','#3FD16A','#FFB13A','#E347FF']}/>
          <TweakColor label="Background" value={t.bg} onChange={v=>setTweak('bg', v)}
            options={['#0E1A3A','#0A0A12','#1B0E2E','#0E2A2A']}/>
        </TweakSection>
        <TweakSection title="Quick navigation">
          {/* NB: no hardcoded game/session ids here anymore — those were mock
              ids (e.g. 'valorant', 's1') that don't exist in the real backend's
              MongoDB collections. Navigate via Search → a real game/session instead. */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
            <button onClick={()=>nav.reset('login')} style={tbtn}>Login</button>
            <button onClick={()=>nav.reset('register')} style={tbtn}>Register</button>
            <button onClick={()=>nav.reset('search')} style={tbtn}>Search</button>
            <button onClick={()=>nav.push('sessions',{})} style={tbtn}>Sessions list</button>
            <button onClick={()=>nav.reset('mysessions')} style={tbtn}>My sessions</button>
            <button onClick={()=>nav.reset('stats')} style={tbtn}>Statistics</button>
            <button onClick={()=>nav.reset('profile')} style={tbtn}>My profile</button>
          </div>
        </TweakSection>
      </TweaksPanel>
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
