const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency'),

  async execute(interaction) {
    const sent = await interaction.reply({ content: '...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const ws = interaction.client.ws.ping;

    const embed = base(interaction.client, colors.primary)
      .setDescription(
        `**Latency** ${latency}ms\n**WebSocket** ${ws}ms`
      );

    await interaction.editReply({ content: null, embeds: [embed] });
  },
};
