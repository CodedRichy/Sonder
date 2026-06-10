const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');
const { createConfigChannel, CHANNEL_DEFAULTS } = require('../../utils/channelCreate');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Configure welcome messages')
    .addSubcommand((sub) =>
      sub.setName('channel').setDescription('Set the welcome channel')
        .addChannelOption((o) => o.setName('channel').setDescription('Channel for welcome messages').setRequired(true).addChannelTypes(ChannelType.GuildText))
    )
    .addSubcommand((sub) =>
      sub.setName('message').setDescription('Set the welcome message')
        .addStringOption((o) => o.setName('text').setDescription('Message — use {user}, {server}, {membercount}').setRequired(true))
    )
    .addSubcommand((sub) => sub.setName('disable').setDescription('Disable welcome messages'))
    .addSubcommand((sub) => sub.setName('test').setDescription('Preview the welcome message'))
    .addSubcommand((sub) => sub.setName('settings').setDescription('View current welcome settings'))
    .addSubcommand((sub) => sub.setName('create').setDescription('Create a #welcome channel and set it up'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const { guild } = interaction;

    if (sub === 'channel') {
      const channel = interaction.options.getChannel('channel');
      const existing = store.getConfig(guild.id, 'welcome_channel');
      if (existing === channel.id) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: `Welcome channel is already set to ${channel}`, color: colors.warning })], ephemeral: true });
      }
      store.setConfig(guild.id, 'welcome_channel', channel.id);
      const msg = existing ? `Welcome channel updated to ${channel} (was <#${existing}>)` : `Welcome channel set to ${channel}`;
      await interaction.reply({ embeds: [response({ client: interaction.client, description: msg, color: colors.success })] });

    } else if (sub === 'message') {
      const text = interaction.options.getString('text');
      const existingMsg = store.getConfig(guild.id, 'welcome_message');
      if (existingMsg === text) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Welcome message is already set to that', color: colors.warning })], ephemeral: true });
      }
      store.setConfig(guild.id, 'welcome_message', text);
      const desc = existingMsg
        ? `Welcome message updated.\n\n**Preview:**\n${formatMessage(text, interaction.member, guild)}`
        : `Welcome message set.\n\n**Preview:**\n${formatMessage(text, interaction.member, guild)}`;
      await interaction.reply({ embeds: [response({ client: interaction.client, description: desc, color: colors.success })] });

    } else if (sub === 'disable') {
      const existingCh = store.getConfig(guild.id, 'welcome_channel');
      const existingMsg = store.getConfig(guild.id, 'welcome_message');
      if (!existingCh && !existingMsg) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Welcome messages are not configured', color: colors.warning })], ephemeral: true });
      }
      store.setConfig(guild.id, 'welcome_channel', null);
      store.setConfig(guild.id, 'welcome_message', null);
      await interaction.reply({ embeds: [response({ client: interaction.client, description: 'Welcome messages disabled.', color: colors.muted })] });

    } else if (sub === 'create') {
      const defaults = CHANNEL_DEFAULTS.welcome_channel;
      const ch = await createConfigChannel(guild, { ...defaults, client: interaction.client });
      if (!ch) return interaction.reply({ embeds: [response({ client: interaction.client, description: "Couldn't create channel. Make sure I have **Manage Channels** permission.", color: colors.error })], ephemeral: true });
      store.setConfig(guild.id, 'welcome_channel', ch.id);
      store.setConfig(guild.id, 'welcome_message', 'Welcome to {server}, {user}! You\'re member #{membercount} \u{1F389}');
      await interaction.reply({ embeds: [response({ client: interaction.client, description: `Created ${ch} and set as welcome channel with default message.`, color: colors.success })] });

    } else if (sub === 'test') {
      const chId = store.getConfig(guild.id, 'welcome_channel');
      const msg = store.getConfig(guild.id, 'welcome_message');
      if (!chId || !msg) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Welcome not configured. Use `/welcome channel` and `/welcome message` first.', color: colors.error })], ephemeral: true });
      }
      const channel = guild.channels.cache.get(chId);
      if (!channel) return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Welcome channel not found.', color: colors.error })], ephemeral: true });

      const formatted = formatMessage(msg, interaction.member, guild);
      try {
        await channel.send({ embeds: [response({ client: interaction.client, description: formatted, color: colors.primary })] });
      } catch {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: `Failed to send test message to ${channel}. Check my permissions in that channel.`, color: colors.error })], ephemeral: true });
      }
      await interaction.reply({ embeds: [response({ client: interaction.client, description: `Test message sent to ${channel}`, color: colors.success })], ephemeral: true });

    } else {
      const chId = store.getConfig(guild.id, 'welcome_channel');
      const msg = store.getConfig(guild.id, 'welcome_message') || 'Not set';
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
