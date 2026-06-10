const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('selfpurge')
    .setDescription('Delete your own recent messages')
    .addIntegerOption((o) => o.setName('count').setDescription('Number of messages to delete').setRequired(true).setMinValue(1).setMaxValue(100)),

  async execute(interaction) {
    const count = interaction.options.getInteger('count');
    await interaction.deferReply({ ephemeral: true });

    const messages = await interaction.channel.messages.fetch({ limit: 100 });
    const own = messages.filter((m) => m.author.id === interaction.user.id).first(count);

    await Promise.all(own.map((msg) => msg.delete().catch(() => {})));
    const deleted = own.length;

    await interaction.editReply({ embeds: [response({ client: interaction.client, description: `Deleted **${deleted}** of your messages.`, color: colors.success })] });
  },
};
