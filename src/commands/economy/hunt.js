const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');

const ANIMALS = [
  { emoji: '🐿️', name: 'Squirrel', weight: 30, min: 30, max: 80 },
  { emoji: '🦊', name: 'Fox', weight: 25, min: 80, max: 180 },
  { emoji: '🦌', name: 'Deer', weight: 20, min: 180, max: 350 },
  { emoji: '🐺', name: 'Wolf', weight: 10, min: 300, max: 500 },
  { emoji: '🐻', name: 'Bear', weight: 7, min: 500, max: 900 },
  { emoji: '🦅', name: 'Eagle', weight: 5, min: 600, max: 1000 },
  { emoji: '🐉', name: 'Dragon', weight: 3, min: 1200, max: 2000 },
];

function pickAnimal() {
  const total = ANIMALS.reduce((sum, a) => sum + a.weight, 0);
  let roll = Math.random() * total;
  for (const animal of ANIMALS) {
    roll -= animal.weight;
    if (roll <= 0) return animal;
  }
  return ANIMALS[0];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hunt')
    .setDescription('Go hunting in the wilderness'),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const userId = interaction.user.id;

    const cd = store.getCooldown(guildId, userId, 'hunt');
    if (cd) {
      const remaining = Math.ceil((cd - Date.now()) / 60000);
      return interaction.reply({
        embeds: [response({ client: interaction.client, description: `You can hunt again in **${remaining}m**`, color: colors.error })],
        ephemeral: true,
      });
    }

    const animal = pickAnimal();
    const amount = Math.floor(Math.random() * (animal.max - animal.min + 1)) + animal.min;

    store.setCooldown(guildId, userId, 'hunt', Date.now() + 2700000);
    store.addWallet(guildId, userId, amount);

    const description = animal.name === 'Dragon'
      ? `You encountered a rare ${animal.emoji} **Dragon**! Sold for **⌬${amount.toLocaleString()}**`
      : `You hunted a ${animal.emoji} **${animal.name}** and sold it for **⌬${amount.toLocaleString()}**`;

    await interaction.reply({
      embeds: [response({
        client: interaction.client,
        description,
        color: colors.success,
      })],
    });
  },
};
