const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');

const DAILY_AMOUNT = 500;
const DAILY_COOLDOWN = 86400000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward'),

  async execute(interaction) {
    const { guild, user } = interaction;
    const cd = store.getCooldown(guild.id, user.id, 'daily');

    if (cd) {
      const remaining = Math.ceil((cd - Date.now()) / 1000);
      const hours = Math.floor(remaining / 3600);
      const mins = Math.floor((remaining % 3600) / 60);
      return interaction.reply({
        embeds: [response({ client: interaction.client, description: `You've already claimed today. Try again in **${hours}h ${mins}m**`, color: colors.muted })],
        ephemeral: true,
      });
    }

    store.setCooldown(guild.id, user.id, 'daily', Date.now() + DAILY_COOLDOWN);
    store.addWallet(guild.id, user.id, DAILY_AMOUNT);

    const bal = store.getBalance(guild.id, user.id);

    await interaction.reply({
      embeds: [response({
        client: interaction.client,
        description: `You claimed your daily **⌬ ${DAILY_AMOUNT.toLocaleString()}**\n**Wallet** \`⌬ ${bal.wallet.toLocaleString()}\``,
        color: colors.success,
      })],
    });
  },
};
