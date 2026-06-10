const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base, response } = require('../../utils/embed');
const { rateLimit } = require('../../utils/ratelimit');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Random cat picture'),

  async execute(interaction) {
    if (!rateLimit(`cat:${interaction.guild.id}`, 10, 60000)) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Rate limit reached. Try again in a minute.', color: colors.error })], ephemeral: true });
    }

    await interaction.deferReply();

    try {
      const res = await fetch('https://api.thecatapi.com/v1/images/search');
      if (!res.ok) throw new Error();
      const [data] = await res.json();

      const embed = base(interaction.client, colors.primary)
        .setAuthor({ name: '🐱 Random Cat' })
        .setImage(data.url);

      await interaction.editReply({ embeds: [embed] });
    } catch {
      await interaction.editReply({ embeds: [response({ client: interaction.client, description: 'Failed to fetch cat pic.', color: colors.error })] });
    }
  },
};
