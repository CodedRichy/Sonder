const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');

function uwuify(text) {
  return text
    .replace(/[rl]/g, 'w')
    .replace(/[RL]/g, 'W')
    .replace(/n([aeiou])/g, 'ny$1')
    .replace(/N([aeiou])/g, 'Ny$1')
    .replace(/N([AEIOU])/g, 'NY$1')
    .replace(/ove/g, 'uv')
    .replace(/\!+/g, '! >w< ')
    .replace(/\?+/g, '? owo ')
    .replace(/\.+/g, '. uwu ');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uwuify')
    .setDescription('UwUify your text')
    .addStringOption((o) => o.setName('text').setDescription('Text to uwuify').setRequired(true)),

  async execute(interaction) {
    const text = interaction.options.getString('text');
    const result = uwuify(text);

    await interaction.reply({
      embeds: [response({ client: interaction.client, description: result, color: colors.primary })],
    });
  },
};
