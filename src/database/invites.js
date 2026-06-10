const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'data', 'sonder.db');
require('fs').mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS invites (
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    inviter_id TEXT,
    joined_at INTEGER NOT NULL,
    PRIMARY KEY (guild_id, user_id)
  );
  CREATE TABLE IF NOT EXISTS invite_counts (
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    PRIMARY KEY (guild_id, user_id)
  );
  CREATE INDEX IF NOT EXISTS idx_invites_guild ON invites(guild_id);
`);

const stmts = {
  setCount: db.prepare('INSERT OR REPLACE INTO invite_counts (guild_id, user_id, count) VALUES (?, ?, ?)'),
  getCount: db.prepare('SELECT count FROM invite_counts WHERE guild_id = ? AND user_id = ?'),
  addCount: db.prepare('INSERT INTO invite_counts (guild_id, user_id, count) VALUES (?, ?, ?) ON CONFLICT(guild_id, user_id) DO UPDATE SET count = count + ?'),
  leaderboard: db.prepare('SELECT user_id, count FROM invite_counts WHERE guild_id = ? ORDER BY count DESC LIMIT ?'),
  resetUser: db.prepare('DELETE FROM invite_counts WHERE guild_id = ? AND user_id = ?'),
  resetGuild: db.prepare('DELETE FROM invite_counts WHERE guild_id = ?'),
  resetGuildInvites: db.prepare('DELETE FROM invites WHERE guild_id = ?'),
};

module.exports = {
  setCount(guildId, userId, count) {
    stmts.setCount.run(guildId, userId, count);
  },

  getCount(guildId, userId) {
    const row = stmts.getCount.get(guildId, userId);
    return row ? row.count : 0;
  },

  addCount(guildId, userId, amount = 1) {
    stmts.addCount.run(guildId, userId, amount, amount);
    const row = stmts.getCount.get(guildId, userId);
    return row ? row.count : amount;
  },

  getLeaderboard(guildId, limit = 10) {
    return stmts.leaderboard.all(guildId, limit).map((r) => ({ userId: r.user_id, count: r.count }));
  },

  resetUser(guildId, userId) {
    stmts.resetUser.run(guildId, userId);
  },

  resetGuild(guildId) {
    stmts.resetGuild.run(guildId);
    stmts.resetGuildInvites.run(guildId);
  },
};
