const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');

const TRANSFER_COOLDOWN = 30000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Send money to another member')
    .addUserOption((o) => o.setName('user').setDescription('Member to send to').setRequired(true))
    .addIntegerOption((o) => o.setName('amount').setDescription('Amount to send').setRequired(true).setMinValue(1)),

  async execute(interaction) {
    const { guild, user } = interaction;

    const cd = store.getCooldown(guild.id, user.id, 'transfer');
    if (cd) {
      const remaining = Math.ceil((cd - Date.now()) / 1000);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `You need to wait **${remaining}s** before transferring again.`, color: colors.error })], ephemeral: true });
    }

    const target = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    if (target.id === user.id) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: "You can't transfer to yourself.", color: colors.error })], ephemeral: true });
    }

    if (target.bot) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: "You can't transfer to a bot.", color: colors.error })], ephemeral: true });
    }

    const result = store.transfer(guild.id, user.id, target.id, amount);
    if (!result) {
      const bal = store.getBalance(guild.id, user.id);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `You only have **⌬ ${bal.wallet.toLocaleString()}** in your wallet.`, color: colors.error })], ephemeral: true });
    }

    store.setCooldown(guild.id, user.id, 'transfer', Date.now() + TRANSFER_COOLDOWN);

    await interaction.reply({
      embeds: [response({
        client: interaction.client,
        description: `Sent **⌬ ${amount.toLocaleString()}** to **${target.tag}**\n**Your wallet** \`⌬ ${result.from.toLocaleString()}\``,
        color: colors.success,
      })],
    });
  },
};
