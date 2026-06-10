const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const vm = require('../../database/voicemaster');

function requireOwner(interaction) {
  const channel = interaction.member.voice.channel;
  if (!channel) return 'Join your voice channel first.';
  if (!vm.isVoiceMasterChannel(channel.id)) return 'This is not a VoiceMaster channel.';
  if (vm.getOwner(channel.id) !== interaction.user.id) return 'You are not the owner of this channel.';
  return null;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('voice')
    .setDescription('Control your VoiceMaster channel')
    .addSubcommand((s) =>
      s.setName('lock').setDescription('Lock your channel')
    )
    .addSubcommand((s) =>
      s.setName('unlock').setDescription('Unlock your channel')
    )
    .addSubcommand((s) =>
      s.setName('rename')
        .setDescription('Rename your channel')
        .addStringOption((o) => o.setName('name').setDescription('New channel name').setRequired(true).setMaxLength(100))
    )
    .addSubcommand((s) =>
      s.setName('limit')
        .setDescription('Set user limit')
        .addIntegerOption((o) => o.setName('count').setDescription('Max users (0 = unlimited)').setRequired(true).setMinValue(0).setMaxValue(99))
    )
    .addSubcommand((s) =>
      s.setName('claim').setDescription('Claim ownership if the owner left')
    )
    .addSubcommand((s) =>
      s.setName('permit')
        .setDescription('Allow a user into a locked channel')
        .addUserOption((o) => o.setName('user').setDescription('User to permit').setRequired(true))
    )
    .addSubcommand((s) =>
      s.setName('reject')
        .setDescription('Remove a user from your channel')
        .addUserOption((o) => o.setName('user').setDescription('User to reject').setRequired(true))
    )
    .addSubcommand((s) =>
      s.setName('info').setDescription('View info about your current voice channel')
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const { guild } = interaction;

    if (sub === 'claim') {
      const channel = interaction.member.voice.channel;
      if (!channel) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Join a voice channel first.', color: colors.error })], ephemeral: true });
      }
      if (!vm.isVoiceMasterChannel(channel.id)) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'This is not a VoiceMaster channel.', color: colors.error })], ephemeral: true });
      }

      const currentOwner = vm.getOwner(channel.id);
      const ownerInChannel = channel.members.has(currentOwner);
      if (ownerInChannel) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'The owner is still in the channel.', color: colors.error })], ephemeral: true });
      }

      vm.setOwner(channel.id, interaction.user.id);
      await channel.permissionOverwrites.edit(interaction.user.id, {
        ManageChannels: true, MuteMembers: true, DeafenMembers: true, MoveMembers: true,
      }).catch(() => {});

      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'You now own this channel.', color: colors.success })] });
    }

    if (sub === 'info') {
      const channel = interaction.member.voice.channel;
      if (!channel) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Join a voice channel first.', color: colors.error })], ephemeral: true });
      }

      const owner = vm.getOwner(channel.id);
      const isVM = vm.isVoiceMasterChannel(channel.id);
      const desc = [
        `**Channel** ${channel.name}`,
        `**Members** ${channel.members.size}${channel.userLimit ? `/${channel.userLimit}` : ''}`,
        `**Bitrate** ${channel.bitrate / 1000}kbps`,
        isVM ? `**Owner** <@${owner}>` : '**Type** Standard',
      ].join('\n');

      return interaction.reply({ embeds: [response({ client: interaction.client, description: desc, color: colors.primary })], ephemeral: true });
    }

    const err = requireOwner(interaction);
    if (err) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: err, color: colors.error })], ephemeral: true });
    }

    const channel = interaction.member.voice.channel;

    if (sub === 'lock') {
      await channel.permissionOverwrites.edit(guild.roles.everyone, { Connect: false }).catch(() => {});
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Channel locked.', color: colors.success })] });
    }

    if (sub === 'unlock') {
      await channel.permissionOverwrites.edit(guild.roles.everyone, { Connect: null }).catch(() => {});
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Channel unlocked.', color: colors.success })] });
    }

    if (sub === 'rename') {
      const name = interaction.options.getString('name');
      await channel.setName(name).catch(() => {});
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `Renamed to **${name}**`, color: colors.success })] });
    }

    if (sub === 'limit') {
      const count = interaction.options.getInteger('count');
      await channel.setUserLimit(count).catch(() => {});
      return interaction.reply({ embeds: [response({ client: interaction.client, description: count ? `User limit set to **${count}**` : 'User limit removed.', color: colors.success })] });
    }

    if (sub === 'permit') {
      const user = interaction.options.getUser('user');
      await channel.permissionOverwrites.edit(user.id, { Connect: true, ViewChannel: true }).catch(() => {});
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `${user} can now join your channel.`, color: colors.success })] });
    }

    if (sub === 'reject') {
      const user = interaction.options.getUser('user');
      if (user.id === interaction.user.id) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: "Can't reject yourself.", color: colors.error })], ephemeral: true });
      }
      await channel.permissionOverwrites.edit(user.id, { Connect: false }).catch(() => {});
      const member = channel.members.get(user.id);
      if (member) await member.voice.disconnect().catch(() => {});
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `${user} has been rejected from your channel.`, color: colors.success })] });
    }
  },
};
