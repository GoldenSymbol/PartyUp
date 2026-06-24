// CSS-rendered game covers, avatars, icons, QR — no external assets.

// ─── Icons ──────────────────────────────────────────────────────────
const Ico = {
  back: (s = 24, c = '#fff') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  search: (s = 22, c = '#fff') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke={c} strokeWidth="2" /><path d="M15.5 15.5L20 20" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>,
  profile: (s = 22, c = '#fff') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={c} strokeWidth="2" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>,
  profileFill: (s = 22, c = '#fff') => <svg width={s} height={s} viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill={c} /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6z" fill={c} /></svg>,
  recent: (s = 22, c = '#fff') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" stroke={c} strokeWidth="2" strokeLinecap="round" />
    <path d="M3 4v4.5h4.5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 8.5v4l2.8 1.8" stroke={c} strokeWidth="2" strokeLinecap="round" />
  </svg>,
  star: (s = 22, c = '#fff', fill = 'none') => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.6L12 18l-5.9 3.1L7.3 14.5 2.5 9.9 9.1 9z" stroke={c} strokeWidth="2" strokeLinejoin="round" fill={fill} /></svg>,
  starFill: (s = 22) => Ico.star(s, '#FFD43A', '#FFD43A'),
  signal: (s = 20, c = '#3FD16A') => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M2 22 L22 22 L22 2 Z" fill={c} /></svg>,
  clock: (s = 18, c = '#fff') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2" /><path d="M12 7v5l3 2" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>,
  chevron: (s = 18, c = '#fff') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  plus: (s = 22, c = '#fff') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={c} strokeWidth="2.5" strokeLinecap="round" /></svg>,
  users: (s = 20, c = '#fff') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="3.5" stroke={c} strokeWidth="1.8" /><circle cx="17" cy="10" r="2.5" stroke={c} strokeWidth="1.8" /><path d="M3 19c1-3 3.3-4.5 6-4.5s5 1.5 6 4.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" /><path d="M16 14.5c2 .2 3.5 1.3 5 3" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>,
  user: (s = 20, c = '#fff') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.5" r="3.5" stroke={c} strokeWidth="1.8" /><path d="M5 20c1.4-3.4 4-5 7-5s5.6 1.6 7 5" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>
};
window.Ico = Ico;

// ─── Game cover (CSS-only) ──────────────────────────────────────────
function GameCover({ game, size = 'sm', radius = 12, aspect }) {
  const big = size === 'lg';
  const huge = size === 'xl';
  const titleSz = huge ? 56 : big ? 30 : 18;
  const subSz = huge ? 22 : big ? 14 : 9;

  // vibe-specific decorative layers
  const decor = {
    military: <>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.04) 0 2px,transparent 2px 14px)' }} />
      <div style={{ position: 'absolute', bottom: -8, left: -4, right: -4, height: '45%', background: 'linear-gradient(180deg,transparent,#0a0e0a)' }} />
      <div style={{ position: 'absolute', top: '55%', left: '15%', width: '10%', height: '30%', background: '#0a0e0a', clipPath: 'polygon(50% 0,100% 100%,0 100%)' }} />
      <div style={{ position: 'absolute', top: '60%', left: '70%', width: '8%', height: '25%', background: '#0a0e0a', clipPath: 'polygon(50% 0,100% 100%,0 100%)' }} />
    </>,
    silhouette: <>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '58%', background: '#0a0604', clipPath: 'polygon(0 100%,0 60%,15% 40%,30% 55%,45% 30%,55% 45%,70% 25%,85% 50%,100% 35%,100% 100%)' }} />
      <div style={{ position: 'absolute', top: '18%', right: '12%', width: 18, height: 18, borderRadius: '50%', background: '#FFE08A', boxShadow: '0 0 30px #FFE08A' }} />
    </>,
    mask: <>
      <div style={{ position: 'absolute', inset: '18% 22%', background: '#fff', clipPath: 'polygon(15% 0,85% 0,100% 35%,80% 100%,20% 100%,0 35%)', opacity: 0.92 }} />
      <div style={{ position: 'absolute', top: '34%', left: '34%', width: '10%', height: '8%', background: '#000', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: '34%', right: '34%', width: '10%', height: '8%', background: '#000', borderRadius: '50%' }} />
    </>,
    crest: <>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 70%,#1a5a9e 0%,transparent 60%)' }} />
      <div style={{ position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)', width: '45%', aspectRatio: '1/1.3', border: `${big ? 3 : 2}px solid #C8A765`, clipPath: 'polygon(50% 0,100% 30%,100% 70%,50% 100%,0 70%,0 30%)' }} />
    </>,
    hex: <>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.15) 1px,transparent 1px)', backgroundSize: '10px 10px' }} />
      <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: '38%', aspectRatio: '1', background: '#fff', clipPath: 'polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)' }} />
    </>,
    crewmate: <>
      <div style={{ position: 'absolute', bottom: '14%', left: '50%', transform: 'translateX(-50%)', width: '42%', aspectRatio: '1/1.2', background: '#ff4757', borderRadius: '50% 50% 35% 35% / 60% 60% 40% 40%', boxShadow: 'inset -6px -4px 0 rgba(0,0,0,0.3)' }} />
      <div style={{ position: 'absolute', bottom: '52%', left: '52%', transform: 'translateX(-50%)', width: '25%', height: '14%', background: '#9BE5F2', borderRadius: '40%', border: '2px solid #0a1e2a' }} />
    </>,
    crosshair: <>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%,#3a1f08 0%,transparent 60%)' }} />
      <div style={{ position: 'absolute', inset: '30%', border: `${big ? 2 : 1.5}px solid #F58220`, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: '50%', left: '15%', right: '15%', height: 1, background: '#F58220' }} />
      <div style={{ position: 'absolute', left: '50%', top: '15%', bottom: '15%', width: 1, background: '#F58220' }} />
    </>,
    pixel: <>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(90deg,rgba(0,0,0,0.15) 1px,transparent 1px),linear-gradient(0deg,rgba(0,0,0,0.15) 1px,transparent 1px)', backgroundSize: `${big ? 14 : 8}px ${big ? 14 : 8}px` }} />
      <div style={{ position: 'absolute', top: '52%', left: '24%', width: '52%', height: '14%', background: '#6b3f1c', imageRendering: 'pixelated' }} />
      <div style={{ position: 'absolute', top: '40%', left: '30%', width: '40%', height: '12%', background: '#9BD66B' }} />
    </>,
    apex: <>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 40%,#ffd84a 0%,transparent 55%)' }} />
      <div style={{ position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)', width: '50%', aspectRatio: '1', background: '#0a0a0a', clipPath: 'polygon(50% 0,100% 100%,0 100%)' }} />
    </>,
    tactical: <>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(135deg,transparent 49%,rgba(255,255,255,0.15) 49% 51%,transparent 51%)', backgroundSize: '20px 20px' }} />
      <div style={{ position: 'absolute', inset: '28%', border: `${big ? 3 : 2}px solid #fff`, borderRadius: 2, transform: 'rotate(45deg)' }} />
    </>,
    aura: <>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 55%,#fff200 0%,rgba(255,140,0,0.5) 30%,transparent 65%)' }} />
      <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', width: '30%', aspectRatio: '1', background: '#fff', borderRadius: '50%', filter: 'blur(1px)' }} />
    </>,
    storm: <>
      <div style={{ position: 'absolute', inset: 0, background: 'conic-gradient(from 180deg at 50% 50%,#7e3ff2,#00d4ff,#7e3ff2)' }} />
    </>
  }[game.vibe] || null;

  return (
    <div style={{
      width: '100%',
      aspectRatio: aspect === 'auto' ? undefined : (aspect || (huge ? '16/9' : '16/10')),
      height: aspect === 'auto' ? '100%' : undefined,
      borderRadius: radius,
      background: game.bg, position: 'relative', overflow: 'hidden',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 -30px 40px -20px rgba(0,0,0,0.45)'
    }}>
      {decor}
      {/* title block */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: big ? 12 : 6,
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        fontFamily: '"Bebas Neue", "Oswald", Impact, sans-serif',
        letterSpacing: '0.04em',
        color: '#fff',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.55)) drop-shadow(0 1px 1px rgba(0,0,0,0.4))',
        padding: '0 6px'
      }}>
        {game.sub && <div style={{ fontSize: subSz, opacity: 0.9, lineHeight: 1, color: game.accent }}>{game.sub}</div>}
        <div style={{ fontSize: titleSz, fontWeight: 900, lineHeight: 0.95 }}>{game.title}</div>
      </div>
      {/* sheen — softer top highlight, smoother bottom shade */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(255,255,255,0.08) 0%, transparent 28%, transparent 65%, rgba(0,0,0,0.35) 100%)', pointerEvents: 'none' }} />
    </div>);

}
window.GameCover = GameCover;

// ─── Avatar (deterministic gradient + initials) ─────────────────────
function avatarColors(seed) {
  let h = 0;for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return [`hsl(${h} 60% 55%)`, `hsl(${(h + 50) % 360} 65% 35%)`];
}
function Avatar({ name, size = 44, ring, palette }) {
  const [a, b] = palette || avatarColors(name);
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg,${a},${b})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.36,
      boxShadow: ring ? `0 0 0 2px ${ring}` : 'inset 0 0 0 1px rgba(255,255,255,0.18)',
      flexShrink: 0, letterSpacing: '-0.02em',
      fontFamily: '-apple-system, system-ui, sans-serif'
    }}>{initials}</div>);

}
window.Avatar = Avatar;

// ─── QR Code (deterministic pseudo-random pattern) ──────────────────
function QRCode({ size = 240, payload = 'partyup://' }) {
  const N = 25;
  // seeded RNG
  let h = 0;for (let i = 0; i < payload.length; i++) h = h * 131 + payload.charCodeAt(i) >>> 0;
  const rand = () => {h ^= h << 13;h ^= h >>> 17;h ^= h << 5;return (h >>> 0) / 0xFFFFFFFF;};
  const cells = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) cells.push({ x, y, on: rand() > 0.5 });
  // finder squares (3 corners)
  const finder = (cx, cy) =>
  <g key={`f${cx}${cy}`}>
      <rect x={cx} y={cy} width="7" height="7" fill="#000" />
      <rect x={cx + 1} y={cy + 1} width="5" height="5" fill="#fff" />
      <rect x={cx + 2} y={cy + 2} width="3" height="3" fill="#000" />
    </g>;

  // mask out finder areas from random cells
  const inFinder = (x, y) =>
  x < 8 && y < 8 || x >= N - 8 && y < 8 || x < 8 && y >= N - 8;

  return (
    <div style={{ background: '#fff', padding: 18, borderRadius: 18, display: 'inline-block' }}>
      <svg width={size} height={size} viewBox={`0 0 ${N} ${N}`} shapeRendering="crispEdges">
        <rect width={N} height={N} fill="#fff" />
        {cells.filter((c) => c.on && !inFinder(c.x, c.y)).map((c, i) =>
        <rect key={i} x={c.x} y={c.y} width="1" height="1" fill="#000" />
        )}
        {finder(0, 0)}{finder(N - 7, 0)}{finder(0, N - 7)}
      </svg>
    </div>);

}
window.QRCode = QRCode;