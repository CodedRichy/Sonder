const antinuke = require('../database/antinuke');
const { response } = require('../utils/embed');
const { colors } = require('../utils/constants');
const log = require('../utils/logger');

module.exports = {
  name: 'guildBanAdd',
  async execute(ban) {
    const { guild } = ban;
    if (!antinuke.isEnabled(guild.id)) return;

    const auditLogs = await guild.fetchAuditLogs({ type: 22, limit: 1 }).catch(() => null);
    if (!auditLogs) return;

    const entry = auditLogs.entries.first();
    if (!entry || !entry.executor) return;
    if (entry.executor.bot && entry.executor.id === guild.client.user.id) return;

    const executorId = entry.executor.id;
    if (executorId === guild.ownerId) return;

    if (antinuke.check(guild.id, executorId, 'ban')) {
      const member = guild.members.cache.get(executorId);
      if (member) {
        await member.roles.set([]).catch(() => {});
        await guild.members.ban(executorId, { reason: '[sonder antinuke] Mass ban detected' }).catch(() => {});
      }

      await guild.members.unban(ban.user.id, '[sonder antinuke] Reversed mass ban').catch(() => {});

      const modlogChannel = require('../database/store').getConfig(guild.id, 'modlog_channel');
      if (modlogChannel) {
        const ch = guild.channels.cache.get(modlogChannel);
        if (ch) {
          ch.send({
            embeds: [response({
              client: guild.client,
              description: `**Antinuke triggered**\n**User** ${entry.executor.tag} \`${executorId}\`\n**Action** Mass ban detected — user banned and roles stripped\n**Reversed** Unbanned ${ban.user.tag}`,
              color: colors.error,
            })],
          }).catch(() => {});
        }
      }

      log.warn(`[antinuke] ${entry.executor.tag} triggered mass ban in ${guild.name}`);
    }
  },
};
