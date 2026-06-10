const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autoresponder')
    .setDescription('Manage autoresponders')
    .addSubcommand((sub) =>
      sub.setName('add').setDescription('Add an autoresponder')
        .addStringOption((o) => o.setName('trigger').setDescription('Trigger word/phrase').setRequired(true))
        .addStringOption((o) => o.setName('response').setDescription('Response text').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('remove').setDescription('Remove an autoresponder')
        .addStringOption((o) => o.setName('trigger').setDescription('Trigger to remove').setRequired(true))
    )
    .addSubcommand((sub) => sub.setName('list').setDescription('List all autoresponders'))
    .addSubcommand((sub) => sub.setName('clear').setDescription('Remove all autoresponders'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const { guild } = interaction;
    const responders = store.getConfig(guild.id, 'autoresponders') || {};

    if (sub === 'add') {
      const trigger = interaction.options.getString('trigger').toLowerCase();
      const resp = interaction.options.getString('response');

      if (!resp.trim()) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Response cannot be empty.', color: colors.error })], ephemeral: true });
      }

      if (Object.keys(responders).length >= 50) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Max 50 autoresponders reached.', color: colors.error })], ephemeral: true });
      }

      if (responders[trigger]) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: `An autoresponder for \`${trigger}\` already exists. Remove it first or use a different trigger.`, color: colors.warning })], ephemeral: true });
      }

      responders[trigger] = resp;
      store.setConfig(guild.id, 'autoresponders', responders);
      await interaction.reply({ embeds: [response({ client: interaction.client, description: `Autoresponder added: \`${trigger}\` → ${resp}`, color: colors.success })] });

    } else if (sub === 'remove') {
      const trigger = interaction.options.getString('trigger').toLowerCase();
      if (!responders[trigger]) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: `No autoresponder for \`${trigger}\`.`, color: colors.error })], ephemeral: true });
      }
      delete responders[trigger];
      store.setConfig(guild.id, 'autoresponders', responders);
      await interaction.reply({ embeds: [response({ client: interaction.client, description: `Autoresponder \`${trigger}\` removed.`, color: colors.success })] });

    } else if (sub === 'list') {
      const entries = Object.entries(responders);
      if (!entries.length) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'No autoresponders set.', color: colors.muted })] });
      }
      const list = entries.map(([t, r]) => `\`${t}\` → ${r.slice(0, 50)}`).join('\n');
      await interaction.reply({ embeds: [response({ client: interaction.client, description: `**Autoresponders** (${entries.length})\n\n${list}`, color: colors.info })] });

    } else {
      store.setConfig(guild.id, 'autoresponders', {});
      await interaction.reply({ embeds: [response({ client: interaction.client, description: 'All autoresponders cleared.', color: colors.muted })] });
    }
  },
};
