const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base, response } = require('../../utils/embed');
const store = require('../../database/store');

const HEIST_COOLDOWN = 3600000;
const MIN_WALLET = 500;
const JOIN_WINDOW = 60000;
const MAX_CREW = 5;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('heist')
    .setDescription('Start a heist and recruit a crew'),

  async execute(interaction) {
    const { guild, user } = interaction;

    const cd = store.getCooldown(guild.id, user.id, 'heist');
    if (cd) {
      const mins = Math.ceil((cd - Date.now()) / 60000);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `You need to wait **${mins}m** before starting another heist.`, color: colors.muted })], ephemeral: true });
    }

    const bal = store.getBalance(guild.id, user.id);
    if (bal.wallet < MIN_WALLET) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `You need at least **⌬ ${MIN_WALLET.toLocaleString()}** in your wallet to start a heist.`, color: colors.error })], ephemeral: true });
    }

    store.setCooldown(guild.id, user.id, 'heist', Date.now() + HEIST_COOLDOWN);

    const crew = new Set([user.id]);
    const heistId = `heist_${user.id}_${Date.now()}`;
    const startTime = Math.floor((Date.now() + JOIN_WINDOW) / 1000);

    function buildLobbyEmbed() {
      const members = [...crew].map((id) => `<@${id}>`).join(', ');
      return base(interaction.client, colors.primary)
        .setDescription(
          `💰 **${user.tag}** is planning a heist!\n` +
          `Join the crew by clicking below\n` +
          `Heist begins <t:${startTime}:R>\n\n` +
          `**Crew (${crew.size}/${MAX_CREW}):** ${members}`
        );
    }

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(heistId).setLabel('Join Heist').setStyle(ButtonStyle.Primary),
    );

    const msg = await interaction.reply({ embeds: [buildLobbyEmbed()], components: [button], fetchReply: true });

    const collector = msg.createMessageComponentCollector({ time: JOIN_WINDOW });

    collector.on('collect', async (btn) => {
      if (btn.customId !== heistId) return;

      if (crew.has(btn.user.id)) {
        return btn.reply({ embeds: [response({ client: interaction.client, description: "You're already in the crew.", color: colors.error })], ephemeral: true });
      }

      if (crew.size >= MAX_CREW) {
        return btn.reply({ embeds: [response({ client: interaction.client, description: 'The crew is full.', color: colors.error })], ephemeral: true });
      }

      const joinerBal = store.getBalance(guild.id, btn.user.id);
      if (joinerBal.wallet < MIN_WALLET) {
        return btn.reply({ embeds: [response({ client: interaction.client, description: `You need at least **⌬ ${MIN_WALLET.toLocaleString()}** in your wallet to join.`, color: colors.error })], ephemeral: true });
      }

      crew.add(btn.user.id);
      await btn.update({ embeds: [buildLobbyEmbed()], components: crew.size >= MAX_CREW ? [] : [button] });
    });

    collector.on('end', async () => {
      const crewArray = [...crew];
      const crewSize = crewArray.length;
      const successChance = Math.min(0.3 + 0.1 * crewSize, 0.8);
      const success = Math.random() < successChance;

      if (success) {
        const totalLoot = Math.floor((Math.random() * 2001 + 1000) * crewSize);
        const split = Math.floor(totalLoot / crewSize);

        for (const id of crewArray) {
          store.addWallet(guild.id, id, split);
        }

        const embed = base(interaction.client, colors.success)
          .setDescription(
            `The crew got away with **⌬ ${totalLoot.toLocaleString()}**!\n` +
            `Each member earned **⌬ ${split.toLocaleString()}**`
          );

        await interaction.editReply({ embeds: [embed], components: [] });
      } else {
        const loss = Math.floor(Math.random() * 201 + 200);

        for (const id of crewArray) {
          const memberBal = store.getBalance(guild.id, id);
          const actualLoss = Math.min(loss, memberBal.wallet);
          store.addWallet(guild.id, id, -actualLoss);
        }

        const embed = base(interaction.client, colors.error)
          .setDescription(
            `The heist went wrong! Each member lost **⌬ ${loss.toLocaleString()}**`
          );

        await interaction.editReply({ embeds: [embed], components: [] });
      }
    });
  },
};
