// PartyUp server bootstrap — loads env, connects to MongoDB, starts the HTTP listener
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[server] PartyUp API listening on http://localhost:${PORT}`);
  });
});
