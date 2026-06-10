const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base, response } = require('../../utils/embed');
const xpStore = require('../../database/xp');

const MEDALS = ['🥇', '🥈', '🥉'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('xpleaderboard')
    .setDescription('View the top members by XP'),

  async execute(interaction) {
    const { guild } = interaction;
    const top = xpStore.getLeaderboard(guild.id, 10);

    if (top.length === 0) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'No XP data yet. Start chatting to earn XP.', color: colors.muted })] });
    }

    const lines = top.map((entry, i) => {
      const medal = MEDALS[i] || `\`${i + 1}.\``;
      return `${medal} <@${entry.userId}> — Level **${entry.level}** · \`${entry.totalXp.toLocaleString()} XP\``;
    });

    const embed = base(interaction.client, colors.primary)
      .setAuthor({ name: `${guild.name} — XP Leaderboard`, iconURL: guild.iconURL() })
      .setDescription(lines.join('\n'));

    await interaction.reply({ embeds: [embed] });
  },
};
