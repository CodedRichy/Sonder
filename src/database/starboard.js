const store = require('./store');

const starredMessages = new Map();

function getKey(guildId, messageId) {
  return `${guildId}:${messageId}`;
}

module.exports = {
  getConfig(guildId) {
    return {
      channel: store.getConfig(guildId, 'starboard_channel'),
      threshold: store.getConfig(guildId, 'starboard_threshold') || 3,
      emoji: store.getConfig(guildId, 'starboard_emoji') || '⭐',
      selfStar: store.getConfig(guildId, 'starboard_selfstar') ?? false,
    };
  },

  getStarboardMessageId(guildId, messageId) {
    return starredMessages.get(getKey(guildId, messageId)) || null;
  },

  setStarboardMessageId(guildId, messageId, starboardMsgId) {
    starredMessages.set(getKey(guildId, messageId), starboardMsgId);
  },
};
