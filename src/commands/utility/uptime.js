const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('View bot uptime'),

  async execute(interaction) {
    const ms = interaction.client.uptime;
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);

    const parts = [];
    if (d) parts.push(`${d}d`);
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    parts.push(`${s}s`);

    await interaction.reply({
      embeds: [response({ client: interaction.client, description: `Uptime: **${parts.join(' ')}**`, color: colors.primary })],
    });
  },
};
