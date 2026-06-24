// PartyUp Desktop — pages (reuses data.jsx + visuals.jsx globals)

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
  star: '#FFD43A',
};
window.TH = TH;

// ─── Sidebar ────────────────────────────────────────────────────────
function Sidebar({ page, onNav, me }) {
  const items = [
    { id: 'search', label: 'Search',    icon: Ico.search },
    { id: 'recent', label: 'Recent',    icon: Ico.recent },
    { id: 'fav',    label: 'Favorites', icon: Ico.star },
  ];
  return (
    <aside style={{
      width: 232, flexShrink: 0, display: 'flex', flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      padding: '26px 14px 18px', boxSizing: 'border-box', gap: 4,
    }}>
      {/* logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px 22px' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(140deg,#5B5CFF 0%,#7B5CFF 60%,#FF4DBF 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 18px -6px rgba(91,92,255,0.6)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6.5 8h11c2 0 3.5 1.7 3.5 3.7L20 16c-.2 1.5-1.5 2.5-3 2.5-1 0-1.9-.6-2.4-1.5l-.6-1.2H10l-.6 1.2c-.5.9-1.4 1.5-2.4 1.5-1.5 0-2.8-1-3-2.5L3 11.7C3 9.7 4.5 8 6.5 8z" stroke="#fff" strokeWidth="1.8"/>
            <circle cx="9" cy="13" r="0.9" fill="#fff"/>
            <circle cx="15.5" cy="12" r="1" fill="#FFD43A"/>
          </svg>
        </div>
        <div style={{ fontSize: 19, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
          Party<span style={{ color: TH.accent }}>Up</span>
        </div>
      </div>

      {items.map(it => {
        const active = page === it.id;
        return (
          <button key={it.id} onClick={() => onNav(it.id)} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: active ? 'rgba(91,92,255,0.16)' : 'transparent',
            border: 'none', cursor: 'pointer', borderRadius: 12,
            padding: '12px 14px', color: active ? '#fff' : TH.dim,
            fontSize: 14.5, fontWeight: 600, fontFamily: 'inherit',
            transition: 'background .15s, color .15s', textAlign: 'left',
          }}
          onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(91,92,255,0.16)' : 'transparent'; }}
          >
            {it.id === 'fav'
              ? (active ? Ico.starFill(20) : Ico.star(20, 'currentColor'))
              : it.icon(20, 'currentColor')}
            {it.label}
          </button>
        );
      })}

      <div style={{ flex: 1 }} />

      {/* profile chip */}
      <button onClick={() => onNav('profile')} style={{
        display: 'flex', alignItems: 'center', gap: 11,
        background: page === 'profile' ? 'rgba(91,92,255,0.16)' : 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        cursor: 'pointer', borderRadius: 14, padding: '10px 12px',
        fontFamily: 'inherit', textAlign: 'left', transition: 'background .15s',
      }}>
        <Avatar name={me.name} size={36} palette={me.palette} />
        <div style={{ minWidth: 0 }}>
          <div style={{ color: '#fff', fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{me.name}</div>
          <div style={{ color: TH.green, fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: TH.green }} />
            Online
          </div>
        </div>
      </button>
    </aside>
  );
}
window.Sidebar = Sidebar;

// ─── Generic dropdown ───────────────────────────────────────────────
function Dropdown({ label, value, options, onChange, width = 170 }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10, padding: '9px 12px', cursor: 'pointer',
        color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
        transition: 'background .15s',
      }}>
        {label && <span style={{ color: TH.dim2, fontWeight: 500 }}>{label}</span>}
        {value}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.6, transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}>
          <path d="M6 9l6 6 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && <>
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 60 }} />
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 61,
          background: '#1A2A52', borderRadius: 12, padding: 5, width,
          boxShadow: '0 18px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07)',
          animation: 'fadeIn .14s ease both',
        }}>
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: opt === value ? 'rgba(91,92,255,0.18)' : 'transparent',
              border: 'none', cursor: 'pointer', borderRadius: 8,
              padding: '9px 11px', color: '#fff', fontSize: 13, fontWeight: opt === value ? 600 : 500,
              fontFamily: 'inherit', textAlign: 'left', transition: 'background .12s',
            }}
            onMouseEnter={e => { if (opt !== value) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = opt === value ? 'rgba(91,92,255,0.18)' : 'transparent'; }}
            >
              {opt}
              {opt === value && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12.5l4.5 4.5L19 7.5" stroke={TH.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </>}
    </div>
  );
}
window.Dropdown = Dropdown;

// ─── Home / Search ──────────────────────────────────────────────────
function HomePage({ nav }) {
  const [q, setQ] = React.useState('');
  const filtered = GAMES.filter(g => (g.title + ' ' + g.sub).toLowerCase().includes(q.toLowerCase()));
  return (
    <div data-screen-label="Desktop Home" style={{ padding: '44px 48px 60px', maxWidth: 1180, margin: '0 auto' }}>
      <h1 style={{
        fontSize: 42, fontWeight: 600, color: '#fff', margin: '0 0 26px',
        letterSpacing: '-0.02em', lineHeight: 1.08,
      }}>What are you playing today?</h1>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px',
        background: '#fff', borderRadius: 99, maxWidth: 520,
        boxShadow: '0 8px 28px rgba(0,0,0,0.3)',
      }}>
        {Ico.search(20, '#333')}
        <input
          value={q} onChange={e => setQ(e.target.value)} placeholder="Search games"
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', color: '#111', fontFamily: 'inherit' }}
        />
      </div>
      <div style={{ marginTop: 38, fontSize: 19, fontWeight: 600, color: '#fff' }}>
        {q ? `Results (${filtered.length})` : 'Popular games'}
      </div>
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))', gap: 14 }}>
        {filtered.map(g => (
          <button key={g.id} onClick={() => nav.go('game', { gameId: g.id })} className="game-tile">
            <GameCover game={g} aspect="1" />
          </button>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: TH.dim, padding: '50px 0' }}>
            No games match “{q}”
          </div>
        )}
      </div>
    </div>
  );
}
window.HomePage = HomePage;

// ─── Game page (info + partner finder side by side) ────────────────
function GamePage({ nav, gameId, openPlayer, openHost }) {
  const game = gameById(gameId);
  const { favGames, toggleFavGame } = React.useContext(window.FavCtx);
  const isFav = favGames.includes(game.id);

  const MODES = ['Ranked', 'Casual'];
  const REGIONS = ['EU West', 'EU East', 'NA East', 'NA West', 'SA', 'Asia', 'OCE'];
  const [mode, setMode] = React.useState('Ranked');
  const [region, setRegion] = React.useState('EU West');

  const lobbies = React.useMemo(() => {
    const key = game.id + '|' + mode + '|' + region;
    let h = 0; for (let i = 0; i < key.length; i++) h = (h * 131 + key.charCodeAt(i)) >>> 0;
    const base = mode === 'Casual' ? 220 : 140;
    const regMul = { 'EU West': 1.1, 'EU East': 0.7, 'NA East': 1.2, 'NA West': 0.95, 'SA': 0.55, 'Asia': 1.35, 'OCE': 0.35 }[region] || 1;
    return Math.max(3, Math.round(base * regMul + (h % 40) - 20));
  }, [game.id, mode, region]);
  const players = Math.round(lobbies * 17 + (mode === 'Casual' ? 500 : 200)).toLocaleString();

  // Partner list state
  const [groupMode, setGroupMode] = React.useState('duo');
  const [sortBy, setSortBy] = React.useState('Favorites');
  const [sortDir, setSortDir] = React.useState('desc');
  const list = React.useMemo(() => {
    const arr = [...(groupMode === 'duo' ? PLAYERS_DUO : PLAYERS_SQUAD)];
    const get = (p) => sortBy === 'Favorites' ? (p.fav ? 1 : 0) : sortBy === 'Connection' ? p.ping : p.hours;
    arr.sort((a, b) => sortDir === 'asc' ? get(a) - get(b) : get(b) - get(a));
    return arr;
  }, [groupMode, sortBy, sortDir]);
  const rankColor = (r) => r === 'pro' ? TH.green : r === 'amateur' ? '#FFD43A' : '#7AC4FF';

  return (
    <div data-screen-label="Desktop Game" style={{ padding: '34px 48px 60px', maxWidth: 1180, margin: '0 auto' }}>
      <button onClick={() => nav.go('search')} style={{
        display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
        color: TH.dim, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        padding: '4px 0', marginBottom: 18,
      }}
      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
      onMouseLeave={e => e.currentTarget.style.color = TH.dim}
      >
        {Ico.back(16, 'currentColor')} Back to games
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 30, alignItems: 'start' }}>
        {/* Left: game info */}
        <div>
          <div style={{ borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 50px -16px rgba(0,0,0,0.6)' }}>
            <GameCover game={game} size="xl" radius={18} />
          </div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
                {game.sub ? game.sub + ' ' : ''}{game.title}
              </div>
              <div style={{ color: TH.dim, fontSize: 14, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: TH.green }} />
                {players} players online · {lobbies} open lobbies
              </div>
            </div>
            <button
              onClick={() => toggleFavGame(game.id)}
              style={{
                background: isFav ? 'rgba(255,212,58,0.16)' : TH.card,
                border: '1px solid ' + (isFav ? 'rgba(255,212,58,0.4)' : 'rgba(255,255,255,0.08)'),
                borderRadius: 99, width: 44, height: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all .18s',
              }}>
              {isFav ? Ico.starFill(20) : Ico.star(20, '#fff', 'none')}
            </button>
          </div>

          <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
            <Dropdown label="Mode" value={mode} options={MODES} onChange={setMode} width={150} />
            <Dropdown label="Region" value={region} options={REGIONS} onChange={setRegion} width={160} />
          </div>

          <button onClick={() => openHost({ gameId: game.id, mode, region })} style={{
            marginTop: 18, width: '100%',
            background: 'transparent', border: '1.5px solid rgba(255,255,255,0.18)', borderRadius: 14,
            color: '#fff', padding: '15px', fontSize: 15.5, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: 'inherit', transition: 'background .15s, border-color .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(91,92,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(91,92,255,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
          >
            {Ico.plus(19, '#fff')} Host a game
          </button>
        </div>

        {/* Right: partner finder */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 18, padding: '22px 22px 12px',
        }}>
          <div style={{ fontSize: 19, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Find your partner</div>

          {/* duo / squad segmented */}
          {(() => {
            const opts = [['duo', 'Duo game'], ['squad', 'Squad game']];
            const idx = opts.findIndex(([k]) => k === groupMode);
            return (
              <div style={{
                position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr',
                background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 4, bottom: 4, left: 4,
                  width: 'calc((100% - 8px) / 2)', background: TH.accent, borderRadius: 9,
                  transform: `translateX(${idx * 100}%)`,
                  transition: 'transform .35s cubic-bezier(.5,1.4,.5,1)',
                  pointerEvents: 'none',
                }} />
                {opts.map(([k, label]) => (
                  <button key={k} onClick={() => setGroupMode(k)} style={{
                    background: 'transparent', color: groupMode === k ? '#fff' : TH.dim,
                    border: 'none', padding: '11px 0', fontSize: 14, fontWeight: 600,
                    borderRadius: 9, cursor: 'pointer', transition: 'color .25s',
                    fontFamily: 'inherit', position: 'relative', zIndex: 1,
                  }}>{label}</button>
                ))}
              </div>
            );
          })()}

          {/* sort row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <Dropdown label="Sort" value={sortBy} options={['Favorites', 'Connection', 'Time spent']} onChange={setSortBy} width={160} />
            <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')} title={sortDir === 'asc' ? 'Ascending' : 'Descending'} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, width: 36, height: 35, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
            }}>{sortDir === 'asc' ? '↑' : '↓'}</button>
            <div style={{ marginLeft: 'auto', fontSize: 12, color: TH.dim }}>{list.length} {groupMode === 'duo' ? 'players' : 'squads'}</div>
          </div>

          {/* list */}
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column' }}>
            {list.map(p => (
              <button key={p.id} onClick={() => openPlayer(p.id, groupMode)} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '12px 6px', display: 'flex', alignItems: 'center', gap: 13,
                borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left',
                borderRadius: 10, transition: 'background .12s', fontFamily: 'inherit',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {groupMode === 'duo' ? (
                  <Avatar name={p.name} size={42} />
                ) : (
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%', background: 'rgba(91,92,255,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: 13,
                    boxShadow: 'inset 0 0 0 1px rgba(91,92,255,0.4)', flexShrink: 0,
                  }}>{p.members}/{p.max}</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#fff', fontSize: 14.5, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ color: TH.dim, fontSize: 12.5, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.bio}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  {sortBy === 'Connection' && (
                    <span style={{ fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: p.ping < 40 ? TH.green : p.ping < 90 ? '#FFD43A' : '#FF7B7B' }}>{p.ping}ms</span>
                  )}
                  {sortBy === 'Time spent' && (
                    <span style={{ fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: TH.dim }}>{p.hours}h</span>
                  )}
                  {p.fav && Ico.starFill(15)}
                  {Ico.signal(17, rankColor(p.rank))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
window.GamePage = GamePage;

// ─── Recent ─────────────────────────────────────────────────────────
function RecentPage({ nav, openPlayer }) {
  const rows = [
    { p: 'bruce',   game: 'valorant',  when: '2h ago',    result: 'Duo · won' },
    { p: 'carmen',  game: 'cs',        when: 'Yesterday', result: 'Duo · lost' },
    { p: 'kyle',    game: 'apex',      when: '2d ago',    result: 'Squad · top 3' },
    { p: 'harry',   game: 'amongus',   when: '4d ago',    result: 'Squad · crew win' },
    { p: 'patrick', game: 'minecraft', when: 'Last week', result: 'Casual' },
  ];
  return (
    <div data-screen-label="Desktop Recent" style={{ padding: '44px 48px 60px', maxWidth: 880, margin: '0 auto' }}>
      <h1 style={{ fontSize: 34, fontWeight: 600, color: '#fff', margin: '0 0 22px', letterSpacing: '-0.02em' }}>Recent</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map((r, i) => {
          const player = PLAYERS_DUO.find(x => x.id === r.p);
          const g = gameById(r.game);
          return (
            <button key={i} onClick={() => openPlayer(r.p, 'duo')} style={{
              background: TH.card, border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14,
              padding: 14, display: 'flex', alignItems: 'center', gap: 16,
              cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
              transition: 'background .14s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            onMouseLeave={e => e.currentTarget.style.background = TH.card}
            >
              <div style={{ width: 96, flexShrink: 0, borderRadius: 10, overflow: 'hidden' }}>
                <GameCover game={g} />
              </div>
              <Avatar name={player.name} size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{player.name}</div>
                <div style={{ color: TH.dim, fontSize: 13, marginTop: 2 }}>{g.sub ? g.sub + ' ' : ''}{g.title} · {r.result}</div>
              </div>
              <div style={{ color: TH.dim, fontSize: 13 }}>{r.when}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
window.RecentPage = RecentPage;

// ─── Favorites ──────────────────────────────────────────────────────
function FavoritesPage({ nav, openPlayer }) {
  const { favGames } = React.useContext(window.FavCtx);
  const favPlayers = PLAYERS_DUO.filter(p => p.fav);
  const favGameList = favGames.map(gameById).filter(Boolean);
  return (
    <div data-screen-label="Desktop Favorites" style={{ padding: '44px 48px 60px', maxWidth: 1080, margin: '0 auto' }}>
      <h1 style={{ fontSize: 34, fontWeight: 600, color: '#fff', margin: '0 0 22px', letterSpacing: '-0.02em' }}>Favorites</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 34, alignItems: 'start' }}>
        <div>
          <div style={{ fontSize: 13, color: TH.dim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Players</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {favPlayers.map(p => (
              <button key={p.id} onClick={() => openPlayer(p.id, 'duo')} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '12px 6px', display: 'flex', alignItems: 'center', gap: 13,
                borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left',
                borderRadius: 10, fontFamily: 'inherit', transition: 'background .12s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Avatar name={p.name} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 14.5 }}>{p.name}</div>
                  <div style={{ color: TH.dim, fontSize: 12.5, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.about}</div>
                </div>
                {Ico.starFill(17)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, color: TH.dim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Games</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {favGameList.map(g => (
              <button key={g.id} onClick={() => nav.go('game', { gameId: g.id })} className="game-tile">
                <GameCover game={g} aspect="1" />
              </button>
            ))}
            {favGameList.length === 0 && (
              <div style={{ gridColumn: '1/-1', color: TH.dim, fontSize: 13, padding: '20px 0' }}>
                No favorite games yet — open a game and tap the star.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
window.FavoritesPage = FavoritesPage;

// ─── Profile ────────────────────────────────────────────────────────
function ProfilePage({ me, saveMe, openProfileModal }) {
  const [tab, setTab] = React.useState('most');
  const [menuOpen, setMenuOpen] = React.useState(false);
  const list = tab === 'most' ? ME.mostPlayed : ME.recent;
  const menuItems = [
    ['see', 'See profile picture'],
    ['select', 'Select profile picture'],
    ['edit', 'Edit profile'],
    ['settings', 'Settings'],
  ];
  return (
    <div data-screen-label="Desktop Profile" style={{ padding: '44px 48px 60px', maxWidth: 1080, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start' }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', position: 'relative', borderRadius: '50%' }}>
            <Avatar name={me.name} size={104} ring="rgba(91,92,255,0.5)" palette={me.palette} />
            <div style={{
              position: 'absolute', right: 2, bottom: 2, width: 30, height: 30, borderRadius: '50%',
              background: TH.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4), inset 0 0 0 2px #0E1A3A',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M4 20h4l10.5-10.5a2.8 2.8 0 0 0-4-4L4 16v4z" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
          {menuOpen && <>
            <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 60 }} />
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 61, width: 230,
              background: '#1A2A52', borderRadius: 14, padding: 6,
              boxShadow: '0 18px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07)',
              animation: 'fadeIn .14s ease both',
            }}>
              {menuItems.map(([id, label]) => (
                <button key={id} onClick={() => { setMenuOpen(false); openProfileModal(id); }} style={{
                  width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
                  borderRadius: 9, padding: '11px 12px', color: '#fff', fontSize: 13.5, fontWeight: 600,
                  fontFamily: 'inherit', textAlign: 'left', transition: 'background .12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >{label}</button>
              ))}
            </div>
          </>}
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingTop: 8 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{me.name}</div>
          <div style={{ fontSize: 22, marginTop: 4 }}>{me.flag}</div>
          <div style={{ fontSize: 14, color: TH.dim, marginTop: 8, lineHeight: 1.5, maxWidth: 560 }}>{me.about}</div>
        </div>
      </div>

      {/* tabs */}
      <div style={{ marginTop: 30, display: 'flex', gap: 26, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {[['most', 'Most played games'], ['recent', 'Recent games']].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '12px 2px', color: tab === k ? '#fff' : TH.dim,
            fontSize: 15, fontWeight: 600, fontFamily: 'inherit', position: 'relative',
          }}>
            {label}
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: -1, height: 2,
              background: tab === k ? '#fff' : 'transparent', transition: 'background .2s',
            }} />
          </button>
        ))}
      </div>

      <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {list.map((row, i) => {
          const g = gameById(row.gameId);
          return (
            <div key={i} style={{ borderRadius: 16, overflow: 'hidden', background: TH.card, border: '1px solid rgba(255,255,255,0.05)' }}>
              <GameCover game={g} size="lg" radius={0} />
              <div style={{ padding: '12px 16px 16px' }}>
                {tab === 'most' ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: 13.5 }}>
                      {Ico.clock(15, '#fff')}
                      <b>Play time:</b> <span style={{ color: TH.dim }}>{row.hours} hours</span>
                    </div>
                    <DesktopSkillBar value={row.skill} />
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{row.result}</div>
                      <div style={{ color: TH.dim, fontSize: 12, marginTop: 2 }}>{row.when}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
window.ProfilePage = ProfilePage;

function DesktopSkillBar({ value }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ position: 'relative', height: 7, background: 'rgba(255,255,255,0.9)', borderRadius: 99 }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: `${value * 100}%`,
          background: 'linear-gradient(90deg,#3FA8FF,#5B5CFF)', borderRadius: 99,
        }} />
        <div style={{ position: 'absolute', left: '50%', top: -3, bottom: -3, width: 1, background: 'rgba(0,0,0,0.4)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 10.5, color: TH.dim }}>
        <span>Beginner</span><span>Amateur</span><span>Pro</span>
      </div>
    </div>
  );
}
window.DesktopSkillBar = DesktopSkillBar;
