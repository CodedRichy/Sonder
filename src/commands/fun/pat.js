const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const { fetchGif } = require('../../utils/gif');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pat')
    .setDescription('Pat someone')
    .addUserOption((o) => o.setName('user').setDescription('User to pat').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    const target = interaction.options.getUser('user');
    const gif = await fetchGif('pat');

    const embed = response({ client: interaction.client, description: `${interaction.user} patted ${target}`, color: colors.primary });
    if (gif) embed.setImage(gif);

    await interaction.editReply({ embeds: [embed] });
  },
};
