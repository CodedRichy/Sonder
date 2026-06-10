const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const vm = require('../../database/voicemaster');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('voicemaster')
    .setDescription('Configure VoiceMaster join-to-create system')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((s) =>
      s.setName('setup')
        .setDescription('Set up VoiceMaster with a join-to-create channel')
        .addChannelOption((o) =>
          o.setName('category').setDescription('Category for created channels').addChannelTypes(ChannelType.GuildCategory)
        )
    )
    .addSubcommand((s) => s.setName('disable').setDescription('Disable VoiceMaster'))
    .addSubcommand((s) => s.setName('status').setDescription('View VoiceMaster configuration')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const { guild } = interaction;

    if (sub === 'setup') {
      const existingJoinId = vm.getJoinChannelId(guild.id);
      if (existingJoinId) {
        return interaction.reply({
          embeds: [response({ client: interaction.client, description: 'VoiceMaster is already set up. Disable it first to reconfigure.', color: colors.warning })],
          ephemeral: true,
        });
      }

      const category = interaction.options.getChannel('category');

      try {
        const joinChannel = await guild.channels.create({
          name: '➕ Create Channel',
          type: ChannelType.GuildVoice,
          parent: category || null,
        });

        vm.setConfig(guild.id, joinChannel.id, category?.id || null);

        await interaction.reply({
          embeds: [response({
            client: interaction.client,
            description: `VoiceMaster enabled. Join ${joinChannel} to create a channel.`,
            color: colors.success,
          })],
        });
      } catch {
        await interaction.reply({
          embeds: [response({ client: interaction.client, description: 'Failed to create join channel. Check my permissions.', color: colors.error })],
          ephemeral: true,
        });
      }
    }

    if (sub === 'disable') {
      const joinId = vm.getJoinChannelId(guild.id);
      if (!joinId) {
        return interaction.reply({
          embeds: [response({ client: interaction.client, description: 'VoiceMaster is not enabled.', color: colors.error })],
          ephemeral: true,
        });
      }

      const joinChannel = guild.channels.cache.get(joinId);
      if (joinChannel) await joinChannel.delete().catch(() => {});
      vm.clearConfig(guild.id);

      await interaction.reply({
        embeds: [response({ client: interaction.client, description: 'VoiceMaster disabled.', color: colors.muted })],
      });
    }

    if (sub === 'status') {
      const joinId = vm.getJoinChannelId(guild.id);
      if (!joinId) {
        return interaction.reply({
          embeds: [response({ client: interaction.client, description: 'VoiceMaster is **not configured**.', color: colors.muted })],
          ephemeral: true,
        });
      }

      const catId = vm.getCategoryId(guild.id);
      const joinChannel = guild.channels.cache.get(joinId);
      const desc = [
        `**Status** Enabled`,
        `**Join Channel** ${joinChannel || 'Deleted'}`,
        catId ? `**Category** ${guild.channels.cache.get(catId) || catId}` : '**Category** None',
      ].join('\n');

      await interaction.reply({
        embeds: [response({ client: interaction.client, description: desc, color: colors.success })],
      });
    }
  },
};
