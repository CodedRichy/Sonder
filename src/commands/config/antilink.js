const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antilink')
    .setDescription('Block links in messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((s) => s.setName('enable').setDescription('Enable link filtering'))
    .addSubcommand((s) => s.setName('disable').setDescription('Disable link filtering'))
    .addSubcommand((s) =>
      s.setName('whitelist')
        .setDescription('Whitelist a domain')
        .addStringOption((o) => o.setName('domain').setDescription('Domain to allow (e.g. youtube.com)').setRequired(true))
    )
    .addSubcommand((s) => s.setName('status').setDescription('View antilink configuration')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (sub === 'enable') {
      const existing = store.getConfig(guildId, 'antilink');
      if (existing === true) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Antilink is already enabled.', color: colors.warning })], ephemeral: true });
      }
      store.setConfig(guildId, 'antilink', true);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Antilink enabled. Links will be deleted.', color: colors.success })] });
    }

    if (sub === 'disable') {
      const existing = store.getConfig(guildId, 'antilink');
      if (!existing) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Antilink is not currently enabled.', color: colors.warning })], ephemeral: true });
      }
      store.setConfig(guildId, 'antilink', false);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Antilink disabled.', color: colors.muted })] });
    }

    if (sub === 'whitelist') {
      const domain = interaction.options.getString('domain').trim().toLowerCase().replace(/^https?:\/\//, '');
      if (!domain) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Please provide a valid domain.', color: colors.error })], ephemeral: true });
      }
      const list = store.getConfig(guildId, 'antilink_whitelist') || [];
      if (list.includes(domain)) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: `**${domain}** is already whitelisted.`, color: colors.error })], ephemeral: true });
      }
      list.push(domain);
      store.setConfig(guildId, 'antilink_whitelist', list);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `Whitelisted **${domain}**`, color: colors.success })] });
    }

    if (sub === 'status') {
      const enabled = store.getConfig(guildId, 'antilink');
      const whitelist = store.getConfig(guildId, 'antilink_whitelist') || [];
      const desc = [
        `**Status** ${enabled ? 'Enabled' : 'Disabled'}`,
        `**Whitelist** ${whitelist.length ? whitelist.map((d) => `\`${d}\``).join(', ') : 'None'}`,
      ].join('\n');
      return interaction.reply({ embeds: [response({ client: interaction.client, description: desc, color: colors.primary })] });
    }
  },
};
