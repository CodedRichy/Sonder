const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');

const AGE_OPTIONS = [
  { name: '1 day', value: 86400000 },
  { name: '3 days', value: 259200000 },
  { name: '7 days (default)', value: 604800000 },
  { name: '14 days', value: 1209600000 },
  { name: '30 days', value: 2592000000 },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antiraid')
    .setDescription('Configure antiraid protection')
    .addSubcommand((sub) => sub.setName('enable').setDescription('Enable antiraid protection'))
    .addSubcommand((sub) => sub.setName('disable').setDescription('Disable antiraid protection'))
    .addSubcommand((sub) =>
      sub.setName('threshold').setDescription('Set join flood threshold')
        .addIntegerOption((o) => o.setName('count').setDescription('Max joins in 10s before trigger (default: 5)').setRequired(true).setMinValue(3).setMaxValue(20))
    )
    .addSubcommand((sub) =>
      sub.setName('action').setDescription('Set action for raiders')
        .addStringOption((o) =>
          o.setName('type').setDescription('Action to take').setRequired(true)
            .addChoices(
              { name: 'Kick (default)', value: 'kick' },
              { name: 'Ban', value: 'ban' },
            )
        )
    )
    .addSubcommand((sub) =>
      sub.setName('accountage').setDescription('Set minimum account age')
        .addIntegerOption((o) =>
          o.setName('age').setDescription('Minimum account age').setRequired(true)
            .addChoices(...AGE_OPTIONS.map((a) => ({ name: a.name, value: a.value })))
        )
    )
    .addSubcommand((sub) => sub.setName('settings').setDescription('View antiraid settings'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const { guild } = interaction;

    if (sub === 'enable') {
      const existing = store.getConfig(guild.id, 'antiraid');
      if (existing === true) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Antiraid is already enabled.', color: colors.warning })], ephemeral: true });
      }
      store.setConfig(guild.id, 'antiraid', true);
      await interaction.reply({ embeds: [response({ client: interaction.client, description: 'Antiraid protection **enabled**.\nJoin floods and new account raids will be detected.', color: colors.success })] });

    } else if (sub === 'disable') {
      const existing = store.getConfig(guild.id, 'antiraid');
      if (!existing) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Antiraid is not currently enabled.', color: colors.warning })], ephemeral: true });
      }
      store.setConfig(guild.id, 'antiraid', false);
      await interaction.reply({ embeds: [response({ client: interaction.client, description: 'Antiraid protection **disabled**.', color: colors.muted })] });

    } else if (sub === 'threshold') {
      const count = interaction.options.getInteger('count');
      const currentThreshold = store.getConfig(guild.id, 'antiraid_threshold');
      if (currentThreshold === count) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: `Threshold is already set to **${count}**.`, color: colors.warning })], ephemeral: true });
      }
      store.setConfig(guild.id, 'antiraid_threshold', count);
      await interaction.reply({ embeds: [response({ client: interaction.client, description: `Raid threshold set to **${count}** joins in 10 seconds.`, color: colors.success })] });

    } else if (sub === 'action') {
      const type = interaction.options.getString('type');
      store.setConfig(guild.id, 'antiraid_action', type);
      await interaction.reply({ embeds: [response({ client: interaction.client, description: `Raid action set to **${type}**.`, color: colors.success })] });

    } else if (sub === 'accountage') {
      const age = interaction.options.getInteger('age');
      store.setConfig(guild.id, 'antiraid_account_age', age);
      const label = AGE_OPTIONS.find((a) => a.value === age)?.name || `${age}ms`;
      await interaction.reply({ embeds: [response({ client: interaction.client, description: `Minimum account age set to **${label}**.`, color: colors.success })] });

    } else {
      const enabled = store.getConfig(guild.id, 'antiraid') === true;
      const threshold = store.getConfig(guild.id, 'antiraid_threshold') || 5;
      const action = store.getConfig(guild.id, 'antiraid_action') || 'kick';
      const accountAge = store.getConfig(guild.id, 'antiraid_account_age') || 604800000;
      const ageLabel = AGE_OPTIONS.find((a) => a.value === accountAge)?.name || `${Math.floor(accountAge / 86400000)}d`;

      await interaction.reply({
        embeds: [response({
          client: interaction.client,
          description: `**Status** ${enabled ? '🟢 Enabled' : '🔴 Disabled'}\n**Threshold** ${threshold} joins / 10s\n**Action** ${action}\n**Min Account Age** ${ageLabel}`,
          color: enabled ? colors.success : colors.muted,
        })],
      });
    }
  },
};
