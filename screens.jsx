// Screen components for PartyUp. Receives { nav, state, dispatch, theme } props.

const TH = {
  bg: '#0E1A3A',
  bgDeep: '#0A1430',
  card: 'rgba(255,255,255,0.04)',
  cardHi: 'rgba(255,255,255,0.08)',
  text: '#FFFFFF',
  dim: 'rgba(255,255,255,0.6)',
  dim2: 'rgba(255,255,255,0.4)',
  accent: '#5B5CFF',
  accent2: '#7B7CFF',
  green: '#3FD16A',
  star: '#FFD43A'
};
window.TH = TH;

// ─── Bottom nav ─────────────────────────────────────────────────────
function BottomNav({ active, onNav }) {
  const items = [
  { id: 'profile', label: 'Profile', icon: Ico.profile, iconActive: Ico.profileFill },
  { id: 'recent', label: 'Recent', icon: Ico.recent, iconActive: Ico.recent },
  { id: 'fav', label: 'Favorite', icon: Ico.star, iconActive: Ico.starFill },
  { id: 'search', label: 'Search', icon: Ico.search, iconActive: Ico.search }];

  const activeIdx = Math.max(0, items.findIndex((i) => i.id === active));
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 38, paddingTop: 14,
      background: 'linear-gradient(180deg,rgba(14,26,58,0) 0%,#0E1A3A 35%)',
      zIndex: 40
    }}>
      <div style={{
        position: 'relative',
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)'
      }}>
        {items.map((it, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button key={it.id} onClick={() => onNav(it.id)} style={{
              background: 'none', border: 'none', padding: '8px 0', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                opacity: isActive ? 1 : 0.55,
                transform: isActive ? 'translateY(-2px) scale(1.08)' : 'translateY(0) scale(1)',
                transition: 'opacity .3s ease, transform .35s cubic-bezier(.5,1.4,.5,1)'
              }}>
                {isActive ? it.iconActive(26, it.id === 'fav' ? TH.star : '#fff') : it.icon(26, '#fff')}
              </div>
            </button>);

        })}
        {/* Sliding indicator — moves smoothly between active tabs */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: 'calc(100% / 4)',
          display: 'flex', justifyContent: 'center', pointerEvents: 'none',
          transform: `translateX(${activeIdx * 100}%)`,
          transition: 'transform .42s cubic-bezier(.5,1.4,.5,1)'
        }}>
          <div style={{
            width: 24, height: 3, borderRadius: 2,
            background: active === 'fav' ? TH.star : '#fff',
            transition: 'background .25s ease',
            boxShadow: active === 'fav' ? '0 0 10px rgba(255,212,58,0.6)' : '0 0 8px rgba(255,255,255,0.3)'
          }} />
        </div>
      </div>
    </div>);

}
window.BottomNav = BottomNav;

// ─── Reusable header back ───────────────────────────────────────────
function BackBtn({ onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', cursor: 'pointer',
      width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
      ...style
    }}>{Ico.back(26, '#fff')}</button>);

}
window.BackBtn = BackBtn;

// ─── Scrollable content wrapper (leaves space for bottom nav) ───────
function ScreenScroll({ children, style = {} }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, paddingTop: 54, paddingBottom: 96,
      overflow: 'auto', ...style
    }}>{children}</div>);

}
window.ScreenScroll = ScreenScroll;

// ─── Page transition wrapper ────────────────────────────────────────
function Slide({ k, children }) {
  return (
    <div key={k} style={{
      position: 'absolute', inset: 0, animation: 'slideIn .32s cubic-bezier(.2,.7,.2,1) both'
    }}>{children}</div>);

}
window.Slide = Slide;

// ════════════════════════════════════════════════════════════════════
// SEARCH (home)
// ════════════════════════════════════════════════════════════════════
function SearchScreen({ nav }) {
  const [q, setQ] = React.useState('');
  const filtered = GAMES.filter((g) => (g.title + ' ' + g.sub).toLowerCase().includes(q.toLowerCase()));
  return (
    <ScreenScroll>
      <div style={{ padding: '24px 26px 16px' }}>
        <h1 style={{
          fontSize: 36, fontWeight: 600, color: TH.text, margin: '8px 0 28px',
          lineHeight: 1.1, letterSpacing: '-0.02em'
        }}>What are you<br />playing today?</h1>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
          background: '#fff', borderRadius: 99, boxShadow: '0 6px 24px rgba(0,0,0,0.25)'
        }}>
          {Ico.search(20, '#333')}
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search games"
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 16,
              background: 'transparent', color: '#111',
              fontFamily: '-apple-system,system-ui,sans-serif'
            }} />
          
        </div>
        <div style={{ marginTop: 30, fontSize: 18, fontWeight: 600, color: TH.text }}>
          {q ? `Results (${filtered.length})` : 'Popular games'}
        </div>
        <div style={{
          marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10
        }}>
          {filtered.slice(0, 12).map((g) =>
          <button key={g.id} onClick={() => nav.push('console', { gameId: g.id })} className="game-tile">
              <GameCover game={g} aspect="1" />
            </button>
          )}
          {filtered.length === 0 &&
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: TH.dim, padding: '40px 0' }}>
              No games match “{q}”
            </div>
          }
        </div>
      </div>
    </ScreenScroll>);

}
window.SearchScreen = SearchScreen;

// ════════════════════════════════════════════════════════════════════
// CONSOLE — selected game; choose Host or Join
// ════════════════════════════════════════════════════════════════════
function ConsoleScreen({ nav, state }) {
  const game = gameById(state.gameId);
  const { favGames, toggleFavGame } = React.useContext(window.FavCtx);
  const isFav = favGames.includes(game.id);
  const MODES = ['Ranked', 'Casual'];
  const REGIONS = ['EU West', 'EU East', 'NA East', 'NA West', 'SA', 'Asia', 'OCE'];
  const [mode, setMode] = React.useState('Ranked');
  const [region, setRegion] = React.useState('EU West');
  const [picker, setPicker] = React.useState(null); // 'mode' | 'region' | null

  // Deterministic lobby count from (game, mode, region) so it feels real
  const lobbies = React.useMemo(() => {
    const key = game.id + '|' + mode + '|' + region;
    let h = 0;for (let i = 0; i < key.length; i++) h = h * 131 + key.charCodeAt(i) >>> 0;
    // baseline by mode (Practice/Custom rarer)
    const base = mode === 'Casual' ? 220 : 140;
    // region multiplier
    const regMul = { 'EU West': 1.1, 'EU East': 0.7, 'NA East': 1.2, 'NA West': 0.95, 'SA': 0.55, 'Asia': 1.35, 'OCE': 0.35 }[region] || 1;
    return Math.max(3, Math.round(base * regMul + h % 40 - 20));
  }, [game.id, mode, region]);

  const players = React.useMemo(() => Math.round(lobbies * 17 + (mode === 'Casual' ? 500 : 200)).toLocaleString(), [lobbies, mode]);

  return (
    <ScreenScroll style={{ paddingTop: 50 }}>
      <div style={{ padding: '4px 18px 0' }}>
        <BackBtn onClick={() => nav.pop()} style={{ marginLeft: -8 }} />
      </div>
      <div style={{ padding: '10px 26px 24px' }}>
        <div style={{
          borderRadius: 18, overflow: 'hidden',
          boxShadow: '0 24px 50px -16px rgba(0,0,0,0.6), 0 8px 22px -8px rgba(0,0,0,0.35)'
        }}>
          <div style={{ height: 218.75 }}>
            <GameCover game={game} size="xl" radius={18} aspect="auto" />
          </div>
        </div>
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: TH.text, letterSpacing: '-0.01em' }}>
              {game.sub ? game.sub + ' ' : ''}{game.title}
            </div>
            <div style={{ color: TH.dim, fontSize: 14, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: TH.green }} />
              <span>{players} players online</span>
            </div>
          </div>
          <button
            onClick={() => toggleFavGame(game.id)}
            aria-pressed={isFav}
            style={{
              background: isFav ? 'rgba(255,212,58,0.16)' : TH.card,
              border: '1px solid ' + (isFav ? 'rgba(255,212,58,0.4)' : 'rgba(255,255,255,0.08)'),
              borderRadius: 99,
              width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all .18s'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            
            {isFav ? Ico.starFill(20) : Ico.star(20, '#fff', 'none')}
          </button>
        </div>

        <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={() => nav.push('hostjoin', { gameId: game.id, intent: 'join', mode, region })} style={{
            background: TH.accent, border: 'none', borderRadius: 16, color: '#fff',
            padding: '18px', fontSize: 17, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 10px 30px rgba(91,92,255,0.35)',
            fontFamily: 'inherit'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {Ico.users(22, '#fff')} Join a game
            </span>
            {Ico.chevron(20, '#fff')}
          </button>
          <button onClick={() => nav.push('create', { gameId: game.id, mode, region })} style={{
            background: 'transparent', border: '1.5px solid rgba(255,255,255,0.18)', borderRadius: 16, color: '#fff',
            padding: '18px', fontSize: 17, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: 'inherit'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {Ico.plus(22, '#fff')} Host a game
            </span>
            {Ico.chevron(20, '#fff')}
          </button>
        </div>

        {/* meta — Mode + Region are pickers; Open updates live */}
        <div style={{
          marginTop: 26, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', textAlign: 'center', gap: 2
        }}>
          <MetaCell label="Mode" value={mode} onClick={() => setPicker('mode')} editable />
          <MetaCell label="Region" value={region} onClick={() => setPicker('region')} editable />
          <MetaCell label="Open" value={
          <span><span style={{ transition: 'opacity .2s' }} key={lobbies}>{lobbies}</span>
              <span style={{ color: TH.dim, fontWeight: 500, fontSize: 12, marginLeft: 4 }}>lobbies</span></span>
          } />
        </div>
      </div>

      {picker &&
      <PickerSheet
        title={picker === 'mode' ? 'Game mode' : 'Region'}
        options={picker === 'mode' ? MODES : REGIONS}
        value={picker === 'mode' ? mode : region}
        onPick={(v) => {picker === 'mode' ? setMode(v) : setRegion(v);setPicker(null);}}
        onClose={() => setPicker(null)} />

      }
    </ScreenScroll>);

}
window.ConsoleScreen = ConsoleScreen;

function MetaCell({ label, value, onClick, editable, bordered }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      disabled={!editable}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: !editable ? 'transparent' :
        hover ? 'rgba(91,92,255,0.18)' : 'rgba(255,255,255,0.04)',
        border: editable ? '1px solid ' + (hover ? 'rgba(91,92,255,0.5)' : 'rgba(255,255,255,0.08)') : 'none',
        cursor: editable ? 'pointer' : 'default',
        padding: '10px 6px', margin: 2, borderRadius: 10,
        fontFamily: 'inherit', transition: 'background .15s, border-color .15s'
      }}>
      <div style={{ color: TH.dim, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{
        color: '#fff', fontWeight: 600, marginTop: 4,
        display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 14
      }}>
        {value}
        {editable &&
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.7, marginLeft: 2 }}>
            <path d="M6 9l6 6 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      </div>
    </button>);

}

function PickerSheet({ title, options, value, onPick, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 100, display: 'flex', alignItems: 'flex-end',
      animation: 'fadeIn .2s ease both'
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', background: '#162548', borderRadius: '24px 24px 0 0',
        padding: '22px 18px 56px',
        minHeight: '34%',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
        animation: 'sheetUp .28s cubic-bezier(.2,.7,.2,1) both',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{
          width: 40, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.25)',
          margin: '0 auto 14px'
        }} />
        <div style={{ fontSize: 13, color: TH.dim, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center', marginBottom: 10 }}>
          {title}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {options.map((opt) => {
            const selected = opt === value;
            return (
              <button key={opt} onClick={() => onPick(opt)} style={{
                background: selected ? 'rgba(91,92,255,0.18)' : 'transparent',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                padding: '18px 16px', borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                color: '#fff', fontSize: 16, fontFamily: 'inherit', fontWeight: selected ? 600 : 500
              }}>
                {opt}
                {selected &&
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12.5l4.5 4.5L19 7.5" stroke={TH.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              </button>);

          })}
        </div>
      </div>
    </div>);

}

// ════════════════════════════════════════════════════════════════════
// HOST/JOIN — choose Duo or Squad
// ════════════════════════════════════════════════════════════════════
function HostJoinScreen({ nav, state }) {
  const [groupMode, setGroupMode] = React.useState('duo'); // 'duo' | 'squad'
  const [sortBy, setSortBy] = React.useState('favorite'); // 'favorite' | 'connection' | 'hours'
  const [sortDir, setSortDir] = React.useState('desc'); // 'asc' | 'desc'
  const [filterOpen, setFilterOpen] = React.useState(false);
  const game = gameById(state.gameId);
  const rankColor = (r) => r === 'pro' ? TH.green : r === 'amateur' ? '#FFD43A' : '#7AC4FF';

  const players = React.useMemo(() => {
    const list = [...(groupMode === 'duo' ? PLAYERS_DUO : PLAYERS_SQUAD)];
    const cmp = (a, b) => {
      let av, bv;
      if (sortBy === 'favorite') {av = a.fav ? 1 : 0;bv = b.fav ? 1 : 0;} else
      if (sortBy === 'connection') {av = a.ping;bv = b.ping;} else
        /* hours */{av = a.hours;bv = b.hours;}
      return sortDir === 'asc' ? av - bv : bv - av;
    };
    return list.sort(cmp);
  }, [groupMode, sortBy, sortDir]);

  const SORT_LABEL = { favorite: 'Favorites', connection: 'Connection', hours: 'Time spent' };

  return (
    <ScreenScroll style={{ paddingTop: 50 }}>
      <div style={{ padding: '4px 18px 0' }}>
        <BackBtn onClick={() => nav.pop()} style={{ marginLeft: -8 }} />
      </div>
      <div style={{ padding: '4px 26px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 36, fontWeight: 600, margin: '8px 0 8px', color: TH.text, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              Find your<br />partner
            </h1>
            <div style={{ fontSize: 13, color: TH.dim, marginBottom: 18 }}>
              {game.sub ? game.sub + ' ' : ''}{game.title}
            </div>
          </div>
          <button
            onClick={() => setFilterOpen(true)}
            style={{
              marginTop: 14, background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 99,
              padding: '8px 12px 8px 10px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, color: '#fff',
              fontSize: 12, fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap',
              transition: 'background .15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(91,92,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
            
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M7 12h10M10 18h4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {SORT_LABEL[sortBy]}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ transition: 'transform .25s', transform: sortDir === 'asc' ? 'rotate(180deg)' : 'none' }}>
              <path d="M6 9l6 6 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* group-size segmented (Duo / Squad) — animated sliding indicator */}
        {(() => {
          const opts = [['duo', 'Duo game'], ['squad', 'Squad game']];
          const idx = opts.findIndex(([k]) => k === groupMode);
          return (
            <div style={{
              position: 'relative',
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              borderRadius: 14, overflow: 'hidden',
              background: 'rgba(255,255,255,0.04)', padding: 4
            }}>
              <div style={{
                position: 'absolute', top: 4, bottom: 4, left: 4,
                width: 'calc((100% - 8px) / 2)',
                background: TH.accent, borderRadius: 10,
                transform: `translateX(${idx * 100}%)`,
                transition: 'transform .35s cubic-bezier(.5,1.4,.5,1)',
                boxShadow: '0 6px 18px rgba(91,92,255,0.45)',
                pointerEvents: 'none'
              }} />
              {opts.map(([k, label]) =>
              <button key={k} onClick={() => setGroupMode(k)} style={{
                background: 'transparent',
                color: groupMode === k ? '#fff' : TH.dim,
                border: 'none', padding: '14px 0', fontSize: 16, fontWeight: 600,
                borderRadius: 10, cursor: 'pointer',
                transition: 'color .25s ease',
                fontFamily: 'inherit', position: 'relative', zIndex: 1
              }}>{label}</button>
              )}
            </div>);

        })()}

        {/* list */}
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column' }}>
          {players.map((p, i) =>
          <button key={p.id} onClick={() => nav.push('player', { playerId: p.id, mode: groupMode })} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '14px 4px', display: 'flex', alignItems: 'center', gap: 14,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'left'
          }}>
              {groupMode === 'duo' ?
            <Avatar name={p.name} size={46} /> :

            <div style={{
              width: 46, height: 46, borderRadius: '50%',
              background: 'rgba(91,92,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700,
              boxShadow: 'inset 0 0 0 1px rgba(91,92,255,0.4)'
            }}>{p.members}/{p.max}</div>
            }
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>{p.name}</div>
                <div style={{ color: TH.dim, fontSize: 13, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.bio}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {sortBy === 'connection' &&
              <span style={{
                fontSize: 11, color: p.ping < 40 ? TH.green : p.ping < 90 ? '#FFD43A' : '#FF7B7B',
                fontVariantNumeric: 'tabular-nums', fontWeight: 600
              }}>{p.ping}ms</span>
              }
                {sortBy === 'hours' &&
              <span style={{
                fontSize: 11, color: TH.dim, fontVariantNumeric: 'tabular-nums', fontWeight: 600
              }}>{p.hours}h</span>
              }
                {p.fav && Ico.starFill(16)}
                {Ico.signal(18, rankColor(p.rank))}
              </div>
            </button>
          )}
        </div>
      </div>

      {filterOpen &&
      <FilterSortSheet
        sortBy={sortBy} sortDir={sortDir}
        onChange={(by, dir) => {setSortBy(by);setSortDir(dir);}}
        onClose={() => setFilterOpen(false)} />

      }
    </ScreenScroll>);

}
window.HostJoinScreen = HostJoinScreen;

// Filter / sort sheet for the Find-your-partner screen
function FilterSortSheet({ sortBy, sortDir, onChange, onClose }) {
  const OPTIONS = [
  { id: 'favorite', label: 'Favorite',
    ascLabel: 'Non-favorites first', descLabel: 'Favorites first',
    icon: <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.6L12 18l-5.9 3.1L7.3 14.5 2.5 9.9 9.1 9z" fill="#FFD43A" /></svg> },
  { id: 'connection', label: 'By connection',
    ascLabel: 'Best ping first', descLabel: 'Worst ping first',
    icon: <svg width="18" height="18" viewBox="0 0 24 24"><rect x="2" y="14" width="3.5" height="6" rx="1" fill="#3FD16A" /><rect x="7.5" y="10" width="3.5" height="10" rx="1" fill="#3FD16A" /><rect x="13" y="6" width="3.5" height="14" rx="1" fill="#3FD16A" /><rect x="18.5" y="2" width="3.5" height="18" rx="1" fill="#3FD16A" /></svg> },
  { id: 'hours', label: 'By time spent',
    ascLabel: 'Least hours first', descLabel: 'Most hours first',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#7AC4FF" strokeWidth="2" /><path d="M12 7v5l3 2" stroke="#7AC4FF" strokeWidth="2" strokeLinecap="round" /></svg> }];

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)',
      zIndex: 100, display: 'flex', alignItems: 'flex-end',
      animation: 'fadeIn .2s ease both'
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', background: '#162548', borderRadius: '24px 24px 0 0',
        padding: '18px 18px 38px',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
        animation: 'sheetUp .28s cubic-bezier(.2,.7,.2,1) both',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{
          width: 40, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.25)',
          margin: '0 auto 14px'
        }} />
        <div style={{ fontSize: 13, color: TH.dim, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center', marginBottom: 14 }}>
          Sort players
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {OPTIONS.map((opt) => {
            const active = sortBy === opt.id;
            return (
              <div key={opt.id} style={{
                background: active ? 'rgba(91,92,255,0.16)' : 'rgba(255,255,255,0.04)',
                border: '1px solid ' + (active ? 'rgba(91,92,255,0.4)' : 'rgba(255,255,255,0.06)'),
                borderRadius: 14, padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'background .18s, border-color .18s'
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>{opt.icon}</div>
                <button
                  onClick={() => onChange(opt.id, active ? sortDir : 'desc')}
                  style={{
                    flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                    color: '#fff', fontFamily: 'inherit', padding: 0
                  }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: TH.dim, marginTop: 2 }}>
                    {sortDir === 'asc' ? opt.ascLabel : opt.descLabel}
                  </div>
                </button>
                {/* Asc/Desc toggle */}
                <div style={{
                  display: 'flex', borderRadius: 99, padding: 3,
                  background: 'rgba(0,0,0,0.25)'
                }}>
                  {[['asc', '↑'], ['desc', '↓']].map(([dir, arrow]) => {
                    const on = active && sortDir === dir;
                    return (
                      <button key={dir} onClick={() => onChange(opt.id, dir)} style={{
                        background: on ? TH.accent : 'transparent',
                        color: '#fff',
                        border: 'none', cursor: 'pointer',
                        width: 30, height: 28, borderRadius: 99,
                        fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
                        transition: 'background .15s',
                        opacity: on ? 1 : 0.55
                      }}>{arrow}</button>);

                  })}
                </div>
              </div>);

          })}
        </div>
        <button onClick={onClose} style={{
          marginTop: 14, background: 'transparent', color: '#fff', border: 'none',
          padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          opacity: 0.7
        }}>Done</button>
      </div>
    </div>);

}

// ════════════════════════════════════════════════════════════════════
// PLAYER PROFILE — Bruce Green style, tabs Join game / Game stats
// ════════════════════════════════════════════════════════════════════
function PlayerScreen({ nav, state }) {
  const [tab, setTab] = React.useState('join');
  const p = PLAYERS_DUO.find((x) => x.id === state.playerId) || PLAYERS_DUO[0];
  const [fav, setFav] = React.useState(!!p.fav);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ padding: '54px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <BackBtn onClick={() => nav.pop()} style={{ marginLeft: -8 }} />
        <button onClick={() => setFav((f) => !f)} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 6
        }}>{fav ? Ico.starFill(28) : Ico.star(28, '#fff')}</button>
      </div>

      {/* Profile header */}
      <div style={{ padding: '8px 26px 0', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <Avatar name={p.name} size={86} />
        <div style={{ flex: 1, minWidth: 0, paddingTop: 6 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.01em' }}>{p.name}</div>
          <div style={{ fontSize: 22, marginTop: 4 }}>{p.flag}</div>
          <div style={{ fontSize: 13, color: TH.dim, marginTop: 6, lineHeight: 1.4 }}>{p.about}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        marginTop: 22, padding: '0 26px',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', position: 'relative'
      }}>
        {[['join', 'Join'], ['stats', 'Stats'], ['message', 'Message']].map(([k, label]) =>
        <button key={k} onClick={() => setTab(k)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '14px 0', color: tab === k ? '#fff' : TH.dim,
          fontSize: 16, fontWeight: 600, fontFamily: 'inherit',
          position: 'relative'
        }}>
            {label}
            <div style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            bottom: 0, height: 2, width: tab === k ? '60%' : '0%',
            background: '#fff', transition: 'width .24s'
          }} />
          </button>
        )}
        <div style={{ position: 'absolute', left: 26, right: 26, bottom: 0, height: 1, background: 'rgba(255,255,255,0.08)' }} />
      </div>

      {/* Tab content */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 300, bottom: 88, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {tab === 'join' ?
        <div style={{ padding: '18px 26px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'auto' }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#fff', alignSelf: 'flex-start' }}>Scan QR code to join:</div>
            <div style={{ marginTop: 18 }}>
              <QRCode size={240} payload={`partyup://join/${p.id}`} />
            </div>
            <button onClick={() => nav.push('joined', { playerId: p.id })} style={{
            marginTop: 18, background: TH.accent, color: '#fff', border: 'none',
            padding: '14px 28px', borderRadius: 99, fontSize: 15, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 10px 24px rgba(91,92,255,0.4)', fontFamily: 'inherit'
          }}>
              {Ico.users(18, '#fff')} Join lobby directly
            </button>
          </div> :
        tab === 'stats' ?
        <div style={{ padding: '18px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
          { game: 'valorant', winrate: 62, kd: 1.34, rank: 'Diamond II' },
          { game: 'cs', winrate: 58, kd: 1.21, rank: 'Supreme' },
          { game: 'apex', winrate: 71, kd: 2.05, rank: 'Predator' }].
          map((s) => {
            const g = gameById(s.game);
            return (
              <div key={s.game} style={{
                background: TH.card, borderRadius: 14, padding: 14,
                display: 'flex', alignItems: 'center', gap: 14
              }}>
                  <div style={{ width: 72, aspectRatio: '16/10', flexShrink: 0, borderRadius: 10, overflow: 'hidden' }}>
                    <GameCover game={g} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: 600 }}>{g.sub ? g.sub + ' ' : ''}{g.title}</div>
                    <div style={{ color: TH.dim, fontSize: 12, marginTop: 2 }}>{s.rank}</div>
                    <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 12, color: '#fff' }}>
                      <span><b>{s.winrate}%</b> <span style={{ color: TH.dim }}>WR</span></span>
                      <span><b>{s.kd}</b> <span style={{ color: TH.dim }}>K/D</span></span>
                    </div>
                  </div>
                </div>);

          })}
          </div> :

        <ChatPane player={p} />
        }
      </div>
    </div>);

}
window.PlayerScreen = PlayerScreen;

// ─── Inline chat pane (Message tab) ────────────────────────────────
function ChatPane({ player }) {
  const seedMessages = [
  { from: 'them', text: 'Hey! Looking to duo?', t: '10:41' },
  { from: 'me', text: 'Yeah, what rank are you?', t: '10:42' },
  { from: 'them', text: player.rank === 'pro' ? "Diamond II. You?" : "Gold. Just having fun. You?", t: '10:42' }];

  const [msgs, setMsgs] = React.useState(seedMessages);
  const [draft, setDraft] = React.useState('');
  const scrollRef = React.useRef(null);

  const send = () => {
    const v = draft.trim();
    if (!v) return;
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    setMsgs((m) => [...m, { from: 'me', text: v, t: time }]);
    setDraft('');
    setTimeout(() => {
      const replies = ['Sounds good!', "Let's queue.", "I'm down.", 'Send the invite.', 'On it.', 'lol fr'];
      const r = replies[Math.floor(Math.random() * replies.length)];
      const t2 = new Date();
      const time2 = t2.getHours().toString().padStart(2, '0') + ':' + t2.getMinutes().toString().padStart(2, '0');
      setMsgs((m) => [...m, { from: 'them', text: r, t: time2 }]);
    }, 900 + Math.random() * 600);
  };

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs.length]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div ref={scrollRef} style={{
        flex: 1, overflowY: 'auto', padding: '16px 18px 8px',
        display: 'flex', flexDirection: 'column', gap: 8
      }}>
        {msgs.map((m, i) => {
          const showAvatar = m.from === 'them' && (i === 0 || msgs[i - 1].from !== 'them');
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-end', gap: 8,
              justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start',
              animation: 'msgIn .25s cubic-bezier(.2,.7,.2,1) both'
            }}>
              {m.from === 'them' && (
              showAvatar ?
              <Avatar name={player.name} size={26} /> :
              <div style={{ width: 26 }} />)
              }
              <div style={{
                maxWidth: '72%',
                background: m.from === 'me' ? TH.accent : 'rgba(255,255,255,0.08)',
                color: '#fff', padding: '9px 13px',
                borderRadius: m.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                fontSize: 14, lineHeight: 1.35,
                boxShadow: m.from === 'me' ? '0 4px 14px rgba(91,92,255,0.25)' : 'none',
                wordBreak: 'break-word'
              }}>
                {m.text}
                <div style={{
                  fontSize: 10, opacity: 0.65, marginTop: 3,
                  textAlign: m.from === 'me' ? 'right' : 'left'
                }}>{m.t}</div>
              </div>
            </div>);

        })}
      </div>
      <form onSubmit={(e) => {e.preventDefault();send();}} style={{
        padding: '10px 14px 12px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 8
      }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message ${player.name.split(' ')[0]}…`}
          style={{
            flex: 1, background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#fff', padding: '12px 16px', borderRadius: 99,
            fontSize: 14, fontFamily: 'inherit', outline: 'none'
          }} />
        
        <button type="submit" disabled={!draft.trim()} style={{
          background: draft.trim() ? TH.accent : 'rgba(255,255,255,0.08)',
          border: 'none', cursor: draft.trim() ? 'pointer' : 'default',
          width: 42, height: 42, borderRadius: 99,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .15s',
          boxShadow: draft.trim() ? '0 4px 14px rgba(91,92,255,0.4)' : 'none'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 11l18-8-8 18-2-7-8-3z" fill="#fff" />
          </svg>
        </button>
      </form>
    </div>);

}

// ════════════════════════════════════════════════════════════════════
// JOINED CONFIRMATION
// ════════════════════════════════════════════════════════════════════
function JoinedScreen({ nav, state }) {
  const p = PLAYERS_DUO.find((x) => x.id === state.playerId) || PLAYERS_DUO[0];
  return (
    <ScreenScroll>
      <div style={{ padding: '40px 26px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{
          width: 120, height: 120, borderRadius: '50%', background: 'rgba(63,209,106,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 30,
          boxShadow: 'inset 0 0 0 2px rgba(63,209,106,0.5)'
        }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke={TH.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginTop: 24 }}>You're in!</div>
        <div style={{ color: TH.dim, fontSize: 15, marginTop: 8, lineHeight: 1.45 }}>
          Joined <b style={{ color: '#fff' }}>{p.name}</b>'s lobby.<br />Voice channel ready — say hi.
        </div>
        <div style={{
          marginTop: 30, background: TH.card, borderRadius: 16, padding: 16,
          display: 'flex', alignItems: 'center', gap: 12, width: '100%'
        }}>
          <Avatar name={p.name} size={48} />
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ color: '#fff', fontWeight: 600 }}>{p.name}</div>
            <div style={{ color: TH.dim, fontSize: 12, marginTop: 2 }}>Host · Duo · Ranked</div>
          </div>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: TH.green, boxShadow: '0 0 12px ' + TH.green }} />
        </div>
        <button onClick={() => nav.reset('search')} style={{
          marginTop: 24, background: TH.accent, color: '#fff', border: 'none',
          padding: '14px 40px', borderRadius: 99, fontSize: 15, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit'
        }}>Back to lobby browser</button>
      </div>
    </ScreenScroll>);

}
window.JoinedScreen = JoinedScreen;

// ════════════════════════════════════════════════════════════════════
// CREATE (host) — minimal config
// ════════════════════════════════════════════════════════════════════
function CreateScreen({ nav, state }) {
  const [name, setName] = React.useState('');
  const [mode, setMode] = React.useState('duo');
  const [rank, setRank] = React.useState('amateur');
  const [note, setNote] = React.useState('Looking for chill teammates.');
  const game = gameById(state.gameId);
  const defaultName = `${ME.name.split(' ')[0]}'s ${game.title} lobby`;
  const lobbyName = name.trim() || defaultName;
  const tooLong = name.length > 32;

  return (
    <ScreenScroll style={{ paddingTop: 50 }}>
      <div style={{ padding: '4px 18px 0' }}>
        <BackBtn onClick={() => nav.pop()} style={{ marginLeft: -8 }} />
      </div>
      <div style={{ padding: '4px 26px 0' }}>
        <h1 style={{ fontSize: 32, fontWeight: 600, margin: '8px 0 4px', color: '#fff', letterSpacing: '-0.02em' }}>Host a lobby</h1>
        <div style={{ color: TH.dim, fontSize: 14 }}>{game.sub ? game.sub + ' ' : ''}{game.title}</div>

        <Section label="Lobby name">
          <div style={{
            display: 'flex', alignItems: 'center',
            background: TH.card, borderRadius: 12,
            border: '1px solid ' + (tooLong ? '#FF5C5C' : 'rgba(255,255,255,0.08)'),
            transition: 'border-color .15s'
          }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={defaultName}
              maxLength={48}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', padding: '14px 16px', fontSize: 15,
                fontFamily: 'inherit'
              }} />
            
            <div style={{
              color: tooLong ? '#FF8080' : TH.dim2, fontSize: 11, paddingRight: 14,
              fontVariantNumeric: 'tabular-nums'
            }}>{name.length}/32</div>
          </div>
        </Section>
        <Section label="Mode">
          <Segmented value={mode} onChange={setMode} options={[['duo', 'Duo'], ['squad', 'Squad']]} />
        </Section>
        <Section label="Looking for">
          <Segmented value={rank} onChange={setRank} options={[['casual', 'Casual'], ['amateur', 'Amateur'], ['pro', 'Pro']]} />
        </Section>
        <Section label="Note for teammates">
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} style={{
            width: '100%', background: TH.card, border: '1px solid rgba(255,255,255,0.08)',
            color: '#fff', padding: 14, borderRadius: 12, fontSize: 15, resize: 'none',
            fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
          }} />
        </Section>

        {/* preview chip */}
        <div style={{
          marginTop: 18, background: TH.card, borderRadius: 14, padding: 14,
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <Avatar name={ME.name} size={42} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lobbyName}</div>
            <div style={{ color: TH.dim, fontSize: 12, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {ME.name} · {note || '—'}
            </div>
          </div>
          <div style={{ color: TH.dim, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>preview</div>
        </div>

        <button
          disabled={tooLong}
          onClick={() => nav.push('hostlive', { gameId: game.id, mode, rank, note, lobbyName })}
          style={{
            marginTop: 22, width: '100%',
            background: tooLong ? 'rgba(255,255,255,0.1)' : TH.accent,
            color: '#fff', border: 'none',
            padding: '16px', borderRadius: 14, fontSize: 16, fontWeight: 600,
            cursor: tooLong ? 'not-allowed' : 'pointer',
            boxShadow: tooLong ? 'none' : '0 10px 28px rgba(91,92,255,0.35)',
            fontFamily: 'inherit',
            opacity: tooLong ? 0.6 : 1
          }}>Open lobby & show QR</button>
      </div>
    </ScreenScroll>);

}
window.CreateScreen = CreateScreen;

function Section({ label, children }) {
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ fontSize: 12, color: TH.dim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{label}</div>
      {children}
    </div>);

}
function Segmented({ value, onChange, options }) {
  const idx = Math.max(0, options.findIndex(([k]) => k === value));
  return (
    <div style={{
      position: 'relative',
      display: 'grid', gridTemplateColumns: `repeat(${options.length},1fr)`,
      background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4,
      overflow: 'hidden'
    }}>
      {/* sliding indicator */}
      <div style={{
        position: 'absolute',
        top: 4, bottom: 4, left: 4,
        width: `calc((100% - 8px) / ${options.length})`,
        background: TH.accent,
        borderRadius: 9,
        transform: `translateX(${idx * 100}%)`,
        transition: 'transform .35s cubic-bezier(.5,1.4,.5,1)',
        boxShadow: '0 4px 14px rgba(91,92,255,0.4)',
        pointerEvents: 'none'
      }} />
      {options.map(([k, label]) =>
      <button key={k} onClick={() => onChange(k)} style={{
        background: 'transparent',
        color: value === k ? '#fff' : TH.dim,
        border: 'none', padding: '12px 0', fontSize: 14, fontWeight: 600,
        borderRadius: 9, cursor: 'pointer',
        transition: 'color .25s ease',
        fontFamily: 'inherit', position: 'relative', zIndex: 1
      }}>{label}</button>
      )}
    </div>);

}

// ════════════════════════════════════════════════════════════════════
// HOST LIVE (after Create) — my QR + waiting state
// ════════════════════════════════════════════════════════════════════
function HostLiveScreen({ nav, state }) {
  const game = gameById(state.gameId);
  return (
    <ScreenScroll style={{ paddingTop: 50 }}>
      <div style={{ padding: '4px 18px 0' }}>
        <BackBtn onClick={() => nav.pop()} style={{ marginLeft: -8 }} />
      </div>
      <div style={{ padding: '8px 26px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 99, background: 'rgba(63,209,106,0.15)', color: TH.green, fontSize: 12, fontWeight: 600, letterSpacing: '0.04em' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: TH.green, boxShadow: '0 0 8px ' + TH.green }} />
          LOBBY OPEN
        </div>
        {state.lobbyName &&
        <div style={{ fontSize: 13, color: '#fff', marginTop: 14, fontWeight: 600, letterSpacing: '0.02em' }}>
            {state.lobbyName}
          </div>
        }
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#fff', marginTop: state.lobbyName ? 6 : 14, letterSpacing: '-0.01em' }}>
          Share to invite{state.mode === 'squad' ? ' your squad' : ' a partner'}
        </h1>
        <div style={{ color: TH.dim, fontSize: 13, marginTop: 4 }}>
          {game.sub ? game.sub + ' ' : ''}{game.title} · {state.mode === 'squad' ? 'Squad' : 'Duo'} · {state.rank}
        </div>
        <div style={{ marginTop: 22 }}>
          <QRCode size={240} payload={`partyup://lobby/${ME.name.replace(/\s+/g, '-')}/${game.id}`} />
        </div>
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: TH.dim, fontSize: 13 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: TH.dim, animation: 'pulse 1.4s infinite' }} />
          Waiting for players to join…
        </div>
      </div>
    </ScreenScroll>);

}
window.HostLiveScreen = HostLiveScreen;

// ════════════════════════════════════════════════════════════════════
// MY PROFILE
// ════════════════════════════════════════════════════════════════════
function MyProfileScreen({ nav }) {
  const [tab, setTab] = React.useState('most');
  const [sheet, setSheet] = React.useState(null); // 'menu' | 'see' | 'select' | 'edit' | 'settings'
  // Profile state — initialized from ME, writes back so other screens stay in sync
  const [me, setMe] = React.useState({ name: ME.name, flag: ME.flag, about: ME.about, palette: ME.palette || null });
  const saveMe = (patch) => {
    setMe(m => {
      const next = { ...m, ...patch };
      Object.assign(window.ME, next); // keep global mock data in sync
      return next;
    });
  };
  const list = tab === 'most' ? ME.mostPlayed : ME.recent;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ padding: '58px 26px 0', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <button
          onClick={() => setSheet('menu')}
          aria-label="Edit profile"
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            position: 'relative', borderRadius: '50%',
            transition: 'transform .15s',
          }}
          onMouseDown={e=>e.currentTarget.style.transform='scale(0.96)'}
          onMouseUp={e=>e.currentTarget.style.transform='scale(1)'}
          onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
        >
          <Avatar name={me.name} size={86} ring="rgba(91,92,255,0.5)" palette={me.palette} />
          <div style={{
            position:'absolute', right:0, bottom:0,
            width:28, height:28, borderRadius:'50%',
            background: TH.accent,
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 2px 8px rgba(0,0,0,0.4), inset 0 0 0 2px #0E1A3A',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M4 20h4l10.5-10.5a2.8 2.8 0 0 0-4-4L4 16v4z" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
        <div style={{ flex: 1, minWidth: 0, paddingTop: 6 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.01em' }}>{me.name}</div>
          <div style={{ fontSize: 22, marginTop: 4 }}>{me.flag}</div>
          <div style={{ fontSize: 13, color: TH.dim, marginTop: 6, lineHeight: 1.4 }}>{me.about}</div>
        </div>
      </div>

      <div style={{
        marginTop: 22, padding: '0 26px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', position: 'relative'
      }}>
        {[['most', 'Most played games'], ['recent', 'Recent games']].map(([k, label]) =>
        <button key={k} onClick={() => setTab(k)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '14px 0', color: tab === k ? '#fff' : TH.dim,
          fontSize: 15, fontWeight: 600, fontFamily: 'inherit', position: 'relative'
        }}>
            {label}
            <div style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            bottom: 0, height: 2, width: tab === k ? '70%' : '0%',
            background: '#fff', transition: 'width .24s'
          }} />
          </button>
        )}
        <div style={{ position: 'absolute', left: 26, right: 26, bottom: 0, height: 1, background: 'rgba(255,255,255,0.08)' }} />
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 280, bottom: 88, overflow: 'auto' }}>
        <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {list.map((row, i) => {
            const g = gameById(row.gameId);
            return (
              <div key={i} style={{ borderRadius: 16, overflow: 'hidden', background: TH.card }}>
                <div style={{ aspectRatio: '16/10' }}>
                  <GameCover game={g} size="lg" radius={0} />
                </div>
                <div style={{ padding: '12px 14px 14px' }}>
                  {tab === 'most' ?
                  <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: 14 }}>
                        {Ico.clock(16, '#fff')}
                        <b>Play time:</b> <span style={{ color: TH.dim }}>{row.hours} hours</span>
                      </div>
                      <SkillBar value={row.skill} />
                    </> :

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{row.result}</div>
                        <div style={{ color: TH.dim, fontSize: 12, marginTop: 2 }}>{row.when}</div>
                      </div>
                      <button
                      onClick={() => nav.push('console', { gameId: row.gameId })}
                      style={{
                        background: 'rgba(91,92,255,0.2)', color: '#fff', border: 'none',
                        padding: '8px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'background .15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(91,92,255,0.35)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(91,92,255,0.2)'}>
                      Play again</button>
                    </div>
                  }
                </div>
              </div>);

          })}
        </div>
      </div>

      {sheet === 'menu' && <ProfileMenuSheet onPick={(id) => setSheet(id)} onClose={() => setSheet(null)} />}
      {sheet === 'see' && <SeePictureOverlay me={me} onClose={() => setSheet(null)} />}
      {sheet === 'select' && <SelectPictureSheet me={me} onSave={(palette) => { saveMe({ palette }); setSheet(null); }} onClose={() => setSheet(null)} />}
      {sheet === 'edit' && <EditProfileSheet me={me} onSave={(patch) => { saveMe(patch); setSheet(null); }} onClose={() => setSheet(null)} />}
      {sheet === 'settings' && <SettingsSheet onLogout={() => nav.reset('login')} onClose={() => setSheet(null)} />}
    </div>);

}
window.MyProfileScreen = MyProfileScreen;

// ─── Profile action menu ───────────────────────────────────────────
function ProfileMenuSheet({ onPick, onClose }) {
  const items = [
    {
      id: 'see', label: 'See profile picture',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3.2" stroke="#fff" strokeWidth="1.8"/>
          <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: 'select', label: 'Select profile picture',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="18" height="14" rx="3" stroke="#fff" strokeWidth="1.8"/>
          <circle cx="12" cy="13" r="3.5" stroke="#fff" strokeWidth="1.8"/>
          <path d="M9 6l1.5-2h3L15 6" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: 'edit', label: 'Edit profile',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 20h4l10.5-10.5a2.8 2.8 0 0 0-4-4L4 16v4z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: 'settings', label: 'Settings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="1.8"/>
          <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];
  return (
    <div onClick={onClose} style={{
      position:'absolute', inset:0, background:'rgba(0,0,0,0.55)',
      zIndex:100, display:'flex', alignItems:'flex-end',
      animation:'fadeIn .2s ease both',
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'100%', background:'#162548', borderRadius:'24px 24px 0 0',
        padding:'14px 14px 40px',
        boxShadow:'0 -10px 40px rgba(0,0,0,0.5)',
        animation:'sheetUp .28s cubic-bezier(.2,.7,.2,1) both',
      }}>
        <div style={{
          width:40, height:4, borderRadius:99, background:'rgba(255,255,255,0.25)',
          margin:'0 auto 12px',
        }}/>
        <div style={{display:'flex', flexDirection:'column'}}>
          {items.map(it => (
            <button key={it.id} onClick={() => onPick(it.id)} style={{
              background:'transparent', border:'none', cursor:'pointer',
              padding:'15px 12px', borderRadius:14,
              display:'flex', alignItems:'center', gap:14, textAlign:'left',
              fontFamily:'inherit', transition:'background .15s',
            }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
            >
              <div style={{
                width:42, height:42, borderRadius:12,
                background:'rgba(91,92,255,0.18)',
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0,
              }}>{it.icon}</div>
              <div style={{flex:1, color:'#fff', fontSize:15, fontWeight:600}}>{it.label}</div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{opacity:0.5}}>
                <path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── See profile picture — fullscreen viewer ───────────────────────
function SeePictureOverlay({ me, onClose }) {
  return (
    <div onClick={onClose} style={{
      position:'absolute', inset:0, background:'rgba(0,0,0,0.85)',
      zIndex:100, display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', gap:22,
      animation:'fadeIn .2s ease both', cursor:'zoom-out',
    }}>
      <Avatar name={me.name} size={260} palette={me.palette} ring="rgba(255,255,255,0.15)" />
      <div style={{color:'#fff', fontSize:17, fontWeight:600}}>{me.name}</div>
      <button onClick={onClose} aria-label="Close" style={{
        position:'absolute', top:60, right:18,
        background:'rgba(255,255,255,0.1)', border:'none', cursor:'pointer',
        width:38, height:38, borderRadius:99,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

// ─── Select profile picture — palette grid ─────────────────────────
function SelectPictureSheet({ me, onSave, onClose }) {
  const PALETTES = [
    null, // default (derived from name)
    ['#FF6B6B','#7A1E3A'], ['#FFB13A','#8a4a0a'], ['#3FD16A','#0c4d24'],
    ['#3FA8FF','#0a2a6e'], ['#5B5CFF','#241a6e'], ['#B05BFF','#41136e'],
    ['#FF4DBF','#6e0a45'], ['#2dd4bf','#0a4a42'],
  ];
  const [pick, setPick] = React.useState(me.palette || null);
  const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
  return (
    <div onClick={onClose} style={{
      position:'absolute', inset:0, background:'rgba(0,0,0,0.55)',
      zIndex:100, display:'flex', alignItems:'flex-end',
      animation:'fadeIn .2s ease both',
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'100%', background:'#162548', borderRadius:'24px 24px 0 0',
        padding:'14px 22px 40px',
        boxShadow:'0 -10px 40px rgba(0,0,0,0.5)',
        animation:'sheetUp .28s cubic-bezier(.2,.7,.2,1) both',
      }}>
        <div style={{width:40, height:4, borderRadius:99, background:'rgba(255,255,255,0.25)', margin:'0 auto 12px'}}/>
        <div style={{fontSize:13, color:TH.dim, textTransform:'uppercase', letterSpacing:'0.08em', textAlign:'center', marginBottom:16}}>
          Select profile picture
        </div>
        <div style={{display:'flex', justifyContent:'center', marginBottom:18}}>
          <Avatar name={me.name} size={92} palette={pick} ring={TH.accent} />
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, justifyItems:'center'}}>
          {PALETTES.map((p,i) => {
            const active = same(p, pick);
            return (
              <button key={i} onClick={()=>setPick(p)} aria-label={p ? 'Palette '+(i) : 'Default'} style={{
                background:'none', border:'none', padding:2, cursor:'pointer',
                borderRadius:'50%',
                boxShadow: active ? '0 0 0 2.5px '+TH.accent : '0 0 0 1px rgba(255,255,255,0.12)',
                transition:'box-shadow .15s, transform .15s',
                transform: active ? 'scale(1.08)' : 'scale(1)',
              }}>
                <Avatar name={me.name} size={48} palette={p} />
              </button>
            );
          })}
        </div>
        <button onClick={()=>onSave(pick)} style={{
          marginTop:22, width:'100%', background:TH.accent, color:'#fff', border:'none',
          padding:'15px', borderRadius:14, fontSize:15, fontWeight:600, cursor:'pointer',
          boxShadow:'0 10px 26px rgba(91,92,255,0.35)', fontFamily:'inherit',
        }}>Save picture</button>
      </div>
    </div>
  );
}

// ─── Edit profile — name + about ───────────────────────────────────
function EditProfileSheet({ me, onSave, onClose }) {
  const [name, setName]   = React.useState(me.name);
  const [about, setAbout] = React.useState(me.about);
  const valid = name.trim().length >= 2;
  return (
    <div onClick={onClose} style={{
      position:'absolute', inset:0, background:'rgba(0,0,0,0.55)',
      zIndex:100, display:'flex', alignItems:'flex-end',
      animation:'fadeIn .2s ease both',
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'100%', background:'#162548', borderRadius:'24px 24px 0 0',
        padding:'14px 22px 40px',
        boxShadow:'0 -10px 40px rgba(0,0,0,0.5)',
        animation:'sheetUp .28s cubic-bezier(.2,.7,.2,1) both',
      }}>
        <div style={{width:40, height:4, borderRadius:99, background:'rgba(255,255,255,0.25)', margin:'0 auto 12px'}}/>
        <div style={{fontSize:13, color:TH.dim, textTransform:'uppercase', letterSpacing:'0.08em', textAlign:'center', marginBottom:16}}>
          Edit profile
        </div>
        <div style={{fontSize:11, color:TH.dim, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8, fontWeight:600}}>Display name</div>
        <input value={name} onChange={e=>setName(e.target.value)} maxLength={32} style={{
          width:'100%', boxSizing:'border-box',
          background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)',
          color:'#fff', padding:'14px 16px', borderRadius:14, fontSize:15,
          fontFamily:'inherit', outline:'none',
        }}/>
        <div style={{fontSize:11, color:TH.dim, textTransform:'uppercase', letterSpacing:'0.08em', margin:'16px 0 8px', fontWeight:600}}>About</div>
        <textarea value={about} onChange={e=>setAbout(e.target.value)} rows={3} maxLength={140} style={{
          width:'100%', boxSizing:'border-box', resize:'none',
          background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)',
          color:'#fff', padding:'14px 16px', borderRadius:14, fontSize:15,
          fontFamily:'inherit', outline:'none', lineHeight:1.4,
        }}/>
        <div style={{textAlign:'right', color:TH.dim2, fontSize:11, marginTop:4}}>{about.length}/140</div>
        <button disabled={!valid} onClick={()=>onSave({ name: name.trim(), about: about.trim() })} style={{
          marginTop:14, width:'100%',
          background: valid ? TH.accent : 'rgba(255,255,255,0.1)',
          color:'#fff', border:'none',
          padding:'15px', borderRadius:14, fontSize:15, fontWeight:600,
          cursor: valid ? 'pointer' : 'not-allowed', opacity: valid ? 1 : 0.55,
          boxShadow: valid ? '0 10px 26px rgba(91,92,255,0.35)' : 'none', fontFamily:'inherit',
        }}>Save changes</button>
      </div>
    </div>
  );
}

// ─── Settings ──────────────────────────────────────────────────────
function SettingsSheet({ onLogout, onClose }) {
  const [toggles, setToggles] = React.useState({ notif: true, online: true, sounds: false });
  const flip = (k) => setToggles(t => ({ ...t, [k]: !t[k] }));
  const Toggle = ({ on, onClick }) => (
    <button onClick={onClick} aria-pressed={on} style={{
      width:46, height:28, borderRadius:99, border:'none', cursor:'pointer',
      background: on ? TH.accent : 'rgba(255,255,255,0.14)',
      position:'relative', transition:'background .2s', flexShrink:0, padding:0,
    }}>
      <span style={{
        position:'absolute', top:3, left: on ? 21 : 3,
        width:22, height:22, borderRadius:'50%', background:'#fff',
        transition:'left .2s cubic-bezier(.4,1.4,.6,1)',
        boxShadow:'0 1px 4px rgba(0,0,0,0.35)',
      }}/>
    </button>
  );
  const rows = [
    { k:'notif',  label:'Notifications',     desc:'Invites, messages, lobby activity' },
    { k:'online', label:'Show online status', desc:'Let others see when you\u2019re available' },
    { k:'sounds', label:'Sounds',            desc:'In-app sound effects' },
  ];
  return (
    <div onClick={onClose} style={{
      position:'absolute', inset:0, background:'rgba(0,0,0,0.55)',
      zIndex:100, display:'flex', alignItems:'flex-end',
      animation:'fadeIn .2s ease both',
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'100%', background:'#162548', borderRadius:'24px 24px 0 0',
        padding:'14px 22px 40px',
        boxShadow:'0 -10px 40px rgba(0,0,0,0.5)',
        animation:'sheetUp .28s cubic-bezier(.2,.7,.2,1) both',
      }}>
        <div style={{width:40, height:4, borderRadius:99, background:'rgba(255,255,255,0.25)', margin:'0 auto 12px'}}/>
        <div style={{fontSize:13, color:TH.dim, textTransform:'uppercase', letterSpacing:'0.08em', textAlign:'center', marginBottom:10}}>
          Settings
        </div>
        <div style={{display:'flex', flexDirection:'column'}}>
          {rows.map(r => (
            <div key={r.k} style={{
              display:'flex', alignItems:'center', gap:14,
              padding:'13px 4px', borderBottom:'1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{flex:1, minWidth:0}}>
                <div style={{color:'#fff', fontSize:15, fontWeight:600}}>{r.label}</div>
                <div style={{color:TH.dim, fontSize:12, marginTop:2}}>{r.desc}</div>
              </div>
              <Toggle on={toggles[r.k]} onClick={()=>flip(r.k)} />
            </div>
          ))}
        </div>
        <button onClick={onLogout} style={{
          marginTop:18, width:'100%',
          background:'rgba(255,107,107,0.12)', color:'#FF8080',
          border:'1px solid rgba(255,107,107,0.35)',
          padding:'14px', borderRadius:14, fontSize:15, fontWeight:600,
          cursor:'pointer', fontFamily:'inherit', transition:'background .15s',
        }}
        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,107,107,0.2)'}
        onMouseLeave={e=>e.currentTarget.style.background='rgba(255,107,107,0.12)'}
        >Log out</button>
      </div>
    </div>
  );
}

function SkillBar({ value }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ position: 'relative', height: 8, background: 'rgba(255,255,255,0.9)', borderRadius: 99 }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: `${value * 100}%`,
          background: 'linear-gradient(90deg,#3FA8FF,#5B5CFF)', borderRadius: 99
        }} />
        {[0.5].map((t) =>
        <div key={t} style={{ position: 'absolute', left: `${t * 100}%`, top: -3, bottom: -3, width: 1, background: 'rgba(0,0,0,0.4)' }} />
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: TH.dim, letterSpacing: '0.02em' }}>
        <span>Beginner</span><span>Amateur</span><span>Pro</span>
      </div>
    </div>);

}

// ════════════════════════════════════════════════════════════════════
// FAVORITES
// ════════════════════════════════════════════════════════════════════
function FavoritesScreen({ nav }) {
  const { favGames } = React.useContext(window.FavCtx);
  const favPlayers = PLAYERS_DUO.filter((p) => p.fav);
  const favGameList = favGames.map(gameById).filter(Boolean);
  return (
    <ScreenScroll>
      <div style={{ padding: '20px 26px 8px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 600, color: '#fff', margin: '8px 0 18px', letterSpacing: '-0.02em' }}>Favorites</h1>
        <div style={{ fontSize: 13, color: TH.dim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Players</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {favPlayers.map((p) =>
          <button key={p.id} onClick={() => nav.push('player', { playerId: p.id, mode: 'duo' })} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '12px 4px', display: 'flex', alignItems: 'center', gap: 14,
            borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left'
          }}>
              <Avatar name={p.name} size={42} />
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontWeight: 600 }}>{p.name}</div>
                <div style={{ color: TH.dim, fontSize: 12, marginTop: 2 }}>{p.about}</div>
              </div>
              {Ico.starFill(18)}
            </button>
          )}
        </div>
        <div style={{ fontSize: 13, color: TH.dim, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '22px 0 10px' }}>Games</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {favGameList.map((g) =>
          <button key={g.id} onClick={() => nav.push('console', { gameId: g.id })} className="game-tile">
              <GameCover game={g} />
            </button>
          )}
          {favGameList.length === 0 &&
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: TH.dim, padding: '24px 0', fontSize: 13 }}>
              No favorite games yet — tap the star on any game.
            </div>
          }
        </div>
      </div>
    </ScreenScroll>);

}
window.FavoritesScreen = FavoritesScreen;

// ════════════════════════════════════════════════════════════════════
// RECENT
// ════════════════════════════════════════════════════════════════════
function RecentScreen({ nav }) {
  return (
    <ScreenScroll>
      <div style={{ padding: '20px 26px 8px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 600, color: '#fff', margin: '8px 0 18px', letterSpacing: '-0.02em' }}>Recent</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
          { p: 'bruce', game: 'valorant', when: '2h ago', result: 'Duo · won' },
          { p: 'carmen', game: 'cs', when: 'Yesterday', result: 'Duo · lost' },
          { p: 'kyle', game: 'apex', when: '2d ago', result: 'Squad · top 3' },
          { p: 'harry', game: 'amongus', when: '4d ago', result: 'Squad · crew win' },
          { p: 'patrick', game: 'minecraft', when: 'Last week', result: 'Casual' }].
          map((r, i) => {
            const player = PLAYERS_DUO.find((x) => x.id === r.p);
            const g = gameById(r.game);
            return (
              <button key={i} onClick={() => nav.push('player', { playerId: r.p, mode: 'duo' })} style={{
                background: TH.card, border: 'none', borderRadius: 14, padding: 12,
                display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left'
              }}>
                <div style={{ width: 72, aspectRatio: '16/10', borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                  <GameCover game={g} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontWeight: 600 }}>
                    {player.name}
                  </div>
                  <div style={{ color: TH.dim, fontSize: 12, marginTop: 2 }}>{g.sub ? g.sub + ' ' : ''}{g.title} · {r.result}</div>
                </div>
                <div style={{ color: TH.dim, fontSize: 12 }}>{r.when}</div>
              </button>);

          })}
        </div>
      </div>
    </ScreenScroll>);

}
window.RecentScreen = RecentScreen;