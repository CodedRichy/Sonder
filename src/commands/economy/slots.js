const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base, response } = require('../../utils/embed');
const store = require('../../database/store');

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
const PAYOUTS = {
  '7️⃣': 10,
  '💎': 5,
  '🍇': 3,
  '🍊': 2,
  '🍋': 1.5,
  '🍒': 1,
};

function spin() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

const SLOTS_COOLDOWN = 15000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slots')
    .setDescription('Try your luck on the slot machine')
    .addIntegerOption((o) => o.setName('amount').setDescription('Amount to bet').setRequired(true).setMinValue(10)),

  async execute(interaction) {
    const { guild, user } = interaction;

    const cd = store.getCooldown(guild.id, user.id, 'slots');
    if (cd) {
      const remaining = Math.ceil((cd - Date.now()) / 1000);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `You need to wait **${remaining}s** before spinning again.`, color: colors.error })], ephemeral: true });
    }

    const amount = interaction.options.getInteger('amount');
    const bal = store.getBalance(guild.id, user.id);

    if (amount > bal.wallet) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `You only have **⌬ ${bal.wallet.toLocaleString()}** in your wallet.`, color: colors.error })], ephemeral: true });
    }

    store.setCooldown(guild.id, user.id, 'slots', Date.now() + SLOTS_COOLDOWN);

    const inv = store.getConfig(guild.id, `inv_${user.id}`) || {};
    let hasLuck = false;
    if (inv.lucky_coin && inv.lucky_coin > 0) {
      inv.lucky_coin -= 1;
      if (inv.lucky_coin === 0) delete inv.lucky_coin;
      store.setConfig(guild.id, `inv_${user.id}`, inv);
      hasLuck = true;
    }

    const r1 = spin(), r2 = hasLuck ? r1 : spin(), r3 = hasLuck ? r1 : spin();
    let multiplier = 0;

    if (r1 === r2 && r2 === r3) {
      multiplier = PAYOUTS[r1];
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
      multiplier = 0.5;
    }

    const winnings = Math.floor(amount * multiplier);
    const net = winnings - amount;
    store.addWallet(guild.id, user.id, net);
    const newBal = store.getBalance(guild.id, user.id);

    const won = net > 0;
    const tied = net === 0 && multiplier > 0;

    let result;
    if (won) {
      result = `You won **⌬ ${winnings.toLocaleString()}** (${multiplier}x)`;
    } else if (tied) {
      result = `You broke even`;
    } else if (multiplier > 0) {
      result = `You got half back — lost **⌬ ${Math.abs(net).toLocaleString()}**`;
    } else {
      result = `You lost **⌬ ${amount.toLocaleString()}**`;
    }

    const embed = base(interaction.client, won ? colors.success : multiplier > 0 ? colors.warning : colors.error)
      .setAuthor({ name: 'Slots', iconURL: user.displayAvatarURL() })
      .setDescription(
        `> ${r1} ${r2} ${r3}\n\n` +
        `${result}\n` +
        `**Wallet** \`⌬ ${newBal.wallet.toLocaleString()}\``
      );

    await interaction.reply({ embeds: [embed] });
  },
};
