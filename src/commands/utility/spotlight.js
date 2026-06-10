const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base, response } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spotlight')
    .setDescription('See the most popular messages recently')
    .addStringOption((o) =>
      o.setName('timeframe').setDescription('How far back')
        .addChoices(
          { name: 'Today', value: '24' },
          { name: 'This week', value: '168' },
        )
    )
    .addChannelOption((o) => o.setName('channel').setDescription('Specific channel').addChannelTypes(ChannelType.GuildText)),

  async execute(interaction) {
    const hours = parseInt(interaction.options.getString('timeframe') || '24');
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    if (!channel.permissionsFor(interaction.member).has('ViewChannel')) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'You don\'t have access to that channel', color: colors.error })], ephemeral: true });
    }

    const cutoff = Date.now() - hours * 3600000;

    await interaction.deferReply();

    try {
      const candidates = [];
      let lastId;
      let done = false;

      while (!done && candidates.length < 1000) {
        const batch = await channel.messages.fetch({ limit: 100, ...(lastId && { before: lastId }) });
        if (!batch.size) break;

        for (const msg of batch.values()) {
          if (msg.createdTimestamp < cutoff) { done = true; break; }
          if (msg.author.bot) continue;

          const reactions = msg.reactions.cache.reduce((sum, r) => sum + r.count, 0);
          if (reactions > 0) {
            candidates.push({
              content: msg.content?.slice(0, 150) || '*media/embed*',
              author: msg.author,
              url: msg.url,
              reactions,
              emojis: msg.reactions.cache.map((r) => `${r.emoji} ${r.count}`).join(' '),
            });
          }
        }
        lastId = batch.last().id;
      }

      if (!candidates.length) {
        return interaction.editReply({ embeds: [response({ client: interaction.client, description: 'No reacted messages found in that timeframe.', color: colors.muted })] });
      }

      const top = candidates.sort((a, b) => b.reactions - a.reactions).slice(0, 5);
      const label = hours <= 24 ? 'Today' : 'This Week';

      const desc = top.map((m, i) => {
        const medal = ['🥇', '🥈', '🥉', '4.', '5.'][i];
        return `${medal} **${m.author.tag}** — ${m.reactions} reactions\n> ${m.content}\n${m.emojis} [jump](${m.url})`;
      }).join('\n\n');

      const embed = base(interaction.client, colors.primary)
        .setAuthor({ name: `Spotlight — ${label}` })
        .setDescription(desc);

      await interaction.editReply({ embeds: [embed] });
    } catch {
      await interaction.editReply({ embeds: [response({ client: interaction.client, description: 'Failed to fetch messages.', color: colors.error })] });
    }
  },
};
