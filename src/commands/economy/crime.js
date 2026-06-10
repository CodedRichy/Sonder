const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');

const CRIME_COOLDOWN = 7200000;
const SUCCESS_RATE = 0.45;

const SUCCESS_SCENARIOS = [
  { text: 'robbed a gas station', min: 500, max: 1200 },
  { text: 'hacked an ATM', min: 600, max: 1500 },
  { text: 'sold bootleg merch', min: 300, max: 800 },
  { text: 'pulled off a con', min: 400, max: 1000 },
  { text: 'found a briefcase of cash', min: 700, max: 1800 },
];

const FAIL_SCENARIOS = [
  { text: 'got caught shoplifting', min: 200, max: 500 },
  { text: 'the cops showed up', min: 300, max: 700 },
  { text: 'your getaway car broke down', min: 150, max: 400 },
  { text: 'the security guard spotted you', min: 250, max: 600 },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('crime')
    .setDescription('Commit a crime for quick cash'),

  async execute(interaction) {
    const { guild, user } = interaction;

    const cd = store.getCooldown(guild.id, user.id, 'crime');
    if (cd) {
      const remaining = Math.ceil((cd - Date.now()) / 60000);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `You need to wait **${remaining}m** before committing another crime.`, color: colors.error })], ephemeral: true });
    }

    store.setCooldown(guild.id, user.id, 'crime', Date.now() + CRIME_COOLDOWN);

    if (Math.random() < SUCCESS_RATE) {
      const scenario = SUCCESS_SCENARIOS[Math.floor(Math.random() * SUCCESS_SCENARIOS.length)];
      const amount = Math.floor(Math.random() * (scenario.max - scenario.min + 1)) + scenario.min;

      store.addWallet(guild.id, user.id, amount);

      await interaction.reply({
        embeds: [response({
          client: interaction.client,
          description: `You ${scenario.text} and got away with **⌬${amount.toLocaleString()}**`,
          color: colors.success,
        })],
      });
    } else {
      const scenario = FAIL_SCENARIOS[Math.floor(Math.random() * FAIL_SCENARIOS.length)];
      const fine = Math.floor(Math.random() * (scenario.max - scenario.min + 1)) + scenario.min;
      const bal = store.getBalance(guild.id, user.id);
      const actual = Math.min(fine, bal.wallet);

      store.addWallet(guild.id, user.id, -actual);

      await interaction.reply({
        embeds: [response({
          client: interaction.client,
          description: `You ${scenario.text} and paid a **⌬${actual.toLocaleString()}** fine`,
          color: colors.error,
        })],
      });
    }
  },
};
