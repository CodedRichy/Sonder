const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');
const { createConfigChannel, CHANNEL_DEFAULTS } = require('../../utils/channelCreate');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('goodbye')
    .setDescription('Configure goodbye messages')
    .addSubcommand((sub) =>
      sub.setName('channel').setDescription('Set the goodbye channel')
        .addChannelOption((o) => o.setName('channel').setDescription('Channel for goodbye messages').setRequired(true).addChannelTypes(ChannelType.GuildText))
    )
    .addSubcommand((sub) =>
      sub.setName('message').setDescription('Set the goodbye message')
        .addStringOption((o) => o.setName('text').setDescription('Message — use {user}, {server}, {membercount}').setRequired(true))
    )
    .addSubcommand((sub) => sub.setName('disable').setDescription('Disable goodbye messages'))
    .addSubcommand((sub) => sub.setName('settings').setDescription('View current goodbye settings'))
    .addSubcommand((sub) => sub.setName('create').setDescription('Create a #goodbye channel and set it up'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const { guild } = interaction;

    if (sub === 'channel') {
      const channel = interaction.options.getChannel('channel');
      const existing = store.getConfig(guild.id, 'goodbye_channel');
      if (existing === channel.id) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: `Goodbye channel is already set to ${channel}`, color: colors.warning })], ephemeral: true });
      }
      store.setConfig(guild.id, 'goodbye_channel', channel.id);
      const msg = existing ? `Goodbye channel updated to ${channel} (was <#${existing}>)` : `Goodbye channel set to ${channel}`;
      await interaction.reply({ embeds: [response({ client: interaction.client, description: msg, color: colors.success })] });

    } else if (sub === 'message') {
      const text = interaction.options.getString('text');
      const existingMsg = store.getConfig(guild.id, 'goodbye_message');
      if (existingMsg === text) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Goodbye message is already set to that', color: colors.warning })], ephemeral: true });
      }
      store.setConfig(guild.id, 'goodbye_message', text);
      const desc = existingMsg
        ? `Goodbye message updated.\n\n**Preview:**\n${formatMessage(text, interaction.member, guild)}`
        : `Goodbye message set.\n\n**Preview:**\n${formatMessage(text, interaction.member, guild)}`;
      await interaction.reply({ embeds: [response({ client: interaction.client, description: desc, color: colors.success })] });

    } else if (sub === 'create') {
      const defaults = CHANNEL_DEFAULTS.goodbye_channel;
      const ch = await createConfigChannel(guild, { ...defaults, client: interaction.client });
      if (!ch) return interaction.reply({ embeds: [response({ client: interaction.client, description: "Couldn't create channel. Make sure I have **Manage Channels** permission.", color: colors.error })], ephemeral: true });
      store.setConfig(guild.id, 'goodbye_channel', ch.id);
      store.setConfig(guild.id, 'goodbye_message', '{user} left **{server}**. We\'ll miss you.');
      await interaction.reply({ embeds: [response({ client: interaction.client, description: `Created ${ch} and set as goodbye channel with default message.`, color: colors.success })] });

    } else if (sub === 'disable') {
      const existingCh = store.getConfig(guild.id, 'goodbye_channel');
      const existingMsg = store.getConfig(guild.id, 'goodbye_message');
      if (!existingCh && !existingMsg) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Goodbye messages are not configured', color: colors.warning })], ephemeral: true });
      }
      store.setConfig(guild.id, 'goodbye_channel', null);
      store.setConfig(guild.id, 'goodbye_message', null);
      await interaction.reply({ embeds: [response({ client: interaction.client, description: 'Goodbye messages disabled.', color: colors.muted })] });

    } else {
      const chId = store.getConfig(guild.id, 'goodbye_channel');
      const msg = store.getConfig(guild.id, 'goodbye_message') || 'Not set';
      await interaction.reply({
        embeds: [response({
          client: interaction.client,
          description: `**Channel** ${chId ? `<#${chId}>` : 'Not set'}\n**Message** ${msg}`,
          color: colors.info,
        })],
      });
    }
  },
};

function formatMessage(text, member, guild) {
  return text
    .replace(/{user}/gi, member.toString())
    .replace(/{user\.tag}/gi, member.user?.tag || member.tag || 'Unknown')
    .replace(/{server}/gi, guild.name)
    .replace(/{membercount}/gi, guild.memberCount.toString());
}
