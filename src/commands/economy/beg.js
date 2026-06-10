const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');

const RESPONSES = [
  { text: 'A kind stranger gives you', success: true },
  { text: 'Someone threw spare change at you —', success: true },
  { text: 'You found some coins on the ground:', success: true },
  { text: 'A wealthy passerby took pity:', success: true },
  { text: 'Nobody gave you anything.', success: false },
  { text: "People walked past you.", success: false },
  { text: "You got ignored.", success: false },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('beg')
    .setDescription('Beg for money'),

  async execute(interaction) {
    const cd = store.getCooldown(interaction.guild.id, interaction.user.id, 'beg');
    if (cd) {
      const remaining = Math.ceil((cd - Date.now()) / 1000);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `You can beg again in **${remaining}s**`, color: colors.error })], ephemeral: true });
    }

    const entry = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
    store.setCooldown(interaction.guild.id, interaction.user.id, 'beg', Date.now() + 30000);

    if (entry.success) {
      const amount = Math.floor(Math.random() * 200) + 10;
      store.addWallet(interaction.guild.id, interaction.user.id, amount);
      await interaction.reply({ embeds: [response({ client: interaction.client, description: `${entry.text} **⌬${amount}**`, color: colors.success })] });
    } else {
      await interaction.reply({ embeds: [response({ client: interaction.client, description: entry.text, color: colors.muted })] });
    }
  },
};
