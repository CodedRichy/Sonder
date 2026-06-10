const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('View server member count'),

  async execute(interaction) {
    const { guild } = interaction;
    const humans = guild.members.cache.filter((m) => !m.user.bot).size;
    const bots = guild.members.cache.filter((m) => m.user.bot).size;

    await interaction.reply({
      embeds: [response({
        client: interaction.client,
        description: `**${guild.memberCount}** members\n${humans} humans · ${bots} bots`,
        color: colors.primary,
      })],
    });
  },
};
