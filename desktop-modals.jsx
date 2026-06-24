// PartyUp Desktop — modal dialogs

// ─── Generic centered modal ─────────────────────────────────────────
function Modal({ children, onClose, width = 460 }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn .18s ease both', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width, maxWidth: '94vw', maxHeight: '88vh',
        background: '#162548', borderRadius: 20,
        boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)',
        animation: 'modalIn .22s cubic-bezier(.2,.9,.3,1.2) both',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}
window.Modal = Modal;

function ModalClose({ onClose }) {
  return (
    <button onClick={onClose} aria-label="Close" style={{
      position: 'absolute', top: 14, right: 14, zIndex: 5,
      background: 'rgba(255,255,255,0.07)', border: 'none', cursor: 'pointer',
      width: 32, height: 32, borderRadius: 99,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

// ─── Player modal (Join / Stats / Message) ──────────────────────────
function PlayerModal({ playerId, onClose }) {
  const p = PLAYERS_DUO.find(x => x.id === playerId) || PLAYERS_DUO[0];
  const [tab, setTab] = React.useState('join');
  const [fav, setFav] = React.useState(!!p.fav);
  const [joined, setJoined] = React.useState(false);

  return (
    <Modal onClose={onClose} width={480}>
      <div style={{ position: 'relative', padding: '24px 26px 0' }}>
        <ModalClose onClose={onClose} />
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', paddingRight: 40 }}>
          <Avatar name={p.name} size={72} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 21, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{p.name}</div>
              <button onClick={() => setFav(f => !f)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                {fav ? Ico.starFill(20) : Ico.star(20, '#fff')}
              </button>
            </div>
            <div style={{ fontSize: 18, marginTop: 2 }}>{p.flag}</div>
            <div style={{ fontSize: 12.5, color: TH.dim, marginTop: 4, lineHeight: 1.4 }}>{p.about}</div>
          </div>
        </div>

        {/* tabs */}
        <div style={{ marginTop: 18, display: 'flex', gap: 22, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {[['join', 'Join'], ['stats', 'Stats'], ['message', 'Message']].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '10px 2px', color: tab === k ? '#fff' : TH.dim,
              fontSize: 14, fontWeight: 600, fontFamily: 'inherit', position: 'relative',
            }}>
              {label}
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: -1, height: 2,
                background: tab === k ? '#fff' : 'transparent', transition: 'background .2s',
              }} />
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 320, maxHeight: 420, display: 'flex', flexDirection: 'column' }}>
        {tab === 'join' && (
          joined ? (
            <div style={{ padding: '30px 26px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14 }}>
              <div style={{
                width: 84, height: 84, borderRadius: '50%', background: 'rgba(63,209,106,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 0 0 2px rgba(63,209,106,0.5)',
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12.5l4.5 4.5L19 7.5" stroke={TH.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ fontSize: 21, fontWeight: 700, color: '#fff' }}>You're in!</div>
              <div style={{ color: TH.dim, fontSize: 13.5, lineHeight: 1.45 }}>
                Joined <b style={{ color: '#fff' }}>{p.name}</b>'s lobby.<br/>Voice channel ready — say hi.
              </div>
              <button onClick={onClose} style={{
                background: TH.accent, color: '#fff', border: 'none',
                padding: '12px 28px', borderRadius: 99, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', marginTop: 4,
              }}>Done</button>
            </div>
          ) : (
            <div style={{ padding: '20px 26px 26px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: '#fff', alignSelf: 'flex-start' }}>Scan QR code to join:</div>
              <QRCode size={190} payload={`partyup://join/${p.id}`} />
              <button onClick={() => setJoined(true)} style={{
                background: TH.accent, color: '#fff', border: 'none',
                padding: '13px 26px', borderRadius: 99, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 10px 24px rgba(91,92,255,0.4)', fontFamily: 'inherit',
              }}>
                {Ico.users(17, '#fff')} Join lobby directly
              </button>
            </div>
          )
        )}

        {tab === 'stats' && (
          <div style={{ padding: '18px 26px 26px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { game: 'valorant', winrate: 62, kd: 1.34, rank: 'Diamond II' },
              { game: 'cs',       winrate: 58, kd: 1.21, rank: 'Supreme' },
              { game: 'apex',     winrate: 71, kd: 2.05, rank: 'Predator' },
            ].map(s => {
              const g = gameById(s.game);
              return (
                <div key={s.game} style={{
                  background: TH.card, borderRadius: 14, padding: 13,
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{ width: 76, flexShrink: 0, borderRadius: 10, overflow: 'hidden' }}>
                    <GameCover game={g} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{g.sub ? g.sub + ' ' : ''}{g.title}</div>
                    <div style={{ color: TH.dim, fontSize: 12, marginTop: 2 }}>{s.rank}</div>
                    <div style={{ display: 'flex', gap: 14, marginTop: 7, fontSize: 12, color: '#fff' }}>
                      <span><b>{s.winrate}%</b> <span style={{ color: TH.dim }}>WR</span></span>
                      <span><b>{s.kd}</b> <span style={{ color: TH.dim }}>K/D</span></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'message' && <DesktopChatPane player={p} />}
      </div>
    </Modal>
  );
}
window.PlayerModal = PlayerModal;

// ─── Chat pane ──────────────────────────────────────────────────────
function DesktopChatPane({ player }) {
  const seed = [
    { from: 'them', text: 'Hey! Looking to duo?', t: '10:41' },
    { from: 'me',   text: 'Yeah, what rank are you?', t: '10:42' },
    { from: 'them', text: player.rank === 'pro' ? 'Diamond II. You?' : 'Gold. Just having fun. You?', t: '10:42' },
  ];
  const [msgs, setMsgs] = React.useState(seed);
  const [draft, setDraft] = React.useState('');
  const scrollRef = React.useRef(null);

  const send = () => {
    const v = draft.trim();
    if (!v) return;
    const now = new Date();
    const time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    setMsgs(m => [...m, { from: 'me', text: v, t: time }]);
    setDraft('');
    setTimeout(() => {
      const replies = ['Sounds good!', "Let's queue.", "I'm down.", 'Send the invite.', 'On it.', 'lol fr'];
      const r = replies[Math.floor(Math.random() * replies.length)];
      const t2 = new Date();
      const time2 = String(t2.getHours()).padStart(2, '0') + ':' + String(t2.getMinutes()).padStart(2, '0');
      setMsgs(m => [...m, { from: 'them', text: r, t: time2 }]);
    }, 900 + Math.random() * 600);
  };

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs.length]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div ref={scrollRef} style={{
        flex: 1, overflowY: 'auto', padding: '16px 20px 8px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {msgs.map((m, i) => {
          const showAvatar = m.from === 'them' && (i === 0 || msgs[i - 1].from !== 'them');
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-end', gap: 8,
              justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start',
              animation: 'msgIn .25s cubic-bezier(.2,.7,.2,1) both',
            }}>
              {m.from === 'them' && (showAvatar ? <Avatar name={player.name} size={24} /> : <div style={{ width: 24 }} />)}
              <div style={{
                maxWidth: '72%',
                background: m.from === 'me' ? TH.accent : 'rgba(255,255,255,0.08)',
                color: '#fff', padding: '8px 12px',
                borderRadius: m.from === 'me' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                fontSize: 13.5, lineHeight: 1.35, wordBreak: 'break-word',
              }}>
                {m.text}
                <div style={{ fontSize: 10, opacity: 0.65, marginTop: 3, textAlign: m.from === 'me' ? 'right' : 'left' }}>{m.t}</div>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={e => { e.preventDefault(); send(); }} style={{
        padding: '10px 16px 16px', borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <input
          value={draft} onChange={e => setDraft(e.target.value)}
          placeholder={`Message ${player.name.split(' ')[0]}…`}
          style={{
            flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#fff', padding: '11px 15px', borderRadius: 99,
            fontSize: 13.5, fontFamily: 'inherit', outline: 'none',
          }}
        />
        <button type="submit" disabled={!draft.trim()} style={{
          background: draft.trim() ? TH.accent : 'rgba(255,255,255,0.08)',
          border: 'none', cursor: draft.trim() ? 'pointer' : 'default',
          width: 38, height: 38, borderRadius: 99,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .15s', flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 11l18-8-8 18-2-7-8-3z" fill="#fff"/>
          </svg>
        </button>
      </form>
    </div>
  );
}
window.DesktopChatPane = DesktopChatPane;

// ─── Host lobby modal (form → live QR) ──────────────────────────────
function HostModal({ gameId, defaultMode, onClose }) {
  const game = gameById(gameId);
  const [step, setStep] = React.useState('form');
  const [name, setName] = React.useState('');
  const [group, setGroup] = React.useState('duo');
  const [rank, setRank] = React.useState('amateur');
  const [note, setNote] = React.useState('Looking for chill teammates.');
  const defaultName = `${ME.name.split(' ')[0]}'s ${game.title} lobby`;
  const lobbyName = name.trim() || defaultName;
  const tooLong = name.length > 32;

  const Seg = ({ value, onChange, options }) => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length},1fr)`, background: 'rgba(255,255,255,0.04)', borderRadius: 11, padding: 4, gap: 0 }}>
      {options.map(([k, label]) => (
        <button key={k} onClick={() => onChange(k)} style={{
          background: value === k ? TH.accent : 'transparent',
          color: value === k ? '#fff' : TH.dim,
          border: 'none', padding: '10px 0', fontSize: 13, fontWeight: 600,
          borderRadius: 8, cursor: 'pointer', transition: 'all .2s', fontFamily: 'inherit',
        }}>{label}</button>
      ))}
    </div>
  );

  return (
    <Modal onClose={onClose} width={440}>
      <div style={{ position: 'relative', padding: '24px 26px 26px' }}>
        <ModalClose onClose={onClose} />
        {step === 'form' ? (
          <>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>Host a lobby</div>
            <div style={{ color: TH.dim, fontSize: 13, marginTop: 3 }}>{game.sub ? game.sub + ' ' : ''}{game.title}</div>

            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: TH.dim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 600 }}>Lobby name</div>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  background: TH.card, borderRadius: 11,
                  border: '1px solid ' + (tooLong ? '#FF5C5C' : 'rgba(255,255,255,0.08)'),
                }}>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder={defaultName} maxLength={48} style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    color: '#fff', padding: '12px 14px', fontSize: 14, fontFamily: 'inherit',
                  }} />
                  <div style={{ color: tooLong ? '#FF8080' : TH.dim2, fontSize: 11, paddingRight: 12, fontVariantNumeric: 'tabular-nums' }}>{name.length}/32</div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: TH.dim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 600 }}>Mode</div>
                <Seg value={group} onChange={setGroup} options={[['duo', 'Duo'], ['squad', 'Squad']]} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: TH.dim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 600 }}>Looking for</div>
                <Seg value={rank} onChange={setRank} options={[['casual', 'Casual'], ['amateur', 'Amateur'], ['pro', 'Pro']]} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: TH.dim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 600 }}>Note for teammates</div>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} style={{
                  width: '100%', boxSizing: 'border-box', resize: 'none',
                  background: TH.card, border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff', padding: '12px 14px', borderRadius: 11, fontSize: 14,
                  fontFamily: 'inherit', outline: 'none', lineHeight: 1.4,
                }} />
              </div>
            </div>

            <button disabled={tooLong} onClick={() => setStep('live')} style={{
              marginTop: 20, width: '100%',
              background: tooLong ? 'rgba(255,255,255,0.1)' : TH.accent,
              color: '#fff', border: 'none', padding: '14px', borderRadius: 12,
              fontSize: 15, fontWeight: 600, cursor: tooLong ? 'not-allowed' : 'pointer',
              boxShadow: tooLong ? 'none' : '0 10px 28px rgba(91,92,255,0.35)',
              fontFamily: 'inherit', opacity: tooLong ? 0.6 : 1,
            }}>Open lobby & show QR</button>
          </>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: 4 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px',
              borderRadius: 99, background: 'rgba(63,209,106,0.15)', color: TH.green,
              fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: TH.green, boxShadow: '0 0 8px ' + TH.green }} />
              LOBBY OPEN
            </div>
            <div style={{ fontSize: 14, color: '#fff', marginTop: 14, fontWeight: 600 }}>{lobbyName}</div>
            <div style={{ color: TH.dim, fontSize: 12.5, marginTop: 4 }}>
              {game.sub ? game.sub + ' ' : ''}{game.title} · {group === 'squad' ? 'Squad' : 'Duo'} · {rank}
            </div>
            <div style={{ marginTop: 18 }}>
              <QRCode size={190} payload={`partyup://lobby/${ME.name.replace(/\s+/g, '-')}/${game.id}`} />
            </div>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: TH.dim, fontSize: 12.5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: TH.dim, animation: 'pulse 1.4s infinite' }} />
              Waiting for players to join…
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
window.HostModal = HostModal;

// ─── Profile modals (see / select / edit / settings) ───────────────
function ProfileModals({ kind, me, saveMe, onLogout, onClose }) {
  if (kind === 'see') {
    return (
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20,
        animation: 'fadeIn .2s ease both', cursor: 'zoom-out',
      }}>
        <Avatar name={me.name} size={280} palette={me.palette} ring="rgba(255,255,255,0.15)" />
        <div style={{ color: '#fff', fontSize: 17, fontWeight: 600 }}>{me.name}</div>
      </div>
    );
  }

  if (kind === 'select') {
    return <SelectPictureModal me={me} onSave={(palette) => { saveMe({ palette }); onClose(); }} onClose={onClose} />;
  }
  if (kind === 'edit') {
    return <EditProfileModal me={me} onSave={(patch) => { saveMe(patch); onClose(); }} onClose={onClose} />;
  }
  if (kind === 'settings') {
    return <SettingsModal onLogout={onLogout} onClose={onClose} />;
  }
  return null;
}
window.ProfileModals = ProfileModals;

function SelectPictureModal({ me, onSave, onClose }) {
  const PALETTES = [
    null,
    ['#FF6B6B', '#7A1E3A'], ['#FFB13A', '#8a4a0a'], ['#3FD16A', '#0c4d24'],
    ['#3FA8FF', '#0a2a6e'], ['#5B5CFF', '#241a6e'], ['#B05BFF', '#41136e'],
    ['#FF4DBF', '#6e0a45'], ['#2dd4bf', '#0a4a42'],
  ];
  const [pick, setPick] = React.useState(me.palette || null);
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  return (
    <Modal onClose={onClose} width={420}>
      <div style={{ position: 'relative', padding: '24px 26px 26px', textAlign: 'center' }}>
        <ModalClose onClose={onClose} />
        <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Select profile picture</div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0' }}>
          <Avatar name={me.name} size={92} palette={pick} ring={TH.accent} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, justifyItems: 'center' }}>
          {PALETTES.map((p, i) => {
            const active = same(p, pick);
            return (
              <button key={i} onClick={() => setPick(p)} style={{
                background: 'none', border: 'none', padding: 2, cursor: 'pointer', borderRadius: '50%',
                boxShadow: active ? '0 0 0 2.5px ' + TH.accent : '0 0 0 1px rgba(255,255,255,0.12)',
                transform: active ? 'scale(1.08)' : 'scale(1)', transition: 'all .15s',
              }}>
                <Avatar name={me.name} size={46} palette={p} />
              </button>
            );
          })}
        </div>
        <button onClick={() => onSave(pick)} style={{
          marginTop: 22, width: '100%', background: TH.accent, color: '#fff', border: 'none',
          padding: '13px', borderRadius: 12, fontSize: 14.5, fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 10px 26px rgba(91,92,255,0.35)', fontFamily: 'inherit',
        }}>Save picture</button>
      </div>
    </Modal>
  );
}

function EditProfileModal({ me, onSave, onClose }) {
  const [name, setName] = React.useState(me.name);
  const [about, setAbout] = React.useState(me.about);
  const valid = name.trim().length >= 2;
  return (
    <Modal onClose={onClose} width={440}>
      <div style={{ position: 'relative', padding: '24px 26px 26px' }}>
        <ModalClose onClose={onClose} />
        <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Edit profile</div>
        <div style={{ fontSize: 11, color: TH.dim, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '18px 0 8px', fontWeight: 600 }}>Display name</div>
        <input value={name} onChange={e => setName(e.target.value)} maxLength={32} style={{
          width: '100%', boxSizing: 'border-box',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff', padding: '13px 15px', borderRadius: 12, fontSize: 14.5,
          fontFamily: 'inherit', outline: 'none',
        }} />
        <div style={{ fontSize: 11, color: TH.dim, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '16px 0 8px', fontWeight: 600 }}>About</div>
        <textarea value={about} onChange={e => setAbout(e.target.value)} rows={3} maxLength={140} style={{
          width: '100%', boxSizing: 'border-box', resize: 'none',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff', padding: '13px 15px', borderRadius: 12, fontSize: 14.5,
          fontFamily: 'inherit', outline: 'none', lineHeight: 1.4,
        }} />
        <div style={{ textAlign: 'right', color: TH.dim2, fontSize: 11, marginTop: 4 }}>{about.length}/140</div>
        <button disabled={!valid} onClick={() => onSave({ name: name.trim(), about: about.trim() })} style={{
          marginTop: 12, width: '100%',
          background: valid ? TH.accent : 'rgba(255,255,255,0.1)', color: '#fff', border: 'none',
          padding: '13px', borderRadius: 12, fontSize: 14.5, fontWeight: 600,
          cursor: valid ? 'pointer' : 'not-allowed', opacity: valid ? 1 : 0.55,
          boxShadow: valid ? '0 10px 26px rgba(91,92,255,0.35)' : 'none', fontFamily: 'inherit',
        }}>Save changes</button>
      </div>
    </Modal>
  );
}

function SettingsModal({ onLogout, onClose }) {
  const [toggles, setToggles] = React.useState({ notif: true, online: true, sounds: false });
  const flip = (k) => setToggles(t => ({ ...t, [k]: !t[k] }));
  const rows = [
    { k: 'notif',  label: 'Notifications',      desc: 'Invites, messages, lobby activity' },
    { k: 'online', label: 'Show online status', desc: 'Let others see when you\u2019re available' },
    { k: 'sounds', label: 'Sounds',             desc: 'In-app sound effects' },
  ];
  return (
    <Modal onClose={onClose} width={420}>
      <div style={{ position: 'relative', padding: '24px 26px 26px' }}>
        <ModalClose onClose={onClose} />
        <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Settings</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column' }}>
          {rows.map(r => (
            <div key={r.k} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#fff', fontSize: 14.5, fontWeight: 600 }}>{r.label}</div>
                <div style={{ color: TH.dim, fontSize: 12, marginTop: 2 }}>{r.desc}</div>
              </div>
              <button onClick={() => flip(r.k)} aria-pressed={toggles[r.k]} style={{
                width: 44, height: 27, borderRadius: 99, border: 'none', cursor: 'pointer',
                background: toggles[r.k] ? TH.accent : 'rgba(255,255,255,0.14)',
                position: 'relative', transition: 'background .2s', flexShrink: 0, padding: 0,
              }}>
                <span style={{
                  position: 'absolute', top: 3, left: toggles[r.k] ? 20 : 3,
                  width: 21, height: 21, borderRadius: '50%', background: '#fff',
                  transition: 'left .2s cubic-bezier(.4,1.4,.6,1)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
                }} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={onLogout} style={{
          marginTop: 18, width: '100%',
          background: 'rgba(255,107,107,0.12)', color: '#FF8080',
          border: '1px solid rgba(255,107,107,0.35)',
          padding: '13px', borderRadius: 12, fontSize: 14.5, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>Log out</button>
      </div>
    </Modal>
  );
}
