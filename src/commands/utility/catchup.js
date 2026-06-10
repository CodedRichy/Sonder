const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base, response } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('catchup')
    .setDescription('See what you missed in a channel')
    .addChannelOption((o) => o.setName('channel').setDescription('Channel to catch up on').addChannelTypes(ChannelType.GuildText))
    .addStringOption((o) =>
      o.setName('timeframe').setDescription('How far back to look')
        .addChoices(
          { name: '1 hour', value: '1' },
          { name: '3 hours', value: '3' },
          { name: '6 hours', value: '6' },
          { name: '12 hours', value: '12' },
          { name: '24 hours', value: '24' },
        )
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    if (!channel.permissionsFor(interaction.member).has('ViewChannel')) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'You don\'t have access to that channel', color: colors.error })], ephemeral: true });
    }

    const hours = parseInt(interaction.options.getString('timeframe') || '6');
    const cutoff = Date.now() - hours * 3600000;

    await interaction.deferReply({ ephemeral: true });

    try {
      const messages = [];
      let lastId;
      let done = false;

      while (!done && messages.length < 500) {
        const batch = await channel.messages.fetch({ limit: 100, ...(lastId && { before: lastId }) });
        if (!batch.size) break;

        for (const msg of batch.values()) {
          if (msg.createdTimestamp < cutoff) { done = true; break; }
          if (!msg.author.bot) messages.push(msg);
        }
        lastId = batch.last().id;
      }

      if (!messages.length) {
        return interaction.editReply({ embeds: [response({ client: interaction.client, description: `No messages in ${channel} in the last ${hours}h.`, color: colors.muted })] });
      }

      const authors = new Map();
      const links = [];
      let topMsg = null;
      let topReactions = 0;

      for (const msg of messages) {
        authors.set(msg.author.id, (authors.get(msg.author.id) || 0) + 1);

        const urlMatch = msg.content.match(/https?:\/\/[^\s]+/);
        if (urlMatch && links.length < 3) links.push({ url: urlMatch[0], author: msg.author.tag });

        const reactionCount = msg.reactions.cache.reduce((sum, r) => sum + r.count, 0);
        if (reactionCount > topReactions) {
          topReactions = reactionCount;
          topMsg = msg;
        }
      }

      const sortedAuthors = [...authors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
      const totalAuthors = authors.size;

      const sections = [];
      sections.push(`**${messages.length}** messages from **${totalAuthors}** people in the last **${hours}h**`);

      sections.push('\n**Most Active**\n' + sortedAuthors.map(([id, count]) => `<@${id}> — ${count} msgs`).join('\n'));

      if (topMsg && topReactions > 0) {
        const preview = topMsg.content?.slice(0, 100) || '*attachment/embed*';
        sections.push(`\n**Top Message** (${topReactions} reactions)\n> ${preview}\n— ${topMsg.author.tag} [→](${topMsg.url})`);
      }

      if (links.length) {
        sections.push('\n**Links Shared**\n' + links.map((l) => `[link](${l.url}) — ${l.author}`).join('\n'));
      }

      const embed = base(interaction.client, colors.primary)
        .setAuthor({ name: `Catchup — #${channel.name}` })
        .setDescription(sections.join('\n'));

      await interaction.editReply({ embeds: [embed] });
    } catch {
      await interaction.editReply({ embeds: [response({ client: interaction.client, description: 'Failed to fetch messages.', color: colors.error })] });
    }
  },
};
