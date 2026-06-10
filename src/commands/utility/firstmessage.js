const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('firstmessage')
    .setDescription('Get the first message in this channel'),

  async execute(interaction) {
    await interaction.deferReply();

    const messages = await interaction.channel.messages.fetch({ after: '0', limit: 1 });
    const first = messages.first();

    if (!first) {
      return interaction.editReply({ embeds: [response({ client: interaction.client, description: 'No messages found.', color: colors.muted })] });
    }

    await interaction.editReply({
      embeds: [response({
        client: interaction.client,
        description: `**[First message](${first.url})** by ${first.author}\n<t:${Math.floor(first.createdTimestamp / 1000)}:F>\n\n${first.content?.slice(0, 500) || '*No content*'}`,
        color: colors.primary,
      })],
    });
  },
};
