const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const { fetchGif } = require('../../utils/gif');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slap')
    .setDescription('Slap someone')
    .addUserOption((o) => o.setName('user').setDescription('User to slap').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    const target = interaction.options.getUser('user');
    const gif = await fetchGif('slap');

    const embed = response({ client: interaction.client, description: `${interaction.user} slapped ${target} 👋`, color: colors.error });
    if (gif) embed.setImage(gif);

    await interaction.editReply({ embeds: [embed] });
  },
};
