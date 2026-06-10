const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');
const { createConfigChannel, CHANNEL_DEFAULTS } = require('../../utils/channelCreate');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('counter')
    .setDescription('Set up a counting channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((s) =>
      s.setName('set')
        .setDescription('Set counting channel')
        .addChannelOption((o) => o.setName('channel').setDescription('Channel for counting').setRequired(true).addChannelTypes(ChannelType.GuildText))
    )
    .addSubcommand((s) => s.setName('create').setDescription('Create a #counting channel'))
    .addSubcommand((s) => s.setName('disable').setDescription('Disable counting'))
    .addSubcommand((s) => s.setName('reset').setDescription('Reset the count to 0')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'create') {
      const defaults = CHANNEL_DEFAULTS.counter_channel;
      const ch = await createConfigChannel(interaction.guild, { name: defaults.name, isPrivate: defaults.isPrivate, client: interaction.client });
      if (!ch) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Failed to create channel. Make sure I have the **Manage Channels** permission.', color: colors.error })], ephemeral: true });
      }
      store.setConfig(interaction.guild.id, 'counter_channel', ch.id);
      store.setConfig(interaction.guild.id, 'counter_count', 0);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `Created ${ch} — counting starts at **0**!`, color: colors.success })] });
    }

    if (sub === 'set') {
      const ch = interaction.options.getChannel('channel');
      const existing = store.getConfig(interaction.guild.id, 'counter_channel');
      if (existing === ch.id) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: `Counting channel is already set to ${ch}`, color: colors.warning })], ephemeral: true });
      }
      store.setConfig(interaction.guild.id, 'counter_channel', ch.id);
      store.setConfig(interaction.guild.id, 'counter_count', 0);
      store.setConfig(interaction.guild.id, 'counter_last_user', null);
      const msg = existing ? `Counting channel updated to ${ch} (was <#${existing}>). Count reset to **0**.` : `Counting channel set to ${ch}. Start at **1**!`;
      return interaction.reply({ embeds: [response({ client: interaction.client, description: msg, color: colors.success })] });
    }

    if (sub === 'disable') {
      const existing = store.getConfig(interaction.guild.id, 'counter_channel');
      if (!existing) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Counting is not configured', color: colors.warning })], ephemeral: true });
      }
      store.setConfig(interaction.guild.id, 'counter_channel', null);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Counting disabled.', color: colors.muted })] });
    }

    if (sub === 'reset') {
      store.setConfig(interaction.guild.id, 'counter_count', 0);
      store.setConfig(interaction.guild.id, 'counter_last_user', null);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Count reset to **0**.', color: colors.success })] });
    }
  },
};
