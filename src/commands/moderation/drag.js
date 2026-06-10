const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const modlog = require('../../utils/modlog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('drag')
    .setDescription('Move a user to your voice channel')
    .addUserOption((o) => o.setName('user').setDescription('User to drag').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    if (!target) return interaction.reply({ embeds: [response({ client: interaction.client, description: 'User not found.', color: colors.error })], ephemeral: true });

    const yourChannel = interaction.member.voice.channel;
    if (!yourChannel) return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Join a voice channel first.', color: colors.error })], ephemeral: true });

    if (!target.voice.channel) return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Target is not in a voice channel.', color: colors.error })], ephemeral: true });

    await target.voice.setChannel(yourChannel);
    await interaction.reply({ embeds: [response({ client: interaction.client, description: `Dragged ${target} to ${yourChannel}`, color: colors.success })] });
    await modlog.send(interaction.guild, { action: 'drag', target: target.user, moderator: interaction.user, reason: `Moved to ${yourChannel.name}` });
  },
};
