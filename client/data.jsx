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
  { id: 'fifa',     title: 'FIFA',       sub: '',             bg: 'linear-gradient(160deg,#0a3a1a 0%,#021a0a 100%)', accent: '#4ADE80', vibe: '' },
  { id: 'rocketleague', title: 'ROCKET', sub: 'LEAGUE',       bg: 'linear-gradient(135deg,#FF7A18 0%,#1a0a3a 70%,#05010a 100%)', accent: '#3FA8FF', vibe: 'storm' },
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

// Registered users — also doubles as the course's required demo-data table
const USERS = [
  { id: 'menalu', name: 'Menalu', role: 'regular', platform: 'PC',         region: 'Israel', skillLevel: 'Intermediate', favoriteGames: ['valorant', 'fortnite'] },
  { id: 'niv',    name: 'Niv',    role: 'host',    platform: 'PlayStation', region: 'Israel', skillLevel: 'Advanced',     favoriteGames: ['fifa', 'rocketleague'] },
  { id: 'trngo',  name: 'Trngo',  role: 'regular', platform: 'PC',         region: 'Europe', skillLevel: 'Beginner',     favoriteGames: ['minecraft', 'fortnite'] },
  { id: 'mosh',   name: 'Mosh',   role: 'regular', platform: 'Xbox',       region: 'Israel', skillLevel: 'Intermediate', favoriteGames: ['warzone', 'apex'] },
  { id: 'noa',    name: 'Noa',    role: 'host',    platform: 'PC',         region: 'Israel', skillLevel: 'Advanced',     favoriteGames: ['valorant', 'lol'] },
];

// Gaming sessions / groups — Session model (spec 10.3)
const SESSIONS = [
  { id: 's1',  title: 'Valorant Ranked Squad',      gameId: 'valorant',     hostId: 'noa',   platform: 'PC',         region: 'Israel', mode: 'squad', skillLevel: 'Intermediate', description: 'Climbing to Diamond, comms required.',     maxPlayers: 5, members: ['noa', 'mosh'],   privacy: 'private', status: 'open', startTime: 'Tonight 21:00',  createdAt: '2026-06-10' },
  { id: 's2',  title: 'Fortnite Casual Duo',        gameId: 'fortnite',     hostId: 'trngo', platform: 'PC',         region: 'Europe', mode: 'duo',   skillLevel: 'Beginner',     description: 'Just here to have fun, no sweats.',          maxPlayers: 2, members: ['trngo'],         privacy: 'public',  status: 'open', startTime: 'Today 18:00',    createdAt: '2026-06-12' },
  { id: 's3',  title: 'Minecraft Survival Team',    gameId: 'minecraft',    hostId: 'trngo', platform: 'PC',         region: 'Europe', mode: 'squad', skillLevel: 'Beginner',     description: 'Building a base, all welcome.',              maxPlayers: 6, members: ['trngo', 'menalu'], privacy: 'public',  status: 'open', startTime: 'Flexible',       createdAt: '2026-06-09' },
  { id: 's4',  title: 'FIFA Weekend Match',         gameId: 'fifa',         hostId: 'niv',   platform: 'PlayStation', region: 'Israel', mode: 'duo',   skillLevel: 'Advanced',     description: 'Pro clubs, weekend league push.',            maxPlayers: 2, members: ['niv'],           privacy: 'public',  status: 'open', startTime: 'Saturday 20:00', createdAt: '2026-06-11' },
  { id: 's5',  title: 'Rocket League 2v2',          gameId: 'rocketleague', hostId: 'niv',   platform: 'PlayStation', region: 'Israel', mode: 'duo',   skillLevel: 'Advanced',     description: 'Champion rank, looking for a flex.',         maxPlayers: 2, members: ['niv'],           privacy: 'public',  status: 'open', startTime: 'Tomorrow 19:00', createdAt: '2026-06-13' },
  { id: 's6',  title: 'Apex Legends Night Squad',   gameId: 'apex',         hostId: 'mosh',  platform: 'Xbox',       region: 'Israel', mode: 'squad', skillLevel: 'Intermediate', description: 'Late-night ranked grind.',                  maxPlayers: 3, members: ['mosh', 'menalu'], privacy: 'private', status: 'open', startTime: '22:30',          createdAt: '2026-06-08' },
  { id: 's7',  title: 'Call of Duty Tactical Team', gameId: 'warzone',      hostId: 'mosh',  platform: 'Xbox',       region: 'Israel', mode: 'squad', skillLevel: 'Intermediate', description: 'Resurgence, callouts only.',                 maxPlayers: 4, members: ['mosh', 'menalu'], privacy: 'public',  status: 'open', startTime: 'Now',            createdAt: '2026-06-14' },
  { id: 's8',  title: 'League of Legends Ranked Flex', gameId: 'lol',       hostId: 'noa',   platform: 'PC',         region: 'Israel', mode: 'squad', skillLevel: 'Advanced',     description: 'Flex queue, Plat+ only.',                    maxPlayers: 5, members: ['noa'],           privacy: 'private', status: 'open', startTime: '21:30',          createdAt: '2026-06-07' },
  { id: 's9',  title: 'Valorant Chill Duo',         gameId: 'valorant',     hostId: 'menalu',platform: 'PC',         region: 'Israel', mode: 'duo',   skillLevel: 'Intermediate', description: 'Unrated, learning new agents.',              maxPlayers: 2, members: ['menalu'],        privacy: 'public',  status: 'open', startTime: 'Flexible',       createdAt: '2026-06-15' },
  { id: 's10', title: 'Fortnite Squad Wins',        gameId: 'fortnite',     hostId: 'mosh',  platform: 'Xbox',       region: 'Israel', mode: 'squad', skillLevel: 'Beginner',     description: 'Going for a Victory Royale.',                maxPlayers: 4, members: ['mosh'],          privacy: 'public',  status: 'open', startTime: 'Today 17:00',    createdAt: '2026-06-16' },
];

// Social posts — Post model (spec 10.4)
const POSTS = [
  { id: 'p1', authorId: 'noa',    sessionId: 's1', content: 'GG last night, hit Diamond! Same time tomorrow?', likes: 4, comments: 1, createdAt: '2026-06-20' },
  { id: 'p2', authorId: 'trngo',  sessionId: 's3', content: 'Base is looking great, added a farm today.',       likes: 2, comments: 0, createdAt: '2026-06-19' },
  { id: 'p3', authorId: 'menalu', sessionId: 's9', content: 'Trying out Sova tonight, anyone want to duo?',     likes: 1, comments: 0, createdAt: '2026-06-21' },
  { id: 'p4', authorId: 'mosh',   sessionId: 's7', content: 'Resurgence dub! That was a clean rotation.',       likes: 5, comments: 2, createdAt: '2026-06-22' },
  { id: 'p5', authorId: 'niv',    sessionId: 's4', content: 'Weekend league starts now, who is in?',            likes: 3, comments: 1, createdAt: '2026-06-22' },
];

// Requests to join private sessions — JoinRequest model (spec 10.5)
const JOIN_REQUESTS = [
  { id: 'jr1', userId: 'menalu', sessionId: 's1', status: 'pending',  message: 'Diamond peak, can comm.',          createdAt: '2026-06-22' },
  { id: 'jr2', userId: 'mosh',   sessionId: 's8', status: 'pending',  message: 'Plat 2, free tonight.',            createdAt: '2026-06-21' },
  { id: 'jr3', userId: 'trngo',  sessionId: 's6', status: 'rejected', message: 'New to the game but eager!',       createdAt: '2026-06-18' },
  { id: 'jr4', userId: 'menalu', sessionId: 's6', status: 'approved', message: 'Played apex a ton, can flex.',     createdAt: '2026-06-17' },
];

// Session chat history — ChatMessage model (spec 10.6)
const CHAT_MESSAGES = [
  { id: 'm1', sessionId: 's1', senderId: 'noa',    content: 'Hey team, queueing up in 10',     createdAt: '2026-06-22T20:50:00' },
  { id: 'm2', sessionId: 's1', senderId: 'mosh',   content: 'On it, locking in Jett',           createdAt: '2026-06-22T20:51:00' },
  { id: 'm3', sessionId: 's3', senderId: 'trngo',  content: 'Pushed some wood to the chest by spawn', createdAt: '2026-06-21T12:00:00' },
  { id: 'm4', sessionId: 's3', senderId: 'menalu', content: 'Nice, I will mine some iron',      createdAt: '2026-06-21T12:05:00' },
  { id: 'm5', sessionId: 's7', senderId: 'mosh',   content: 'Rotate west, gas is closing',      createdAt: '2026-06-23T22:10:00' },
  { id: 'm6', sessionId: 's7', senderId: 'menalu', content: 'Copy, pushing now',                createdAt: '2026-06-23T22:10:30' },
];

window.GAMES = GAMES;
window.PLAYERS_DUO = PLAYERS_DUO;
window.PLAYERS_SQUAD = PLAYERS_SQUAD;
window.ME = ME;
window.USERS = USERS;
window.SESSIONS = SESSIONS;
window.POSTS = POSTS;
window.JOIN_REQUESTS = JOIN_REQUESTS;
window.CHAT_MESSAGES = CHAT_MESSAGES;
window.CURRENT_USER_ID = 'menalu'; // demo logged-in user; switched by LoginScreen
window.gameById = (id) => GAMES.find(g => g.id === id);
window.userById = (id) => USERS.find(u => u.id === id);
