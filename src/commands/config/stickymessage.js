const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stickymessage')
    .setDescription('Set a sticky message for this channel')
    .addSubcommand((sub) =>
      sub.setName('set').setDescription('Set a sticky message')
        .addStringOption((o) => o.setName('message').setDescription('Message to stick').setRequired(true))
    )
    .addSubcommand((sub) => sub.setName('remove').setDescription('Remove the sticky message'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'set') {
      const message = interaction.options.getString('message');
      if (!message.trim()) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Sticky message cannot be empty.', color: colors.error })], ephemeral: true });
      }
      store.setConfig(interaction.guild.id, `sticky_${interaction.channel.id}`, message);
      await interaction.reply({ embeds: [response({ client: interaction.client, description: `Sticky message set for this channel.`, color: colors.success })], ephemeral: true });
    } else {
      store.setConfig(interaction.guild.id, `sticky_${interaction.channel.id}`, null);
      store.setConfig(interaction.guild.id, `sticky_msg_${interaction.channel.id}`, null);
      await interaction.reply({ embeds: [response({ client: interaction.client, description: 'Sticky message removed.', color: colors.muted })], ephemeral: true });
    }
  },
};
