const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const xpStore = require('../../database/xp');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlevel')
    .setDescription('Set a member\'s level')
    .addUserOption((o) => o.setName('user').setDescription('Member').setRequired(true))
    .addIntegerOption((o) => o.setName('level').setDescription('Level to set').setRequired(true).setMinValue(0).setMaxValue(1000))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const level = interaction.options.getInteger('level');

    const stats = xpStore.setLevel(interaction.guild.id, user.id, level);

    await interaction.reply({
      embeds: [response({
        client: interaction.client,
        description: `Set **${user.tag}** to level **${stats.level}**`,
        color: colors.success,
      })],
    });
  },
};
