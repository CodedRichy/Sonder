const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const { fetchGif } = require('../../utils/gif');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bonk')
    .setDescription('Bonk someone')
    .addUserOption((o) => o.setName('user').setDescription('User to bonk').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    const target = interaction.options.getUser('user');
    const gif = await fetchGif('bonk');

    const embed = response({ client: interaction.client, description: `${interaction.user} bonked ${target} 🔨`, color: colors.error });
    if (gif) embed.setImage(gif);

    await interaction.editReply({ embeds: [embed] });
  },
};
