const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bots')
    .setDescription('List all bots in this server'),

  async execute(interaction) {
    const bots = interaction.guild.members.cache
      .filter((m) => m.user.bot)
      .sort((a, b) => a.user.username.localeCompare(b.user.username));

    const desc = bots.map((m) => {
      const status = m.presence?.status || 'offline';
      const dot = status === 'online' ? '🟢' : status === 'idle' ? '🟡' : status === 'dnd' ? '🔴' : '⚫';
      return `${dot} ${m}`;
    }).join('\n');

    const embed = base(interaction.client, colors.primary)
      .setAuthor({ name: `Bots — ${bots.size}` })
      .setDescription(desc || 'No bots found.');

    await interaction.reply({ embeds: [embed] });
  },
};
