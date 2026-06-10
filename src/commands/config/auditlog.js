const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');
const { createConfigChannel, CHANNEL_DEFAULTS } = require('../../utils/channelCreate');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('auditlog')
    .setDescription('Configure audit log channel for server events')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((s) =>
      s.setName('set')
        .setDescription('Set audit log channel')
        .addChannelOption((o) => o.setName('channel').setDescription('Channel for audit logs').setRequired(true))
    )
    .addSubcommand((s) => s.setName('create').setDescription('Create a private #audit-log channel'))
    .addSubcommand((s) => s.setName('disable').setDescription('Disable audit logging'))
    .addSubcommand((s) => s.setName('status').setDescription('View audit log config')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (sub === 'create') {
      const defaults = CHANNEL_DEFAULTS.audit_log_channel;
      const ch = await createConfigChannel(interaction.guild, { ...defaults, client: interaction.client });
      if (!ch) return interaction.reply({ embeds: [response({ client: interaction.client, description: "Couldn't create channel. Make sure I have **Manage Channels** permission.", color: colors.error })], ephemeral: true });
      store.setConfig(guildId, 'audit_log_channel', ch.id);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `Created ${ch} (private) and set as audit log channel.`, color: colors.success })] });
    }

    if (sub === 'set') {
      const channel = interaction.options.getChannel('channel');
      const existing = store.getConfig(guildId, 'audit_log_channel');
      if (existing === channel.id) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: `Audit log channel is already set to ${channel}`, color: colors.warning })], ephemeral: true });
      }
      store.setConfig(guildId, 'audit_log_channel', channel.id);
      const msg = existing ? `Audit log updated to ${channel} (was <#${existing}>). Events tracked: bans, kicks, role changes, channel changes, message deletes.` : `Audit log set to ${channel}. Events tracked: bans, kicks, role changes, channel changes, message deletes.`;
      return interaction.reply({ embeds: [response({ client: interaction.client, description: msg, color: colors.success })] });
    }

    if (sub === 'disable') {
      const existing = store.getConfig(guildId, 'audit_log_channel');
      if (!existing) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Audit logging is not configured', color: colors.warning })], ephemeral: true });
      }
      store.setConfig(guildId, 'audit_log_channel', null);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Audit logging disabled.', color: colors.muted })] });
    }

    const channelId = store.getConfig(guildId, 'audit_log_channel');
    const status = channelId ? `Logging to <#${channelId}>` : 'Disabled';
    return interaction.reply({ embeds: [response({ client: interaction.client, description: `**Audit Log:** ${status}\n\n**Events tracked:**\n• Member ban/unban/kick\n• Role changes\n• Channel create/delete\n• Message delete/bulk delete`, color: colors.primary })] });
  },
};
