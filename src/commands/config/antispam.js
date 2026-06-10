const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antispam')
    .setDescription('Auto-mute users who spam messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((s) => s.setName('enable').setDescription('Enable anti-spam protection'))
    .addSubcommand((s) => s.setName('disable').setDescription('Disable anti-spam protection'))
    .addSubcommand((s) => s.setName('status').setDescription('View anti-spam status')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (sub === 'enable') {
      const existing = store.getConfig(guildId, 'antispam');
      if (existing === true) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Anti-spam is already enabled.', color: colors.warning })], ephemeral: true });
      }
      store.setConfig(guildId, 'antispam', true);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Anti-spam enabled. Users sending 5+ messages in 3s will be muted for 1 minute.', color: colors.success })] });
    }

    if (sub === 'disable') {
      const existing = store.getConfig(guildId, 'antispam');
      if (!existing) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Anti-spam is not currently enabled.', color: colors.warning })], ephemeral: true });
      }
      store.setConfig(guildId, 'antispam', false);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Anti-spam disabled.', color: colors.muted })] });
    }

    const enabled = store.getConfig(guildId, 'antispam');
    return interaction.reply({ embeds: [response({ client: interaction.client, description: `**Anti-Spam:** ${enabled ? 'Enabled' : 'Disabled'}\n**Threshold:** 5 messages in 3 seconds\n**Action:** 1 minute timeout + delete messages`, color: colors.primary })] });
  },
};
