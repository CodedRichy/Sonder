const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roleinfo')
    .setDescription('View information about a role')
    .addRoleOption((o) => o.setName('role').setDescription('Role to inspect').setRequired(true)),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const members = role.members.size;

    const embed = base(interaction.client, role.color || colors.primary)
      .setAuthor({ name: role.name })
      .addFields(
        { name: 'ID', value: role.id, inline: true },
        { name: 'Color', value: role.hexColor, inline: true },
        { name: 'Members', value: `${members}`, inline: true },
        { name: 'Position', value: `${role.position}`, inline: true },
        { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
        { name: 'Hoisted', value: role.hoist ? 'Yes' : 'No', inline: true },
        { name: 'Created', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:R>`, inline: true },
      );

    await interaction.reply({ embeds: [embed] });
  },
};
