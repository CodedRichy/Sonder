const antinuke = require('../database/antinuke');
const { response } = require('../utils/embed');
const { colors } = require('../utils/constants');
const log = require('../utils/logger');

module.exports = {
  name: 'roleCreate',
  async execute(role) {
    const { guild } = role;
    if (!antinuke.isEnabled(guild.id)) return;

    const auditLogs = await guild.fetchAuditLogs({ type: 30, limit: 1 }).catch(() => null);
    if (!auditLogs) return;

    const entry = auditLogs.entries.first();
    if (!entry || Date.now() - entry.createdTimestamp > 5000) return;
    if (entry.executor.id === guild.client.user.id) return;
    if (entry.executor.id === guild.ownerId) return;

    const executorId = entry.executor.id;

    if (antinuke.check(guild.id, executorId, 'role_create')) {
      const member = guild.members.cache.get(executorId);
      if (member) {
        await member.roles.set([]).catch(() => {});
        await guild.members.ban(executorId, { reason: '[sonder antinuke] Mass role create detected' }).catch(() => {});
      }

      await role.delete('[sonder antinuke] Reversed mass role create').catch(() => {});

      const modlogChannel = require('../database/store').getConfig(guild.id, 'modlog_channel');
      if (modlogChannel) {
        const ch = guild.channels.cache.get(modlogChannel);
        if (ch) {
          ch.send({
            embeds: [response({
              client: guild.client,
              description: `**Antinuke triggered**\n**User** ${entry.executor.tag} \`${executorId}\`\n**Action** Mass role create — user banned, role deleted`,
              color: colors.error,
            })],
          }).catch(() => {});
        }
      }

      log.warn(`[antinuke] ${entry.executor.tag} triggered mass role create in ${guild.name}`);
    }
  },
};
