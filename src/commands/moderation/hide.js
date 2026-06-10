const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const modlog = require('../../utils/modlog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hide')
    .setDescription('Hide or reveal a channel')
    .addSubcommand((s) => s.setName('on').setDescription('Hide this channel from @everyone'))
    .addSubcommand((s) => s.setName('off').setDescription('Reveal a hidden channel to @everyone'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'on') {
      await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { ViewChannel: false });
      await interaction.reply({ embeds: [response({ client: interaction.client, description: 'Channel hidden.', color: colors.muted })], ephemeral: true });
      await modlog.send(interaction.guild, { action: 'hide', target: interaction.channel, moderator: interaction.user, reason: `Hidden #${interaction.channel.name}` });
    } else if (sub === 'off') {
      await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { ViewChannel: null });
      await interaction.reply({ embeds: [response({ client: interaction.client, description: 'Channel revealed.', color: colors.success })] });
      await modlog.send(interaction.guild, { action: 'unhide', target: interaction.channel, moderator: interaction.user, reason: `Revealed #${interaction.channel.name}` });
    }
  },
};
