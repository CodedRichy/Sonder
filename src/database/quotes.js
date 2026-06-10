const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'data', 'sonder.db');
require('fs').mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT,
    added_by TEXT,
    timestamp TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_quotes_guild ON quotes(guild_id);
`);

const stmts = {
  add: db.prepare('INSERT INTO quotes (guild_id, content, author, added_by, timestamp) VALUES (?, ?, ?, ?, ?)'),
  get: db.prepare('SELECT * FROM quotes WHERE guild_id = ? AND id = ?'),
  count: db.prepare('SELECT COUNT(*) as count FROM quotes WHERE guild_id = ?'),
  remove: db.prepare('DELETE FROM quotes WHERE guild_id = ? AND id = ?'),
  search: db.prepare('SELECT * FROM quotes WHERE guild_id = ? AND content LIKE ? LIMIT 10'),
  randomCount: db.prepare('SELECT COUNT(*) as count FROM quotes WHERE guild_id = ?'),
  randomOffset: db.prepare('SELECT * FROM quotes WHERE guild_id = ? LIMIT 1 OFFSET ?'),
};

function rowToQuote(row) {
  if (!row) return null;
  const quote = {
    id: row.id,
    content: row.content,
    savedAt: new Date(row.timestamp).getTime(),
  };
  // Parse stored JSON objects back into their original shape
  if (row.author) {
    try { quote.quotedUser = JSON.parse(row.author); } catch { quote.quotedUser = row.author; }
  } else {
    quote.quotedUser = null;
  }
  if (row.added_by) {
    try { quote.savedBy = JSON.parse(row.added_by); } catch { quote.savedBy = row.added_by; }
  } else {
    quote.savedBy = null;
  }
  return quote;
}

module.exports = {
  add(guildId, quote) {
    const timestamp = new Date().toISOString();
    // Store quotedUser and savedBy as JSON strings in the author/added_by columns
    const author = quote.quotedUser ? JSON.stringify(quote.quotedUser) : (quote.author || null);
    const addedBy = quote.savedBy ? JSON.stringify(quote.savedBy) : (quote.addedBy || null);
    const info = stmts.add.run(guildId, quote.content, author, addedBy, timestamp);
    return Number(info.lastInsertRowid);
  },

  get(guildId, id) {
    return rowToQuote(stmts.get.get(guildId, id));
  },

  random(guildId) {
    const { count } = stmts.randomCount.get(guildId);
    if (count === 0) return null;
    const offset = Math.floor(Math.random() * count);
    return rowToQuote(stmts.randomOffset.get(guildId, offset));
  },

  search(guildId, query) {
    return stmts.search.all(guildId, `%${query}%`).map(rowToQuote);
  },

  remove(guildId, id) {
    const info = stmts.remove.run(guildId, id);
    return info.changes > 0;
  },

  count(guildId) {
    return stmts.count.get(guildId).count;
  },
};
