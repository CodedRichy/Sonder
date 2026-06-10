const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base, response } = require('../../utils/embed');
const store = require('../../database/store');

const MEDALS = ['🥇', '🥈', '🥉'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the richest members in the server'),

  async execute(interaction) {
    const { guild } = interaction;
    const top = store.getLeaderboard(guild.id, 10);

    if (top.length === 0) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'No economy data yet. Use `/daily` to get started.', color: colors.muted })] });
    }

    const lines = top.map((entry, i) => {
      const medal = MEDALS[i] || `\`${i + 1}.\``;
      return `${medal} <@${entry.userId}> — **⌬ ${entry.total.toLocaleString()}**`;
    });

    const embed = base(interaction.client, colors.primary)
      .setAuthor({ name: `${guild.name} — Leaderboard`, iconURL: guild.iconURL() })
      .setDescription(lines.join('\n'));

    await interaction.reply({ embeds: [embed] });
  },
};
