const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const { fetchGif } = require('../../utils/gif');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Hug someone')
    .addUserOption((o) => o.setName('user').setDescription('User to hug').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    const target = interaction.options.getUser('user');
    const gif = await fetchGif('hug');

    const embed = response({ client: interaction.client, description: `${interaction.user} hugged ${target} 🤗`, color: colors.primary });
    if (gif) embed.setImage(gif);

    await interaction.editReply({ embeds: [embed] });
  },
};
