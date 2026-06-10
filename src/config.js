const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  discord: {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    defaultPrefix: ';',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  lastfm: {
    apiKey: process.env.LASTFM_API_KEY,
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  dashboard: {
    port: parseInt(process.env.DASHBOARD_PORT) || 3001,
    secret: process.env.SESSION_SECRET || 'sonder-dev-secret',
    callbackUrl: process.env.DASHBOARD_CALLBACK_URL || 'http://localhost:3000/auth/callback',
  },
};
