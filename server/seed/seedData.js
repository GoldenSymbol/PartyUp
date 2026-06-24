// Seeds realistic demo data for PartyUp, based on the approved project
// specification (Docs/PartyUp Project Specification.pdf, section 24) —
// the same 5 demo users and example sessions the spec's defense scenario uses.
//
// Usage: npm run seed   (run from server/)

require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../models/User');
const Game = require('../models/Game');
const Session = require('../models/Session');
const Post = require('../models/Post');
const JoinRequest = require('../models/JoinRequest');
const ChatMessage = require('../models/ChatMessage');

const DEMO_PASSWORD = 'demo123';

const GAME_SEEDS = [
  { key: 'valorant', name: 'Valorant', genre: 'Tactical Shooter', platforms: ['PC'], description: '5v5 character-based tactical shooter.', popularityScore: 95 },
  { key: 'fortnite', name: 'Fortnite', genre: 'Battle Royale', platforms: ['PC', 'PlayStation', 'Xbox', 'Switch'], description: 'Battle royale building shooter.', popularityScore: 90 },
  { key: 'minecraft', name: 'Minecraft', genre: 'Sandbox', platforms: ['PC', 'PlayStation', 'Xbox', 'Switch', 'Mobile'], description: 'Sandbox building and survival game.', popularityScore: 92 },
  { key: 'fifa', name: 'FIFA', genre: 'Sports', platforms: ['PlayStation', 'Xbox'], description: 'Football simulation.', popularityScore: 80 },
  { key: 'lol', name: 'League of Legends', genre: 'MOBA', platforms: ['PC'], description: '5v5 multiplayer online battle arena.', popularityScore: 93 },
  { key: 'rocketleague', name: 'Rocket League', genre: 'Sports', platforms: ['PC', 'PlayStation', 'Xbox', 'Switch'], description: 'Vehicular soccer.', popularityScore: 78 },
  { key: 'apex', name: 'Apex Legends', genre: 'Battle Royale', platforms: ['PC', 'PlayStation', 'Xbox'], description: 'Squad-based battle royale.', popularityScore: 85 },
  { key: 'cod', name: 'Call of Duty', genre: 'FPS', platforms: ['PC', 'PlayStation', 'Xbox'], description: 'Military first-person shooter.', popularityScore: 88 },
];

const USER_SEEDS = [
  { key: 'menalu', username: 'Menalu', email: 'menalu@partyup.com', region: 'Israel', platform: 'PC', skillLevel: 'Intermediate', role: 'regular', favoriteGameKeys: ['valorant', 'fortnite'] },
  { key: 'niv', username: 'Niv', email: 'niv@partyup.com', region: 'Israel', platform: 'PlayStation', skillLevel: 'Advanced', role: 'host', favoriteGameKeys: ['fifa', 'rocketleague'] },
  { key: 'trngo', username: 'Trngo', email: 'trngo@partyup.com', region: 'Europe', platform: 'PC', skillLevel: 'Beginner', role: 'regular', favoriteGameKeys: ['minecraft', 'fortnite'] },
  { key: 'mosh', username: 'Mosh', email: 'mosh@partyup.com', region: 'Israel', platform: 'Xbox', skillLevel: 'Intermediate', role: 'regular', favoriteGameKeys: ['cod', 'apex'] },
  { key: 'noa', username: 'Noa', email: 'noa@partyup.com', region: 'Israel', platform: 'PC', skillLevel: 'Advanced', role: 'host', favoriteGameKeys: ['valorant', 'lol'] },
];

// hostKey/gameKey/memberKeys are resolved to real ObjectIds after users/games are inserted.
const SESSION_SEEDS = [
  { key: 's1', title: 'Valorant Ranked Squad', gameKey: 'valorant', hostKey: 'noa', platform: 'PC', region: 'Israel', mode: 'squad', skillLevel: 'Advanced', description: 'Climbing to Diamond, comms required.', maxPlayers: 5, memberKeys: ['noa', 'mosh'], privacy: 'private', status: 'open', startTime: 'Tonight 21:00' },
  { key: 's2', title: 'Fortnite Casual Duo', gameKey: 'fortnite', hostKey: 'mosh', platform: 'Xbox', region: 'Israel', mode: 'duo', skillLevel: 'Beginner', description: 'Just here to have fun, no sweats.', maxPlayers: 2, memberKeys: ['mosh'], privacy: 'public', status: 'open', startTime: 'Today 18:00' },
  { key: 's3', title: 'Minecraft Survival Team', gameKey: 'minecraft', hostKey: 'trngo', platform: 'PC', region: 'Europe', mode: 'squad', skillLevel: 'Beginner', description: 'Building a base, all welcome.', maxPlayers: 6, memberKeys: ['trngo', 'menalu'], privacy: 'public', status: 'open', startTime: 'Flexible' },
  { key: 's4', title: 'FIFA Weekend Match', gameKey: 'fifa', hostKey: 'niv', platform: 'PlayStation', region: 'Israel', mode: 'duo', skillLevel: 'Advanced', description: 'Pro clubs, weekend league push.', maxPlayers: 2, memberKeys: ['niv'], privacy: 'public', status: 'open', startTime: 'Saturday 20:00' },
  { key: 's5', title: 'Rocket League 2v2', gameKey: 'rocketleague', hostKey: 'niv', platform: 'PlayStation', region: 'Israel', mode: 'duo', skillLevel: 'Advanced', description: 'Champion rank, looking for a flex.', maxPlayers: 2, memberKeys: ['niv'], privacy: 'public', status: 'open', startTime: 'Tomorrow 19:00' },
  { key: 's6', title: 'Apex Legends Night Squad', gameKey: 'apex', hostKey: 'mosh', platform: 'Xbox', region: 'Israel', mode: 'squad', skillLevel: 'Intermediate', description: 'Late-night ranked grind.', maxPlayers: 3, memberKeys: ['mosh', 'menalu'], privacy: 'private', status: 'open', startTime: '22:30' },
  { key: 's7', title: 'Call of Duty Tactical Team', gameKey: 'cod', hostKey: 'mosh', platform: 'Xbox', region: 'Israel', mode: 'squad', skillLevel: 'Intermediate', description: 'Resurgence, callouts only.', maxPlayers: 4, memberKeys: ['mosh', 'menalu'], privacy: 'public', status: 'open', startTime: 'Now' },
  { key: 's8', title: 'League of Legends Ranked Flex', gameKey: 'lol', hostKey: 'noa', platform: 'PC', region: 'Israel', mode: 'squad', skillLevel: 'Advanced', description: 'Flex queue, Plat+ only.', maxPlayers: 5, memberKeys: ['noa'], privacy: 'private', status: 'open', startTime: '21:30' },
  { key: 's9', title: 'Valorant Chill Duo', gameKey: 'valorant', hostKey: 'menalu', platform: 'PC', region: 'Israel', mode: 'duo', skillLevel: 'Intermediate', description: 'Unrated, learning new agents.', maxPlayers: 2, memberKeys: ['menalu'], privacy: 'public', status: 'open', startTime: 'Flexible' },
  { key: 's10', title: 'Fortnite Squad Wins', gameKey: 'fortnite', hostKey: 'mosh', platform: 'Xbox', region: 'Israel', mode: 'squad', skillLevel: 'Beginner', description: 'Going for a Victory Royale.', maxPlayers: 4, memberKeys: ['mosh'], privacy: 'public', status: 'open', startTime: 'Today 17:00' },
];

const POST_SEEDS = [
  { authorKey: 'noa', sessionKey: 's1', content: 'GG last night, hit Diamond! Same time tomorrow?', likes: 4, comments: 1 },
  { authorKey: 'trngo', sessionKey: 's3', content: 'Base is looking great, added a farm today.', likes: 2, comments: 0 },
  { authorKey: 'menalu', sessionKey: 's9', content: 'Trying out Sova tonight, anyone want to duo?', likes: 1, comments: 0 },
  { authorKey: 'mosh', sessionKey: 's7', content: 'Resurgence dub! That was a clean rotation.', likes: 5, comments: 2 },
  { authorKey: 'niv', sessionKey: 's4', content: 'Weekend league starts now, who is in?', likes: 3, comments: 1 },
];

const JOIN_REQUEST_SEEDS = [
  { userKey: 'menalu', sessionKey: 's1', status: 'pending', message: 'Diamond peak, can comm.' },
  { userKey: 'mosh', sessionKey: 's8', status: 'pending', message: 'Plat 2, free tonight.' },
  { userKey: 'trngo', sessionKey: 's6', status: 'rejected', message: 'New to the game but eager!' },
  { userKey: 'menalu', sessionKey: 's6', status: 'approved', message: 'Played apex a ton, can flex.' },
];

const CHAT_MESSAGE_SEEDS = [
  { sessionKey: 's1', senderKey: 'noa', content: 'Hey team, queueing up in 10' },
  { sessionKey: 's1', senderKey: 'mosh', content: 'On it, locking in Jett' },
  { sessionKey: 's3', senderKey: 'trngo', content: 'Pushed some wood to the chest by spawn' },
  { sessionKey: 's3', senderKey: 'menalu', content: 'Nice, I will mine some iron' },
  { sessionKey: 's7', senderKey: 'mosh', content: 'Rotate west, gas is closing' },
  { sessionKey: 's7', senderKey: 'menalu', content: 'Copy, pushing now' },
];

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set — check server/.env');

  await mongoose.connect(uri);
  console.log(`[seed] Connected to MongoDB at ${uri}`);

  await Promise.all([
    User.deleteMany({}),
    Game.deleteMany({}),
    Session.deleteMany({}),
    Post.deleteMany({}),
    JoinRequest.deleteMany({}),
    ChatMessage.deleteMany({}),
  ]);
  console.log('[seed] Cleared existing collections');

  // Games first (users' favoriteGames reference them)
  const gameByKey = {};
  for (const g of GAME_SEEDS) {
    const doc = await Game.create({
      name: g.name, genre: g.genre, platforms: g.platforms,
      description: g.description, popularityScore: g.popularityScore,
    });
    gameByKey[g.key] = doc;
  }

  const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);
  const userByKey = {};
  for (const u of USER_SEEDS) {
    const doc = await User.create({
      username: u.username,
      email: u.email,
      passwordHash,
      region: u.region,
      platform: u.platform,
      skillLevel: u.skillLevel,
      role: u.role,
      favoriteGames: u.favoriteGameKeys.map((k) => gameByKey[k]._id),
    });
    userByKey[u.key] = doc;
  }

  const sessionByKey = {};
  for (const s of SESSION_SEEDS) {
    const doc = await Session.create({
      title: s.title,
      gameId: gameByKey[s.gameKey]._id,
      hostId: userByKey[s.hostKey]._id,
      platform: s.platform,
      region: s.region,
      mode: s.mode,
      skillLevel: s.skillLevel,
      description: s.description,
      maxPlayers: s.maxPlayers,
      members: s.memberKeys.map((k) => userByKey[k]._id),
      privacy: s.privacy,
      status: s.status,
      startTime: s.startTime,
    });
    sessionByKey[s.key] = doc;
  }

  for (const p of POST_SEEDS) {
    await Post.create({
      authorId: userByKey[p.authorKey]._id,
      sessionId: sessionByKey[p.sessionKey]._id,
      content: p.content,
      likes: p.likes,
      comments: p.comments,
    });
  }

  for (const r of JOIN_REQUEST_SEEDS) {
    await JoinRequest.create({
      userId: userByKey[r.userKey]._id,
      sessionId: sessionByKey[r.sessionKey]._id,
      status: r.status,
      message: r.message,
    });
  }

  for (const m of CHAT_MESSAGE_SEEDS) {
    await ChatMessage.create({
      sessionId: sessionByKey[m.sessionKey]._id,
      senderId: userByKey[m.senderKey]._id,
      content: m.content,
    });
  }

  console.log('[seed] Inserted demo data:');
  console.log(`  users:         ${USER_SEEDS.length}`);
  console.log(`  games:         ${GAME_SEEDS.length}`);
  console.log(`  sessions:      ${SESSION_SEEDS.length}`);
  console.log(`  posts:         ${POST_SEEDS.length}`);
  console.log(`  join requests: ${JOIN_REQUEST_SEEDS.length}`);
  console.log(`  chat messages: ${CHAT_MESSAGE_SEEDS.length}`);
  console.log('[seed] Done — demo password for all users is "demo123"');
}

run()
  .then(() => mongoose.connection.close())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed] Failed:', err);
    mongoose.connection.close().finally(() => process.exit(1));
  });
