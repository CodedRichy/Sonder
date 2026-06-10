const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { modAction, dmNotice, response } = require('../../utils/embed');
const modlog = require('../../utils/modlog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('softban')
    .setDescription('Ban and immediately unban — deletes their messages')
    .addUserOption((o) => o.setName('user').setDescription('Member to softban').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason for softban'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(user.id);

    if (user.id === interaction.user.id) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: "You can't softban yourself.", color: colors.error })], ephemeral: true });
    }

    if (member) {
      if (!member.bannable) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: "I can't softban this member.", color: colors.error })], ephemeral: true });
      }
      if (member.roles.highest.position >= interaction.member.roles.highest.position) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: "You can't softban someone with a higher or equal role.", color: colors.error })], ephemeral: true });
      }
    }

    await user.send({ embeds: [dmNotice({ guild: interaction.guild, action: 'softbanned', reason, color: colors.error })] }).catch(() => {});

    await interaction.guild.members.ban(user, { reason, deleteMessageSeconds: 604800 });
    await interaction.guild.members.unban(user, 'Softban — auto unban');

    const embed = modAction({
      client: interaction.client,
      action: 'softban',
      color: colors.error,
      target: user,
      moderator: interaction.user,
      reason,
      extra: 'Messages deleted — user can rejoin',
    });

    await interaction.reply({ embeds: [embed] });
    await modlog.send(interaction.guild, { action: 'softban', target: user, moderator: interaction.user, reason });
  },
};
