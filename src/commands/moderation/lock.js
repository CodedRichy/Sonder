const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const modlog = require('../../utils/modlog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock or unlock a channel')
    .addSubcommand((s) =>
      s.setName('on')
        .setDescription('Lock a channel — prevents members from sending messages')
        .addChannelOption((o) => o.setName('channel').setDescription('Channel to lock (defaults to current)'))
        .addStringOption((o) => o.setName('reason').setDescription('Reason for locking'))
    )
    .addSubcommand((s) =>
      s.setName('off')
        .setDescription('Unlock a channel — allows members to send messages again')
        .addChannelOption((o) => o.setName('channel').setDescription('Channel to unlock (defaults to current)'))
        .addStringOption((o) => o.setName('reason').setDescription('Reason for unlocking'))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (sub === 'on') {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });

      const embed = response({
        client: interaction.client,
        description: `**${channel}** has been locked\n**Reason** ${reason}`,
        color: colors.muted,
      });

      await interaction.reply({ embeds: [embed] });
      await modlog.send(interaction.guild, { action: 'lock', target: interaction.user, moderator: interaction.user, reason, extra: `#${channel.name}` });
    } else if (sub === 'off') {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null });

      const embed = response({
        client: interaction.client,
        description: `**${channel}** has been unlocked\n**Reason** ${reason}`,
        color: colors.success,
      });

      await interaction.reply({ embeds: [embed] });
      await modlog.send(interaction.guild, { action: 'unlock', target: interaction.user, moderator: interaction.user, reason, extra: `#${channel.name}` });
    }
  },
};
