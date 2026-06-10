const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base, response } = require('../../utils/embed');
const store = require('../../database/store');

const ITEM_NAMES = {
  fishing_rod: { name: 'Fishing Rod', emoji: '🎣' },
  laptop: { name: 'Laptop', emoji: '💻' },
  shield: { name: 'Rob Shield', emoji: '🛡️' },
  lucky_coin: { name: 'Lucky Coin', emoji: '🍀' },
  bank_note: { name: 'Bank Note', emoji: '💵' },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('View your inventory')
    .addUserOption((o) => o.setName('user').setDescription('User to check')),

  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const inv = store.getConfig(interaction.guild.id, `inv_${target.id}`) || {};
    const entries = Object.entries(inv).filter(([, count]) => count > 0);

    if (!entries.length) {
      return interaction.reply({
        embeds: [response({ client: interaction.client, description: `${target} has no items.`, color: colors.muted })],
        ephemeral: true,
      });
    }

    const desc = entries.map(([id, count]) => {
      const item = ITEM_NAMES[id] || { name: id, emoji: '📦' };
      return `${item.emoji} **${item.name}** × ${count}`;
    }).join('\n');

    const embed = base(interaction.client, colors.primary)
      .setAuthor({ name: `${target.displayName}'s Inventory`, iconURL: target.displayAvatarURL() })
      .setDescription(desc);

    await interaction.reply({ embeds: [embed] });
  },
};
