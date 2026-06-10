const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Add or remove a role from a member')
    .addUserOption((o) => o.setName('user').setDescription('Member').setRequired(true))
    .addRoleOption((o) => o.setName('role').setDescription('Role to toggle').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const role = interaction.options.getRole('role');

    if (!member) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'User not found.', color: colors.error })], ephemeral: true });
    }

    if (role.position > interaction.member.roles.highest.position) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'That role is above your highest role.', color: colors.error })], ephemeral: true });
    }

    if (member.roles.cache.has(role.id)) {
      await member.roles.remove(role, `Removed by ${interaction.user.tag}`);
      await interaction.reply({ embeds: [response({ client: interaction.client, description: `Removed **${role.name}** from ${member}`, color: colors.muted })] });
    } else {
      await member.roles.add(role, `Added by ${interaction.user.tag}`);
      await interaction.reply({ embeds: [response({ client: interaction.client, description: `Added **${role.name}** to ${member}`, color: colors.success })] });
    }
  },
};
