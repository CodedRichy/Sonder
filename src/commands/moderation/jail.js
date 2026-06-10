const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response, modAction, dmNotice } = require('../../utils/embed');
const store = require('../../database/store');
const modlog = require('../../utils/modlog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jail')
    .setDescription('Jail or unjail a member')
    .addSubcommand((s) =>
      s.setName('add')
        .setDescription('Jail a member — strips roles and restricts to jail channel')
        .addUserOption((o) => o.setName('user').setDescription('Member to jail').setRequired(true))
        .addStringOption((o) => o.setName('reason').setDescription('Reason for jailing'))
    )
    .addSubcommand((s) =>
      s.setName('remove')
        .setDescription('Release a member from jail')
        .addUserOption((o) => o.setName('user').setDescription('Member to unjail').setRequired(true))
        .addStringOption((o) => o.setName('reason').setDescription('Reason'))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!target) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'User not found in server.', color: colors.error })], ephemeral: true });
    }

    if (sub === 'add') {
      if (target.id === interaction.user.id) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: "You can't jail yourself.", color: colors.error })], ephemeral: true });
      }

      if (target.roles.highest.position > interaction.member.roles.highest.position) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Target has a higher role.', color: colors.error })], ephemeral: true });
      }

      let jailRole = interaction.guild.roles.cache.find((r) => r.name === 'Jailed');
      if (!jailRole) {
        jailRole = await interaction.guild.roles.create({
          name: 'Jailed',
          color: 0x2c2f33,
          permissions: [],
          reason: '[sonder] Auto-created jail role',
        });

        for (const [, channel] of interaction.guild.channels.cache) {
          if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice) {
            await channel.permissionOverwrites.edit(jailRole, {
              ViewChannel: false,
              SendMessages: false,
              Connect: false,
            }).catch(() => {});
          }
        }
      }

      let jailChannel = interaction.guild.channels.cache.find((c) => c.name === 'jail');
      if (!jailChannel) {
        jailChannel = await interaction.guild.channels.create({
          name: 'jail',
          type: ChannelType.GuildText,
          permissionOverwrites: [
            { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: jailRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages], deny: [PermissionFlagsBits.AttachFiles, PermissionFlagsBits.EmbedLinks] },
          ],
          reason: '[sonder] Auto-created jail channel',
        });
      }

      const savedRoles = target.roles.cache.filter((r) => r.id !== interaction.guild.id).map((r) => r.id);
      store.setConfig(interaction.guild.id, `jail_roles_${target.id}`, savedRoles);

      await target.roles.set([jailRole.id], `Jailed by ${interaction.user.tag}: ${reason}`);

      await target.user.send({ embeds: [dmNotice({ guild: interaction.guild, action: 'Jailed', reason, color: colors.error })] }).catch(() => {});

      const embed = modAction({
        client: interaction.client, action: 'Jail', color: colors.error,
        target: target.user, moderator: interaction.user, reason,
      });

      await interaction.reply({ embeds: [embed] });
      await modlog.send(interaction.guild, { action: 'Jail', target: target.user, moderator: interaction.user, reason });
    } else if (sub === 'remove') {
      if (target.id === interaction.user.id) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: "You can't unjail yourself.", color: colors.error })], ephemeral: true });
      }

      const jailRole = interaction.guild.roles.cache.find((r) => r.name === 'Jailed');
      if (!jailRole || !target.roles.cache.has(jailRole.id)) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'User is not jailed.', color: colors.error })], ephemeral: true });
      }

      const savedRoles = store.getConfig(interaction.guild.id, `jail_roles_${target.id}`) || [];
      await target.roles.set(savedRoles, `Unjailed by ${interaction.user.tag}: ${reason}`);
      store.setConfig(interaction.guild.id, `jail_roles_${target.id}`, null);

      const embed = modAction({
        client: interaction.client, action: 'Unjail', color: colors.success,
        target: target.user, moderator: interaction.user, reason,
      });

      await interaction.reply({ embeds: [embed] });
      await modlog.send(interaction.guild, { action: 'Unjail', target: target.user, moderator: interaction.user, reason });
    }
  },
};
