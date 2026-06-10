const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { modAction, response } = require('../../utils/embed');
const modlog = require('../../utils/modlog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user from the server')
    .addStringOption((o) => o.setName('user_id').setDescription('User ID to unban').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason for unban'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const userId = interaction.options.getString('user_id');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      const ban = await interaction.guild.bans.fetch(userId);
      await interaction.guild.members.unban(userId, reason);

      const embed = modAction({
        client: interaction.client,
        action: 'unban',
        color: colors.success,
        target: ban.user,
        moderator: interaction.user,
        reason,
      });

      await interaction.reply({ embeds: [embed] });
      await modlog.send(interaction.guild, { action: 'unban', target: ban.user, moderator: interaction.user, reason });
    } catch {
      await interaction.reply({ embeds: [response({ client: interaction.client, description: 'User not found in ban list.', color: colors.error })], ephemeral: true });
    }
  },
};
