const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base, response } = require('../../utils/embed');

const EMOJI_REGEX = /<(a?):(\w+):(\d+)>/;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emoji')
    .setDescription('Manage server emojis — list, stats, steal, enlarge')
    .addSubcommand((sub) =>
      sub.setName('list').setDescription('List all custom emojis in this server')
    )
    .addSubcommand((sub) =>
      sub.setName('stats').setDescription('View emoji usage and capacity')
        .addStringOption((o) =>
          o.setName('sort').setDescription('Sort order')
            .addChoices(
              { name: 'Most used', value: 'most' },
              { name: 'Least used (cleanup candidates)', value: 'least' },
            )
        )
    )
    .addSubcommand((sub) =>
      sub.setName('enlarge').setDescription('Enlarge an emoji')
        .addStringOption((o) => o.setName('emoji').setDescription('The emoji to enlarge').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('steal').setDescription('Steal an emoji and add it to this server')
        .addStringOption((o) => o.setName('emoji').setDescription('The emoji to steal').setRequired(true))
        .addStringOption((o) => o.setName('name').setDescription('Custom name for the emoji'))
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'list') {
      const emojis = interaction.guild.emojis.cache;
      if (!emojis.size) {
        return interaction.reply({ embeds: [base(interaction.client, colors.muted).setDescription('No custom emojis.')] });
      }

      const animated = emojis.filter((e) => e.animated);
      const statics = emojis.filter((e) => !e.animated);

      let desc = '';
      if (statics.size) desc += `**Static** (${statics.size})\n${statics.map((e) => e.toString()).join(' ')}\n\n`;
      if (animated.size) desc += `**Animated** (${animated.size})\n${animated.map((e) => e.toString()).join(' ')}`;

      if (desc.length > 4000) desc = desc.slice(0, 4000) + '...';

      const embed = base(interaction.client, colors.primary)
        .setAuthor({ name: `Emojis — ${emojis.size}` })
        .setDescription(desc);

      await interaction.reply({ embeds: [embed] });
    }

    else if (sub === 'stats') {
      await interaction.deferReply();

      const emojis = interaction.guild.emojis.cache;
      if (!emojis.size) {
        return interaction.editReply({ embeds: [response({ client: interaction.client, description: 'No custom emojis in this server.', color: colors.muted })] });
      }

      // Scan recent messages for emoji usage
      const usageCounts = new Map();
      emojis.forEach((e) => usageCounts.set(e.id, { emoji: e, count: 0 }));

      const channels = interaction.guild.channels.cache.filter((c) => c.isTextBased() && !c.isThread());
      const sampleChannels = [...channels.values()].slice(0, 10);

      for (const ch of sampleChannels) {
        try {
          const msgs = await ch.messages.fetch({ limit: 100 });
          for (const msg of msgs.values()) {
            const matches = msg.content.matchAll(/<a?:\w+:(\d+)>/g);
            for (const match of matches) {
              const entry = usageCounts.get(match[1]);
              if (entry) entry.count++;
            }
            for (const [, reaction] of msg.reactions.cache) {
              if (reaction.emoji.id) {
                const entry = usageCounts.get(reaction.emoji.id);
                if (entry) entry.count++;
              }
            }
          }
        } catch {
          // Can't access channel
        }
      }

      const sorted = [...usageCounts.values()];
      const sortMode = interaction.options.getString('sort') || 'most';

      if (sortMode === 'most') {
        sorted.sort((a, b) => b.count - a.count);
      } else {
        sorted.sort((a, b) => a.count - b.count);
      }

      const top = sorted.slice(0, 15);
      const label = sortMode === 'most' ? 'Most Used' : 'Least Used (cleanup candidates)';

      const desc = top.map((e, i) =>
        `\`${String(i + 1).padStart(2)}.\` ${e.emoji} \`:${e.emoji.name}:\` — ${e.count} uses`
      ).join('\n');

      const animatedCount = emojis.filter((e) => e.animated).size;
      const staticsCount = emojis.size - animatedCount;
      const maxEmojis = [50, 100, 150, 250][interaction.guild.premiumTier] || 50;

      const embed = base(interaction.client, colors.primary)
        .setAuthor({ name: `Emoji Stats — ${label}` })
        .setDescription(
          `**Capacity** ${staticsCount}/${maxEmojis} static · ${animatedCount}/${maxEmojis} animated\n` +
          `*Based on ~${sampleChannels.length * 100} recent messages*\n\n${desc}`
        );

      await interaction.editReply({ embeds: [embed] });
    }

    else if (sub === 'enlarge') {
      const input = interaction.options.getString('emoji');
      const match = input.match(EMOJI_REGEX);

      if (!match) {
        const codePoint = [...input].map((c) => c.codePointAt(0).toString(16)).join('-');
        const url = `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/${codePoint}.png`;
        const embed = base(interaction.client, colors.primary).setImage(url);
        return interaction.reply({ embeds: [embed] });
      }

      const [, animated, , id] = match;
      const ext = animated ? 'gif' : 'png';
      const url = `https://cdn.discordapp.com/emojis/${id}.${ext}?size=512`;

      const embed = base(interaction.client, colors.primary).setImage(url);
      await interaction.reply({ embeds: [embed] });
    }

    else if (sub === 'steal') {
      if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuildExpressions)) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'You need **Manage Expressions** permission.', color: colors.error })], ephemeral: true });
      }

      const input = interaction.options.getString('emoji');
      const match = input.match(EMOJI_REGEX);
      if (!match) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Provide a valid custom emoji.', color: colors.error })], ephemeral: true });
      }

      const [, animated, defaultName, id] = match;
      const name = interaction.options.getString('name') || defaultName;
      const ext = animated ? 'gif' : 'png';
      const url = `https://cdn.discordapp.com/emojis/${id}.${ext}?size=128`;

      if (!url.startsWith('https://cdn.discordapp.com/')) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Invalid emoji URL', color: colors.error })], ephemeral: true });
      }

      try {
        const emoji = await interaction.guild.emojis.create({ attachment: url, name });
        await interaction.reply({ embeds: [response({ client: interaction.client, description: `Added ${emoji} as \`:${emoji.name}:\``, color: colors.success })] });
      } catch {
        await interaction.reply({ embeds: [response({ client: interaction.client, description: 'Failed to add emoji. Server may be at the emoji limit.', color: colors.error })], ephemeral: true });
      }
    }
  },
};
