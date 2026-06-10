const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('newusers')
    .setDescription('View recently joined members')
    .addIntegerOption((o) => o.setName('count').setDescription('How many to show (max 25)').setMinValue(1).setMaxValue(25)),

  async execute(interaction) {
    const count = interaction.options.getInteger('count') || 10;
    const members = await interaction.guild.members.fetch({ limit: 1000 });
    const sorted = [...members.values()]
      .filter((m) => m.joinedTimestamp)
      .sort((a, b) => b.joinedTimestamp - a.joinedTimestamp)
      .slice(0, count);

    const desc = sorted.map((m, i) =>
      `\`${i + 1}.\` ${m} — joined <t:${Math.floor(m.joinedTimestamp / 1000)}:R>`
    ).join('\n');

    const embed = base(interaction.client, colors.primary)
      .setAuthor({ name: `New Users — ${interaction.guild.name}` })
      .setDescription(desc);

    await interaction.reply({ embeds: [embed] });
  },
};
