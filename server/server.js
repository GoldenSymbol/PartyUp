// PartyUp server bootstrap — loads env, connects to MongoDB, starts the HTTP listener
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./socket');

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
app.set('io', io);
initSocket(io);

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`[server] PartyUp API listening on http://localhost:${PORT}`);
  });
});
