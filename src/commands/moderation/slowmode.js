const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const modlog = require('../../utils/modlog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set channel slowmode')
    .addIntegerOption((o) => o.setName('seconds').setDescription('Slowmode in seconds (0 to disable)').setRequired(true).setMinValue(0).setMaxValue(21600))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const seconds = interaction.options.getInteger('seconds');
    await interaction.channel.setRateLimitPerUser(seconds, `Set by ${interaction.user.tag}`);

    await interaction.reply({
      embeds: [response({
        client: interaction.client,
        description: seconds ? `Slowmode set to **${seconds}s**` : 'Slowmode disabled.',
        color: seconds ? colors.success : colors.muted,
      })],
    });
    await modlog.send(interaction.guild, { action: 'slowmode', target: interaction.channel, moderator: interaction.user, reason: seconds ? `Set to ${seconds}s` : 'Disabled' });
  },
};
