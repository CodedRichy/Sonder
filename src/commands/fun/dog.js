const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base, response } = require('../../utils/embed');
const { rateLimit } = require('../../utils/ratelimit');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dog')
    .setDescription('Random dog picture'),

  async execute(interaction) {
    if (!rateLimit(`dog:${interaction.guild.id}`, 10, 60000)) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Rate limit reached. Try again in a minute.', color: colors.error })], ephemeral: true });
    }

    await interaction.deferReply();

    try {
      const res = await fetch('https://dog.ceo/api/breeds/image/random');
      if (!res.ok) throw new Error();
      const data = await res.json();

      const embed = base(interaction.client, colors.primary)
        .setAuthor({ name: '🐕 Random Dog' })
        .setImage(data.message);

      await interaction.editReply({ embeds: [embed] });
    } catch {
      await interaction.editReply({ embeds: [response({ client: interaction.client, description: 'Failed to fetch dog pic.', color: colors.error })] });
    }
  },
};
