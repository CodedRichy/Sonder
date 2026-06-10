const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');

const FISH = [
  { emoji: '🐟', name: 'Sardine', weight: 40, min: 50, max: 100 },
  { emoji: '🐠', name: 'Clownfish', weight: 25, min: 100, max: 200 },
  { emoji: '🐡', name: 'Pufferfish', weight: 15, min: 200, max: 350 },
  { emoji: '🦈', name: 'Shark', weight: 8, min: 350, max: 600 },
  { emoji: '🐙', name: 'Octopus', weight: 5, min: 400, max: 700 },
  { emoji: '🐋', name: 'Whale', weight: 3, min: 800, max: 1500 },
  { emoji: '🗑️', name: 'Old Boot', weight: 4, min: 5, max: 15 },
];

function pickFish() {
  const total = FISH.reduce((sum, f) => sum + f.weight, 0);
  let roll = Math.random() * total;
  for (const fish of FISH) {
    roll -= fish.weight;
    if (roll <= 0) return fish;
  }
  return FISH[0];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fish')
    .setDescription('Cast a line and try to catch something'),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const userId = interaction.user.id;

    const inv = store.getConfig(guildId, `inv_${userId}`) || {};
    if (!inv.fishing_rod) {
      return interaction.reply({
        embeds: [response({ client: interaction.client, description: 'You need a 🎣 **Fishing Rod** to fish. Buy one from `/shop buy`', color: colors.error })],
        ephemeral: true,
      });
    }

    const cd = store.getCooldown(guildId, userId, 'fish');
    if (cd) {
      const remaining = Math.ceil((cd - Date.now()) / 60000);
      return interaction.reply({
        embeds: [response({ client: interaction.client, description: `You can fish again in **${remaining}m**`, color: colors.error })],
        ephemeral: true,
      });
    }

    const fish = pickFish();
    const amount = Math.floor(Math.random() * (fish.max - fish.min + 1)) + fish.min;

    store.setCooldown(guildId, userId, 'fish', Date.now() + 1800000);
    store.addWallet(guildId, userId, amount);

    await interaction.reply({
      embeds: [response({
        client: interaction.client,
        description: `You caught a ${fish.emoji} **${fish.name}** and sold it for **⌬${amount.toLocaleString()}**`,
        color: fish.name === 'Old Boot' ? colors.muted : colors.success,
      })],
    });
  },
};
