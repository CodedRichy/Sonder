const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');
const { createConfigChannel, CHANNEL_DEFAULTS } = require('../../utils/channelCreate');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('confession')
    .setDescription('Configure confession system')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((s) =>
      s.setName('channel')
        .setDescription('Set confession channel')
        .addChannelOption((o) => o.setName('channel').setDescription('Channel for confessions').setRequired(true).addChannelTypes(ChannelType.GuildText))
    )
    .addSubcommand((s) => s.setName('create').setDescription('Create a #confessions channel'))
    .addSubcommand((s) => s.setName('disable').setDescription('Disable confessions')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'create') {
      const defaults = CHANNEL_DEFAULTS.confession_channel;
      const ch = await createConfigChannel(interaction.guild, { name: defaults.name, isPrivate: defaults.isPrivate, client: interaction.client });
      if (!ch) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Failed to create channel. Make sure I have the **Manage Channels** permission.', color: colors.error })], ephemeral: true });
      }
      store.setConfig(interaction.guild.id, 'confession_channel', ch.id);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `Created ${ch} and set as confessions channel.`, color: colors.success })] });
    }

    if (sub === 'channel') {
      const ch = interaction.options.getChannel('channel');
      const existing = store.getConfig(interaction.guild.id, 'confession_channel');
      if (existing === ch.id) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: `Confession channel is already set to ${ch}`, color: colors.warning })], ephemeral: true });
      }
      store.setConfig(interaction.guild.id, 'confession_channel', ch.id);
      const msg = existing ? `Confession channel updated to ${ch} (was <#${existing}>)` : `Confessions will be sent to ${ch}`;
      return interaction.reply({ embeds: [response({ client: interaction.client, description: msg, color: colors.success })] });
    }

    if (sub === 'disable') {
      const existing = store.getConfig(interaction.guild.id, 'confession_channel');
      if (!existing) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Confession channel is not configured', color: colors.warning })], ephemeral: true });
      }
      store.setConfig(interaction.guild.id, 'confession_channel', null);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Confessions disabled.', color: colors.muted })] });
    }
  },
};
