// Login + Register screens for PartyUp

// ─── Shared input ──────────────────────────────────────────────────
function AuthInput({ label, type='text', value, onChange, placeholder, autoFocus, icon }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{display:'block'}}>
      <div style={{
        fontSize:11, color:TH.dim, textTransform:'uppercase',
        letterSpacing:'0.08em', marginBottom:8, fontWeight:600,
      }}>{label}</div>
      <div style={{
        display:'flex', alignItems:'center', gap:10,
        background: focus ? 'rgba(91,92,255,0.08)' : 'rgba(255,255,255,0.04)',
        border:'1px solid '+(focus ? 'rgba(91,92,255,0.55)' : 'rgba(255,255,255,0.08)'),
        borderRadius:14, padding:'0 14px',
        transition:'border-color .18s, background .18s',
      }}>
        {icon && <div style={{opacity:0.6, display:'flex'}}>{icon}</div>}
        <input
          type={type} value={value} onChange={e=>onChange(e.target.value)}
          onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
          placeholder={placeholder} autoFocus={autoFocus}
          style={{
            flex:1, background:'transparent', border:'none', outline:'none',
            color:'#fff', padding:'14px 0', fontSize:15,
            fontFamily:'inherit',
          }}
        />
      </div>
    </label>
  );
}

// ─── Hero / brand block ────────────────────────────────────────────
function AuthHero({ subtitle }) {
  return (
    <div style={{textAlign:'center', marginBottom:28}}>
      {/* Logo mark — controller silhouette + accent dot */}
      <div style={{
        width:64, height:64, margin:'0 auto 16px',
        borderRadius:18, position:'relative',
        background:'linear-gradient(140deg,#5B5CFF 0%,#7B5CFF 60%,#FF4DBF 100%)',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'0 14px 30px -10px rgba(91,92,255,0.6), inset 0 1px 0 rgba(255,255,255,0.25)',
      }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <path d="M6.5 8h11c2 0 3.5 1.7 3.5 3.7L20 16c-.2 1.5-1.5 2.5-3 2.5-1 0-1.9-.6-2.4-1.5l-.6-1.2H10l-.6 1.2c-.5.9-1.4 1.5-2.4 1.5-1.5 0-2.8-1-3-2.5L3 11.7C3 9.7 4.5 8 6.5 8z"
            stroke="#fff" strokeWidth="1.8"/>
          <circle cx="9" cy="13" r="0.9" fill="#fff"/>
          <circle cx="9" cy="13" r="1.6" stroke="#fff" strokeOpacity="0.5" strokeWidth="0.8"/>
          <circle cx="15.5" cy="12" r="1" fill="#FFD43A"/>
          <circle cx="15.5" cy="14" r="0.7" fill="#fff"/>
        </svg>
        {/* glow halo */}
        <div style={{
          position:'absolute', inset:-12, borderRadius:30,
          background:'radial-gradient(closest-side,rgba(91,92,255,0.4),transparent)',
          zIndex:-1,
        }}/>
      </div>
      <div style={{
        fontSize:30, fontWeight:700, color:'#fff', letterSpacing:'-0.02em',
        fontFamily:'inherit',
      }}>
        Party<span style={{color:TH.accent}}>Up</span>
      </div>
      <div style={{
        fontSize:13, color:TH.dim, marginTop:6,
      }}>{subtitle}</div>
    </div>
  );
}

// ─── Social row ────────────────────────────────────────────────────
function SocialRow({ onClick }) {
  const Btn = ({ children, title }) => (
    <button onClick={()=>onClick && onClick(title)} title={title} style={{
      flex:1, background:'rgba(255,255,255,0.04)',
      border:'1px solid rgba(255,255,255,0.08)', borderRadius:12,
      height:48, display:'flex', alignItems:'center', justifyContent:'center',
      cursor:'pointer', color:'#fff', transition:'background .15s',
    }}
    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}
    onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}
    >{children}</button>
  );
  return (
    <div style={{display:'flex', gap:8}}>
      <Btn title="Continue with Discord">
        <svg width="22" height="22" viewBox="0 0 256 199" preserveAspectRatio="xMidYMid">
          <path fill="#5865F2" d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.355-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"/>
        </svg>
      </Btn>
      <Btn title="Continue with Google">
        <svg width="22" height="22" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
          <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
          <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
          <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
        </svg>
      </Btn>
      <Btn title="Continue with Steam">
        <svg width="22" height="22" viewBox="0 0 256 256">
          <defs>
            <radialGradient id="steamGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#111d2e"/>
              <stop offset="100%" stopColor="#06080e"/>
            </radialGradient>
          </defs>
          <circle cx="128" cy="128" r="128" fill="url(#steamGrad)"/>
          <path fill="#fff" d="M128 28C72.4 28 27.3 70.4 23.3 124.4l54 22.4c4.6-3.1 10.1-5 16.1-5 .5 0 1.1 0 1.6.1l24-34.8v-.5c0-20.9 17-37.9 38-37.9s38 17 38 37.9-17 37.9-38 37.9h-.9l-34.3 24.5c0 .4.1.9.1 1.4 0 16.1-13.1 29.2-29.2 29.2-14.1 0-25.9-10-28.6-23.3l-38.6-16C39 187.3 80.1 228 128 228c55.2 0 100-44.8 100-100S183.2 28 128 28z"/>
          <path fill="#fff" d="M85 187.6l-12.4-5.1c2.2 4.6 6 8.4 11 10.5 10.8 4.5 23.3-.6 27.8-11.5 2.2-5.2 2.2-11 0-16.3-2.2-5.3-6.3-9.4-11.6-11.6-5.2-2.2-10.8-2.1-15.7-.4l12.8 5.3c8 3.3 11.8 12.5 8.5 20.5-3.3 8.1-12.5 11.9-20.4 8.6zm105.3-72.2c0-13.9-11.3-25.2-25.3-25.2s-25.3 11.3-25.3 25.2 11.3 25.2 25.3 25.2 25.3-11.3 25.3-25.2zm-44.3 0c0-10.5 8.5-19 19-19 10.6 0 19 8.5 19 19s-8.5 19-19 19-19-8.5-19-19z"/>
        </svg>
      </Btn>
    </div>
  );
}

// ─── Divider ───────────────────────────────────────────────────────
function OrDivider() {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10,
      margin:'18px 0',
    }}>
      <div style={{flex:1, height:1, background:'rgba(255,255,255,0.08)'}}/>
      <div style={{
        color:TH.dim2, fontSize:11, textTransform:'uppercase',
        letterSpacing:'0.1em',
      }}>or</div>
      <div style={{flex:1, height:1, background:'rgba(255,255,255,0.08)'}}/>
    </div>
  );
}

// ─── Decorative background blobs (gaming vibe) ─────────────────────
function AuthBg() {
  return (
    <div style={{position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0}}>
      <div style={{
        position:'absolute', top:-60, right:-80, width:280, height:280,
        borderRadius:'50%',
        background:'radial-gradient(closest-side,rgba(91,92,255,0.5),transparent)',
        filter:'blur(20px)',
      }}/>
      <div style={{
        position:'absolute', bottom:-80, left:-80, width:280, height:280,
        borderRadius:'50%',
        background:'radial-gradient(closest-side,rgba(255,77,191,0.35),transparent)',
        filter:'blur(20px)',
      }}/>
      <div style={{
        position:'absolute', top:'40%', left:'-30%', width:300, height:200,
        background:'radial-gradient(closest-side,rgba(63,209,106,0.18),transparent)',
        filter:'blur(20px)',
      }}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// LOGIN
// ════════════════════════════════════════════════════════════════════
function LoginScreen({ nav }) {
  const [email, setEmail] = React.useState('');
  const [pwd, setPwd]     = React.useState('');
  const [remember, setRemember] = React.useState(true);
  const valid = email.includes('@') && pwd.length >= 4;

  return (
    <div style={{position:'absolute', inset:0, overflow:'auto'}}>
      <AuthBg/>
      <div style={{
        position:'relative', zIndex:1,
        padding:'70px 26px 36px',
        minHeight:'100%',
        display:'flex', flexDirection:'column',
      }}>
        <AuthHero subtitle="Welcome back, player."/>

        <SocialRow/>
        <OrDivider/>

        <div style={{display:'flex', flexDirection:'column', gap:14}}>
          <AuthInput label="Email" type="email" value={email} onChange={setEmail}
            placeholder="you@example.com" autoFocus
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#fff" strokeWidth="1.8"/><path d="M3 7l9 6 9-6" stroke="#fff" strokeWidth="1.8"/></svg>}
          />
          <AuthInput label="Password" type="password" value={pwd} onChange={setPwd}
            placeholder="••••••••"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#fff" strokeWidth="1.8"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#fff" strokeWidth="1.8"/></svg>}
          />
        </div>

        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          marginTop:14,
        }}>
          <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}
            onClick={()=>setRemember(r=>!r)}>
            <div style={{
              width:18, height:18, borderRadius:6,
              background: remember ? TH.accent : 'rgba(255,255,255,0.06)',
              border:'1px solid '+(remember ? TH.accent : 'rgba(255,255,255,0.15)'),
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all .15s',
            }}>
              {remember && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l4.5 4.5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span style={{color:TH.dim, fontSize:13}}>Remember me</span>
          </label>
          <a href="#" onClick={e=>e.preventDefault()} style={{
            color:TH.accent2, fontSize:13, textDecoration:'none', fontWeight:500,
          }}>Forgot password?</a>
        </div>

        <button
          disabled={!valid}
          onClick={()=>nav.reset('search')}
          style={{
            marginTop:22, background: valid ? TH.accent : 'rgba(255,255,255,0.1)',
            color:'#fff', border:'none', padding:'16px', borderRadius:14,
            fontSize:16, fontWeight:600, cursor: valid ? 'pointer' : 'not-allowed',
            boxShadow: valid ? '0 12px 30px rgba(91,92,255,0.4)' : 'none',
            opacity: valid ? 1 : 0.55,
            fontFamily:'inherit',
            transition:'all .18s',
          }}>Sign in</button>

        <div style={{
          textAlign:'center', marginTop:'auto', paddingTop:22,
          color:TH.dim, fontSize:14,
        }}>
          New to PartyUp?{' '}
          <a href="#" onClick={e=>{e.preventDefault(); nav.reset('register');}} style={{
            color:'#fff', fontWeight:600, textDecoration:'none',
          }}>Create an account</a>
        </div>
      </div>
    </div>
  );
}
window.LoginScreen = LoginScreen;

// ════════════════════════════════════════════════════════════════════
// REGISTER
// ════════════════════════════════════════════════════════════════════
function RegisterScreen({ nav }) {
  const [name, setName]   = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pwd, setPwd]     = React.useState('');
  const [country, setCountry] = React.useState({ name:'United States' });
  const [countryOpen, setCountryOpen] = React.useState(false);
  const COUNTRIES = [
    { name:'United States' }, { name:'United Kingdom' }, { name:'Canada' },
    { name:'Mexico' }, { name:'Brazil' }, { name:'Argentina' },
    { name:'Spain' }, { name:'France' }, { name:'Germany' },
    { name:'Netherlands' }, { name:'Italy' }, { name:'Poland' },
    { name:'Sweden' }, { name:'Norway' }, { name:'Finland' },
    { name:'Israel' }, { name:'Turkey' }, { name:'Russia' },
    { name:'Japan' }, { name:'South Korea' }, { name:'China' },
    { name:'India' }, { name:'Singapore' }, { name:'Philippines' },
    { name:'Australia' }, { name:'New Zealand' }, { name:'South Africa' },
  ];
  const valid = name.length >= 2 && email.includes('@') && pwd.length >= 6;
  // password strength
  const strength = Math.min(4, [
    pwd.length >= 6,
    /[A-Z]/.test(pwd),
    /[0-9]/.test(pwd),
    /[^A-Za-z0-9]/.test(pwd) || pwd.length >= 10,
  ].filter(Boolean).length);
  const strengthLabel = ['','Weak','Fair','Good','Strong'][strength];
  const strengthColor = ['rgba(255,255,255,0.08)','#FF6B6B','#FFB13A','#FFD43A','#3FD16A'][strength];

  return (
    <div style={{position:'absolute', inset:0, overflow:'auto'}}>
      <AuthBg/>
      <div style={{
        position:'relative', zIndex:1,
        padding:'70px 26px 36px',
        minHeight:'100%',
        display:'flex', flexDirection:'column',
      }}>
        <AuthHero subtitle="Create your gamer profile."/>

        <div style={{display:'flex', flexDirection:'column', gap:14}}>
          <AuthInput label="Display name" value={name} onChange={setName}
            placeholder="Your name" autoFocus
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth="1.8"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="#fff" strokeWidth="1.8"/></svg>}
          />
          <AuthInput label="Email" type="email" value={email} onChange={setEmail}
            placeholder="you@example.com"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#fff" strokeWidth="1.8"/><path d="M3 7l9 6 9-6" stroke="#fff" strokeWidth="1.8"/></svg>}
          />

          {/* Country */}
          <div>
            <div style={{
              fontSize:11, color:TH.dim, textTransform:'uppercase',
              letterSpacing:'0.08em', marginBottom:8, fontWeight:600,
            }}>Country</div>
            <button onClick={()=>setCountryOpen(true)} style={{
              width:'100%', display:'flex', alignItems:'center', gap:12,
              background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:14, padding:'14px 16px', cursor:'pointer',
              color:'#fff', fontFamily:'inherit', fontSize:15,
              textAlign:'left', transition:'background .15s, border-color .15s',
            }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(91,92,255,0.08)'; e.currentTarget.style.borderColor='rgba(91,92,255,0.4)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';}}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{opacity:0.6}}>
                <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.8"/>
                <path d="M3 12h18M12 3a13.5 13.5 0 0 1 0 18M12 3a13.5 13.5 0 0 0 0 18" stroke="#fff" strokeWidth="1.8"/>
              </svg>
              <span style={{flex:1}}>{country.name}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{opacity:0.6}}>
                <path d="M6 9l6 6 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Password */}
          <div>
            <AuthInput label="Password" type="password" value={pwd} onChange={setPwd}
              placeholder="At least 6 characters"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#fff" strokeWidth="1.8"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#fff" strokeWidth="1.8"/></svg>}
            />
            {pwd.length > 0 && (
              <div style={{marginTop:8, display:'flex', alignItems:'center', gap:8}}>
                <div style={{flex:1, height:4, borderRadius:4, background:'rgba(255,255,255,0.06)', overflow:'hidden'}}>
                  <div style={{
                    width: (strength/4*100)+'%', height:'100%',
                    background: strengthColor, transition:'all .25s',
                  }}/>
                </div>
                <div style={{
                  color: strengthColor, fontSize:11, fontWeight:600,
                  letterSpacing:'0.04em', width:50, textAlign:'right',
                }}>{strengthLabel}</div>
              </div>
            )}
          </div>
        </div>

        <div style={{marginTop:18, color:TH.dim2, fontSize:11, lineHeight:1.5}}>
          By signing up, you agree to our{' '}
          <a href="#" onClick={e=>e.preventDefault()} style={{color:TH.dim, textDecoration:'underline'}}>Terms</a>
          {' '}and{' '}
          <a href="#" onClick={e=>e.preventDefault()} style={{color:TH.dim, textDecoration:'underline'}}>Privacy Policy</a>.
        </div>

        <button
          disabled={!valid}
          onClick={()=>nav.reset('search')}
          style={{
            marginTop:14, background: valid ? TH.accent : 'rgba(255,255,255,0.1)',
            color:'#fff', border:'none', padding:'16px', borderRadius:14,
            fontSize:16, fontWeight:600, cursor: valid ? 'pointer' : 'not-allowed',
            boxShadow: valid ? '0 12px 30px rgba(91,92,255,0.4)' : 'none',
            opacity: valid ? 1 : 0.55,
            fontFamily:'inherit', transition:'all .18s',
          }}>Create account</button>

        <div style={{
          textAlign:'center', marginTop:'auto', paddingTop:22,
          color:TH.dim, fontSize:14,
        }}>
          Already have an account?{' '}
          <a href="#" onClick={e=>{e.preventDefault(); nav.reset('login');}} style={{
            color:'#fff', fontWeight:600, textDecoration:'none',
          }}>Sign in</a>
        </div>
      </div>

      {countryOpen && (
        <CountrySheet
          countries={COUNTRIES}
          selected={country}
          onPick={(c)=>{ setCountry(c); setCountryOpen(false); }}
          onClose={()=>setCountryOpen(false)}
        />
      )}
    </div>
  );
}
window.RegisterScreen = RegisterScreen;

// ─── Country picker sheet ──────────────────────────────────────────
function CountrySheet({ countries, selected, onPick, onClose }) {
  const [q, setQ] = React.useState('');
  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div onClick={onClose} style={{
      position:'absolute', inset:0, background:'rgba(0,0,0,0.55)',
      zIndex:100, display:'flex', alignItems:'flex-end',
      animation:'fadeIn .2s ease both',
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'100%', height:'72%',
        background:'#162548', borderRadius:'24px 24px 0 0',
        padding:'12px 0 24px',
        boxShadow:'0 -10px 40px rgba(0,0,0,0.5)',
        animation:'sheetUp .3s cubic-bezier(.2,.7,.2,1) both',
        display:'flex', flexDirection:'column',
      }}>
        <div style={{
          width:40, height:4, borderRadius:99, background:'rgba(255,255,255,0.25)',
          margin:'0 auto 12px',
        }}/>
        <div style={{
          fontSize:13, color:TH.dim, textTransform:'uppercase',
          letterSpacing:'0.08em', textAlign:'center', marginBottom:12,
        }}>Select country</div>
        <div style={{padding:'0 18px 10px'}}>
          <div style={{
            display:'flex', alignItems:'center', gap:10,
            background:'rgba(255,255,255,0.06)',
            border:'1px solid rgba(255,255,255,0.08)',
            borderRadius:99, padding:'10px 14px',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="10.5" cy="10.5" r="6.5" stroke="#fff" strokeOpacity="0.6" strokeWidth="2"/>
              <path d="M15.5 15.5L20 20" stroke="#fff" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input value={q} onChange={e=>setQ(e.target.value)}
              placeholder="Search country" autoFocus
              style={{
                flex:1, background:'transparent', border:'none', outline:'none',
                color:'#fff', fontSize:14, fontFamily:'inherit',
              }}
            />
          </div>
        </div>
        <div style={{flex:1, overflowY:'auto', padding:'0 10px'}}>
          {filtered.map(c => {
            const active = c.name === selected.name;
            return (
              <button key={c.name} onClick={()=>onPick(c)} style={{
                width:'100%', display:'flex', alignItems:'center', gap:12,
                background: active ? 'rgba(91,92,255,0.18)' : 'transparent',
                border:'none', cursor:'pointer', textAlign:'left',
                padding:'14px 14px', borderRadius:12,
                color:'#fff', fontFamily:'inherit', fontSize:15,
                transition:'background .12s',
              }}
              onMouseEnter={e=>{ if(!active) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
              onMouseLeave={e=>{ if(!active) e.currentTarget.style.background='transparent'; }}
              >
                <span style={{flex:1, fontWeight: active ? 600 : 500}}>{c.name}</span>
                {active && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12.5l4.5 4.5L19 7.5" stroke={TH.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div style={{textAlign:'center', color:TH.dim, padding:'30px 0', fontSize:14}}>
              No country matches "{q}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
