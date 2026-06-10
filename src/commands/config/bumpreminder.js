const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');
const { createConfigChannel, CHANNEL_DEFAULTS } = require('../../utils/channelCreate');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bumpreminder')
    .setDescription('Configure Disboard bump reminders')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((s) =>
      s.setName('enable')
        .setDescription('Enable bump reminders')
        .addChannelOption((o) => o.setName('channel').setDescription('Channel for reminders').setRequired(true).addChannelTypes(ChannelType.GuildText))
    )
    .addSubcommand((s) => s.setName('create').setDescription('Create a #bump channel for bump reminders'))
    .addSubcommand((s) => s.setName('disable').setDescription('Disable bump reminders')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'create') {
      const ch = await createConfigChannel(interaction.guild, { ...CHANNEL_DEFAULTS.bump_channel, client: interaction.client });
      if (!ch) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Failed to create the bump channel. Check my permissions.', color: colors.error })], ephemeral: true });
      }
      store.setConfig(interaction.guild.id, 'bump_channel', ch.id);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `Created ${ch} and set for bump reminders.`, color: colors.success })] });
    }

    if (sub === 'enable') {
      const ch = interaction.options.getChannel('channel');
      const existing = store.getConfig(interaction.guild.id, 'bump_channel');
      if (existing === ch.id) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: `Bump reminder channel is already set to ${ch}`, color: colors.warning })], ephemeral: true });
      }
      store.setConfig(interaction.guild.id, 'bump_channel', ch.id);
      const msg = existing ? `Bump reminder channel updated to ${ch} (was <#${existing}>)` : `Bump reminders enabled in ${ch}. I'll remind after each Disboard bump.`;
      return interaction.reply({ embeds: [response({ client: interaction.client, description: msg, color: colors.success })] });
    }

    if (sub === 'disable') {
      const existing = store.getConfig(interaction.guild.id, 'bump_channel');
      if (!existing) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Bump reminders are not configured', color: colors.warning })], ephemeral: true });
      }
      store.setConfig(interaction.guild.id, 'bump_channel', null);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Bump reminders disabled.', color: colors.muted })] });
    }
  },
};
