const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base, response } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channelstats')
    .setDescription('View analytics for a channel')
    .addChannelOption((o) => o.setName('channel').setDescription('Channel to analyze').addChannelTypes(ChannelType.GuildText)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    await interaction.deferReply();

    try {
      const messages = [];
      let lastId;

      for (let i = 0; i < 10; i++) {
        const batch = await channel.messages.fetch({ limit: 100, ...(lastId && { before: lastId }) });
        if (!batch.size) break;
        for (const msg of batch.values()) {
          if (!msg.author.bot) messages.push(msg);
        }
        lastId = batch.last().id;
      }

      if (messages.length < 10) {
        return interaction.editReply({ embeds: [response({ client: interaction.client, description: 'Not enough messages to analyze.', color: colors.muted })] });
      }

      const uniqueAuthors = new Set(messages.map((m) => m.author.id));
      const totalReactions = messages.reduce((sum, m) => sum + m.reactions.cache.reduce((s, r) => s + r.count, 0), 0);
      const repliedMsgs = messages.filter((m) => m.reference).length;
      const withAttachments = messages.filter((m) => m.attachments.size > 0).length;
      const avgLength = Math.round(messages.reduce((sum, m) => sum + (m.content?.length || 0), 0) / messages.length);

      const oldest = messages[messages.length - 1].createdTimestamp;
      const newest = messages[0].createdTimestamp;
      const spanHours = Math.max(1, (newest - oldest) / 3600000);
      const msgsPerHour = (messages.length / spanHours).toFixed(1);

      const topAuthors = new Map();
      for (const msg of messages) {
        topAuthors.set(msg.author.id, (topAuthors.get(msg.author.id) || 0) + 1);
      }
      const top3 = [...topAuthors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

      const desc = [
        `**Messages Analyzed** ${messages.length}`,
        `**Unique Participants** ${uniqueAuthors.size}`,
        `**Messages/Hour** ${msgsPerHour}`,
        `**Reply Rate** ${((repliedMsgs / messages.length) * 100).toFixed(0)}%`,
        `**Avg Message Length** ${avgLength} chars`,
        `**Reactions** ${totalReactions} total`,
        `**Attachments** ${withAttachments} messages`,
        '',
        '**Top Contributors**',
        ...top3.map(([id, count], i) => `${['🥇', '🥈', '🥉'][i]} <@${id}> — ${count} msgs`),
      ].join('\n');

      const embed = base(interaction.client, colors.primary)
        .setAuthor({ name: `Channel Stats — #${channel.name}` })
        .setDescription(desc);

      await interaction.editReply({ embeds: [embed] });
    } catch {
      await interaction.editReply({ embeds: [response({ client: interaction.client, description: 'Failed to analyze channel.', color: colors.error })] });
    }
  },
};
