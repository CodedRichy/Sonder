const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { colors } = require('../../utils/constants');
const { base, response } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('View the current queue')
    .addIntegerOption((o) => o.setName('page').setDescription('Page number').setMinValue(1)),

  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue || !queue.currentTrack) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Queue is empty.', color: colors.muted })], ephemeral: true });
    }

    const tracks = queue.tracks.toArray();
    const page = (interaction.options.getInteger('page') || 1) - 1;
    const pageSize = 10;
    const pages = Math.ceil(tracks.length / pageSize) || 1;
    const start = page * pageSize;

    const current = queue.currentTrack;
    let desc = `**Now Playing**\n[${current.title}](${current.url}) — ${current.duration}\n\n`;

    if (tracks.length) {
      const slice = tracks.slice(start, start + pageSize);
      desc += '**Up Next**\n';
      desc += slice.map((t, i) => `\`${start + i + 1}.\` [${t.title}](${t.url}) — ${t.duration}`).join('\n');
    } else {
      desc += '*No more tracks in queue*';
    }

    const embed = base(interaction.client, colors.primary)
      .setAuthor({ name: `Queue — ${interaction.guild.name}` })
      .setDescription(desc)
      .setFooter({ text: `Page ${page + 1}/${pages} · ${tracks.length} tracks` });

    await interaction.reply({ embeds: [embed] });
  },
};
