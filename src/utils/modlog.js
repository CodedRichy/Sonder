const store = require('../database/store');
const { modAction } = require('./embed');
const { colors } = require('./constants');

const actionColors = {
  ban: colors.error,
  unban: colors.success,
  kick: colors.warning,
  mute: colors.warning,
  unmute: colors.success,
  warn: colors.warning,
  clearwarns: colors.info,
  lock: colors.muted,
  unlock: colors.success,
  purge: colors.info,
  softban: colors.error,
};

async function send(guild, { action, target, moderator, reason, extra, duration }) {
  const channelId = store.getConfig(guild.id, 'modlog_channel');
  if (!channelId) return;

  const channel = guild.channels.cache.get(channelId);
  if (!channel) return;

  const embed = modAction({
    client: guild.client,
    action,
    color: actionColors[action] || colors.primary,
    target,
    moderator,
    reason,
    duration,
    extra,
  });

  await channel.send({ embeds: [embed] }).catch(() => {});
}

module.exports = { send };
