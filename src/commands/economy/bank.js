const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base, response } = require('../../utils/embed');
const store = require('../../database/store');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bank')
    .setDescription('Manage your balance, deposits, and withdrawals')
    .addSubcommand((s) =>
      s.setName('balance')
        .setDescription('Check your or another member\'s balance')
        .addUserOption((o) => o.setName('user').setDescription('Member to check'))
    )
    .addSubcommand((s) =>
      s.setName('deposit')
        .setDescription('Deposit money from wallet to bank')
        .addStringOption((o) => o.setName('amount').setDescription('Amount to deposit (or "all")').setRequired(true))
    )
    .addSubcommand((s) =>
      s.setName('withdraw')
        .setDescription('Withdraw money from bank to wallet')
        .addStringOption((o) => o.setName('amount').setDescription('Amount to withdraw (or "all")').setRequired(true))
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'balance') {
      const user = interaction.options.getUser('user') || interaction.user;
      const bal = store.getBalance(interaction.guild.id, user.id);

      const cap = store.getBankCapacity(interaction.guild.id, user.id);
      const embed = base(interaction.client, colors.primary)
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setThumbnail(user.displayAvatarURL({ size: 256 }))
        .setDescription(
          `**Wallet** \`⌬ ${bal.wallet.toLocaleString()}\`\n` +
          `**Bank** \`⌬ ${bal.bank.toLocaleString()} / ${cap.toLocaleString()}\`\n` +
          `**Total** \`⌬ ${bal.total.toLocaleString()}\``
        );

      return interaction.reply({ embeds: [embed] });
    }

    if (sub === 'deposit') {
      const { guild, user } = interaction;
      const input = interaction.options.getString('amount');
      const bal = store.getBalance(guild.id, user.id);

      let amount;
      if (input.toLowerCase() === 'all') {
        amount = bal.wallet;
      } else {
        amount = parseInt(input);
      }

      if (isNaN(amount) || amount <= 0) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Enter a valid amount.', color: colors.error })], ephemeral: true });
      }

      const result = store.deposit(guild.id, user.id, amount);
      if (!result) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: `You only have **⌬ ${bal.wallet.toLocaleString()}** in your wallet.`, color: colors.error })], ephemeral: true });
      }
      if (result.full) {
        const cap = store.getBankCapacity(guild.id, user.id);
        return interaction.reply({ embeds: [response({ client: interaction.client, description: `Your bank is full (**⌬ ${cap.toLocaleString()}** capacity). Buy a 💵 **Bank Note** from the shop to expand it.`, color: colors.warning })], ephemeral: true });
      }

      const cap = store.getBankCapacity(guild.id, user.id);
      return interaction.reply({
        embeds: [response({
          client: interaction.client,
          description: `Deposited **⌬ ${(result.deposited || amount).toLocaleString()}** to your bank\n**Wallet** \`⌬ ${result.wallet.toLocaleString()}\` **Bank** \`⌬ ${result.bank.toLocaleString()} / ${cap.toLocaleString()}\``,
          color: colors.success,
        })],
      });
    }

    if (sub === 'withdraw') {
      const { guild, user } = interaction;
      const input = interaction.options.getString('amount');
      const bal = store.getBalance(guild.id, user.id);

      let amount;
      if (input.toLowerCase() === 'all') {
        amount = bal.bank;
      } else {
        amount = parseInt(input);
      }

      if (isNaN(amount) || amount <= 0) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Enter a valid amount.', color: colors.error })], ephemeral: true });
      }

      const result = store.withdraw(guild.id, user.id, amount);
      if (!result) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: `You only have **⌬ ${bal.bank.toLocaleString()}** in your bank.`, color: colors.error })], ephemeral: true });
      }

      return interaction.reply({
        embeds: [response({
          client: interaction.client,
          description: `Withdrew **⌬ ${amount.toLocaleString()}** into your wallet\n**Wallet** \`⌬ ${result.wallet.toLocaleString()}\` **Bank** \`⌬ ${result.bank.toLocaleString()}\``,
          color: colors.success,
        })],
      });
    }
  },
};
