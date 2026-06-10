const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { modAction, dmNotice, response } = require('../../utils/embed');
const modlog = require('../../utils/modlog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption((o) => o.setName('user').setDescription('Member to kick').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason for kick'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!member) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Member not found in server.', color: colors.error })], ephemeral: true });
    }

    if (member.id === interaction.user.id) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: "You can't kick yourself.", color: colors.error })], ephemeral: true });
    }

    if (!member.kickable) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: "I can't kick this member — they have a higher or equal role.", color: colors.error })], ephemeral: true });
    }

    if (member.roles.highest.position >= interaction.member.roles.highest.position) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: "You can't kick someone with a higher or equal role.", color: colors.error })], ephemeral: true });
    }

    await member.user.send({ embeds: [dmNotice({ guild: interaction.guild, action: 'kicked', reason, color: colors.warning })] }).catch(() => {});

    await member.kick(reason);

    const embed = modAction({
      client: interaction.client,
      action: 'kick',
      color: colors.warning,
      target: member.user,
      moderator: interaction.user,
      reason,
    });

    await interaction.reply({ embeds: [embed] });
    await modlog.send(interaction.guild, { action: 'kick', target: member.user, moderator: interaction.user, reason });
  },
};
