const { Pool } = require('pg');
const config = require('../config');
const log = require('../utils/logger');

const pool = new Pool({ connectionString: config.database.url });

pool.on('error', (err) => {
  log.error('Unexpected PostgreSQL error:', err.message);
});

async function connect() {
  const client = await pool.connect();
  log.info('PostgreSQL connected');
  client.release();
}

async function query(text, params) {
  return pool.query(text, params);
}

async function disconnect() {
  await pool.end();
  log.info('PostgreSQL disconnected');
}

module.exports = { connect, query, disconnect, pool };
