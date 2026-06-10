const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prefix')
    .setDescription('View or change the server prefix')
    .addStringOption((o) => o.setName('new_prefix').setDescription('New prefix (1-5 characters)').setMinLength(1).setMaxLength(5))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const newPrefix = interaction.options.getString('new_prefix');
    const { guild } = interaction;

    if (!newPrefix) {
      const current = store.getConfig(guild.id, 'prefix') || config.discord.defaultPrefix;
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `Current prefix: \`${current}\``, color: colors.info })] });
    }

    if (!newPrefix.trim()) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Prefix cannot be empty or whitespace only.', color: colors.error })], ephemeral: true });
    }

    store.setConfig(guild.id, 'prefix', newPrefix);
    await interaction.reply({ embeds: [response({ client: interaction.client, description: `Prefix changed to \`${newPrefix}\``, color: colors.success })] });
  },
};
