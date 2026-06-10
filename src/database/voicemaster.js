const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'data', 'sonder.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS voicemaster_config (
    guild_id TEXT PRIMARY KEY,
    join_channel_id TEXT NOT NULL,
    category_id TEXT
  );
  CREATE TABLE IF NOT EXISTS voicemaster_channels (
    channel_id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL
  );
`);

const stmts = {
  setConfig: db.prepare('INSERT OR REPLACE INTO voicemaster_config (guild_id, join_channel_id, category_id) VALUES (?, ?, ?)'),
  getConfig: db.prepare('SELECT * FROM voicemaster_config WHERE guild_id = ?'),
  clearConfig: db.prepare('DELETE FROM voicemaster_config WHERE guild_id = ?'),
  registerChannel: db.prepare('INSERT OR REPLACE INTO voicemaster_channels (channel_id, owner_id) VALUES (?, ?)'),
  unregisterChannel: db.prepare('DELETE FROM voicemaster_channels WHERE channel_id = ?'),
  getChannel: db.prepare('SELECT * FROM voicemaster_channels WHERE channel_id = ?'),
};

module.exports = {
  setConfig(guildId, joinChannelId, categoryId) {
    stmts.setConfig.run(guildId, joinChannelId, categoryId);
  },

  getJoinChannelId(guildId) {
    return stmts.getConfig.get(guildId)?.join_channel_id || null;
  },

  getCategoryId(guildId) {
    return stmts.getConfig.get(guildId)?.category_id || null;
  },

  clearConfig(guildId) {
    stmts.clearConfig.run(guildId);
  },

  registerChannel(channelId, ownerId) {
    stmts.registerChannel.run(channelId, ownerId);
  },

  unregisterChannel(channelId) {
    stmts.unregisterChannel.run(channelId);
  },

  isVoiceMasterChannel(channelId) {
    return !!stmts.getChannel.get(channelId);
  },

  getOwner(channelId) {
    return stmts.getChannel.get(channelId)?.owner_id || null;
  },

  setOwner(channelId, ownerId) {
    stmts.registerChannel.run(channelId, ownerId);
  },
};
