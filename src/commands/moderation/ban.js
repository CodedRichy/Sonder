const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { modAction, dmNotice, response } = require('../../utils/embed');
const modlog = require('../../utils/modlog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .addUserOption((o) => o.setName('user').setDescription('Member to ban').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason for ban'))
    .addIntegerOption((o) =>
      o.setName('delete_messages').setDescription('Days of messages to delete (0-7)').setMinValue(0).setMaxValue(7)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const days = interaction.options.getInteger('delete_messages') || 0;
    const member = interaction.guild.members.cache.get(user.id);

    if (user.id === interaction.user.id) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: "You can't ban yourself.", color: colors.error })], ephemeral: true });
    }

    if (member) {
      if (!member.bannable) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: "I can't ban this member — they have a higher or equal role.", color: colors.error })], ephemeral: true });
      }
      if (member.roles.highest.position >= interaction.member.roles.highest.position) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: "You can't ban someone with a higher or equal role.", color: colors.error })], ephemeral: true });
      }
    }

    await user.send({ embeds: [dmNotice({ guild: interaction.guild, action: 'banned', reason, color: colors.error })] }).catch(() => {});

    await interaction.guild.members.ban(user, { reason, deleteMessageSeconds: days * 86400 });

    const embed = modAction({
      client: interaction.client,
      action: 'ban',
      color: colors.error,
      target: user,
      moderator: interaction.user,
      reason,
    });

    await interaction.reply({ embeds: [embed] });
    await modlog.send(interaction.guild, { action: 'ban', target: user, moderator: interaction.user, reason });
  },
};
