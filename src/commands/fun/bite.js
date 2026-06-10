const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const { fetchGif } = require('../../utils/gif');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bite')
    .setDescription('Bite someone')
    .addUserOption((o) => o.setName('user').setDescription('User to bite').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    const target = interaction.options.getUser('user');
    const gif = await fetchGif('bite');

    const embed = response({ client: interaction.client, description: `${interaction.user} bit ${target} 😈`, color: colors.warning });
    if (gif) embed.setImage(gif);

    await interaction.editReply({ embeds: [embed] });
  },
};
