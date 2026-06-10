const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');

const JOBS = [
  { job: 'software developer', min: 200, max: 500 },
  { job: 'chef', min: 100, max: 300 },
  { job: 'teacher', min: 150, max: 350 },
  { job: 'streamer', min: 50, max: 600 },
  { job: 'mechanic', min: 100, max: 400 },
  { job: 'doctor', min: 300, max: 700 },
  { job: 'artist', min: 50, max: 400 },
  { job: 'janitor', min: 50, max: 200 },
  { job: 'pilot', min: 250, max: 600 },
  { job: 'musician', min: 75, max: 450 },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work a job to earn money'),

  async execute(interaction) {
    const cd = store.getCooldown(interaction.guild.id, interaction.user.id, 'work');
    if (cd) {
      const remaining = Math.ceil((cd - Date.now()) / 60000);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `You can work again in **${remaining}m**`, color: colors.error })], ephemeral: true });
    }

    const entry = JOBS[Math.floor(Math.random() * JOBS.length)];
    const earned = Math.floor(Math.random() * (entry.max - entry.min + 1)) + entry.min;

    const inv = store.getConfig(interaction.guild.id, `inv_${interaction.user.id}`) || {};
    const finalEarned = inv.laptop ? Math.floor(earned * 1.5) : earned;

    store.setCooldown(interaction.guild.id, interaction.user.id, 'work', Date.now() + 3600000);
    store.addWallet(interaction.guild.id, interaction.user.id, finalEarned);

    await interaction.reply({
      embeds: [response({
        client: interaction.client,
        description: `You worked as a **${entry.job}** and earned **⌬${finalEarned.toLocaleString()}**`,
        color: colors.success,
      })],
    });
  },
};
