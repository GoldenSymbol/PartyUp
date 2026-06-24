// Mock data + stylized "game cover" definitions (CSS-rendered, no external images)

const GAMES = [
  { id: 'warzone',  title: 'WARZONE',    sub: 'CALL OF DUTY', bg: 'linear-gradient(160deg,#3a4a3a 0%,#1a201a 60%,#0a0e0a 100%)', accent: '#8FA37A', vibe: 'military' },
  { id: 'rust',     title: 'RUST',       sub: '',             bg: 'linear-gradient(180deg,#3d2918 0%,#1a0f08 100%)', accent: '#D86A2C', vibe: 'silhouette' },
  { id: 'persona',  title: 'P5',         sub: 'PERSONA',      bg: 'linear-gradient(135deg,#9B1414 0%,#3a0606 100%)', accent: '#FFD700', vibe: 'mask' },
  { id: 'lol',      title: 'LEAGUE OF',  sub: 'LEGENDS',      bg: 'linear-gradient(180deg,#0a3a6e 0%,#020c1f 100%)', accent: '#C8A765', vibe: 'crest' },
  { id: 'overwatch',title: 'OVERWATCH',  sub: '',             bg: 'linear-gradient(135deg,#F09030 0%,#a14e10 60%,#3a1d05 100%)', accent: '#ffffff', vibe: 'hex' },
  { id: 'amongus',  title: 'AMONG US',   sub: '',             bg: 'linear-gradient(180deg,#7c2cc4 0%,#3a1062 100%)', accent: '#ff4757', vibe: 'crewmate' },
  { id: 'cs',       title: 'COUNTER',    sub: 'STRIKE',       bg: 'linear-gradient(180deg,#1a1a1a 0%,#000 100%)', accent: '#F58220', vibe: 'crosshair' },
  { id: 'minecraft',title: 'MINECRAFT',  sub: '',             bg: 'linear-gradient(180deg,#4a8a3a 0%,#1f4218 100%)', accent: '#9BD66B', vibe: 'pixel' },
  { id: 'apex',     title: 'APEX',       sub: 'LEGENDS',      bg: 'linear-gradient(180deg,#c4a014 0%,#1a1408 100%)', accent: '#E8C547', vibe: 'apex' },
  { id: 'valorant', title: 'VALORANT',   sub: '',             bg: 'linear-gradient(135deg,#ff4655 0%,#7a1a22 100%)', accent: '#0f1923', vibe: 'tactical' },
  { id: 'dbfz',     title: 'DBFZ',       sub: 'DRAGON BALL',  bg: 'linear-gradient(135deg,#ffa820 0%,#c44a14 60%,#3a1a05 100%)', accent: '#fff', vibe: 'aura' },
  { id: 'fortnite', title: 'FORTNITE',   sub: '',             bg: 'linear-gradient(180deg,#7e3ff2 0%,#1d0a52 100%)', accent: '#00d4ff', vibe: 'storm' },
];

const PLAYERS_DUO = [
  { id: 'bruce',     name: 'Bruce Green',      bio: 'Searching for a high rank player.', avatar: 'avBruce',     flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England', rank: 'pro',     fav: true,  about: 'I play professional competitive shooting games.', ping: 24,  hours: 412 },
  { id: 'harry',     name: 'Harry Reid',       bio: 'Casual games.',                     avatar: 'avHarry',     flag: '🇺🇸', country: 'USA',     rank: 'casual',  fav: false, about: 'Just here to chill and have fun.',                ping: 78,  hours: 38  },
  { id: 'carmen',    name: 'Carmen Sullivan',  bio: 'High rank games.',                  avatar: 'avCarmen',    flag: '🇪🇸', country: 'Spain',   rank: 'pro',     fav: true,  about: 'Diamond ranked. Looking for tryhards only.',     ping: 32,  hours: 287 },
  { id: 'patrick',   name: 'Patrick Gibson',   bio: 'Fun games, not serious.',           avatar: 'avPatrick',   flag: '🇨🇦', country: 'Canada',  rank: 'casual',  fav: false, about: 'Memes, jokes, and the occasional W.',            ping: 92,  hours: 61  },
  { id: 'harryg',    name: 'Harry Guerrero',   bio: 'Trying to rank up.',                avatar: 'avHarryG',    flag: '🇲🇽', country: 'Mexico',  rank: 'amateur', fav: false, about: 'Grinding ranked every night after work.',        ping: 56,  hours: 145 },
  { id: 'kyle',      name: 'Kyle Guerrero',    bio: 'Searching for a high rank player.', avatar: 'avKyle',      flag: '🇦🇺', country: 'Australia', rank: 'pro',   fav: true,  about: 'Top 500 last season. Comms required.',           ping: 145, hours: 520 },
  { id: 'elizabeth', name: 'Elizabeth Banks',  bio: 'Playing for fun!',                  avatar: 'avElizabeth', flag: '🇬🇧', country: 'UK',      rank: 'casual',  fav: false, about: 'New-ish to the game, learning the ropes.',       ping: 19,  hours: 14  },
  { id: 'marco',     name: 'Marco Visser',     bio: 'Looking for duo partner.',          avatar: 'avMarco',     flag: '🇳🇱', country: 'Netherlands', rank: 'amateur', fav: false, about: 'Mic on, vibes high. Mid-tier ranked.',        ping: 41,  hours: 198 },
];

const PLAYERS_SQUAD = [
  { id: 'team-alpha',  name: 'Team Alpha',     bio: '3/4 — need IGL.',          members: 3, max: 4, rank: 'pro',     fav: true,  ping: 28,  hours: 380 },
  { id: 'team-nova',   name: 'Nova Squad',     bio: '2/4 — chill ranked.',       members: 2, max: 4, rank: 'amateur', fav: false, ping: 65,  hours: 120 },
  { id: 'team-blue',   name: 'Blue Wave',      bio: '3/4 — need support main.',  members: 3, max: 4, rank: 'amateur', fav: false, ping: 44,  hours: 215 },
  { id: 'team-pixel',  name: 'Pixel Riot',     bio: '1/4 — looking for trio.',   members: 1, max: 4, rank: 'casual',  fav: false, ping: 102, hours: 28  },
  { id: 'team-tempo',  name: 'Tempo',          bio: '3/4 — high ELO.',           members: 3, max: 4, rank: 'pro',     fav: true,  ping: 22,  hours: 460 },
  { id: 'team-late',   name: 'Late Night',     bio: '2/4 — EU evenings.',        members: 2, max: 4, rank: 'casual',  fav: false, ping: 88,  hours: 75  },
];

// My profile
const ME = {
  name: 'Neev Chordeker',
  flag: '🇮🇱',
  about: 'Casual gamer that plays for fun. I prefer squad games with fun and not competitive players',
  mostPlayed: [
    { gameId: 'dbfz',     hours: 165.2, skill: 0.55 },
    { gameId: 'valorant', hours: 75.5,  skill: 0.48 },
    { gameId: 'overwatch',hours: 42.1,  skill: 0.36 },
  ],
  recent: [
    { gameId: 'valorant', when: '2h ago',  result: 'Won 13–7' },
    { gameId: 'amongus',  when: 'Yesterday', result: '4 imposter wins' },
    { gameId: 'dbfz',     hours: 0, when: '2d ago', result: 'Ranked +24' },
    { gameId: 'minecraft', when: 'Last week', result: 'Built a fortress' },
  ],
};

window.GAMES = GAMES;
window.PLAYERS_DUO = PLAYERS_DUO;
window.PLAYERS_SQUAD = PLAYERS_SQUAD;
window.ME = ME;
window.gameById = (id) => GAMES.find(g => g.id === id);
