const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('boosterrole')
    .setDescription('Create or manage your custom booster role')
    .addSubcommand((sub) =>
      sub.setName('create').setDescription('Create your custom role')
        .addStringOption((o) => o.setName('name').setDescription('Role name').setRequired(true).setMaxLength(32))
        .addStringOption((o) => o.setName('color').setDescription('Hex color (e.g. #ff0000)').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('color').setDescription('Change your role color')
        .addStringOption((o) => o.setName('color').setDescription('Hex color').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('name').setDescription('Change your role name')
        .addStringOption((o) => o.setName('name').setDescription('New name').setRequired(true).setMaxLength(32))
    )
    .addSubcommand((sub) => sub.setName('delete').setDescription('Delete your custom role')),

  async execute(interaction) {
    if (!interaction.member.premiumSince) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'You must be a server booster to use this.', color: colors.error })], ephemeral: true });
    }

    const sub = interaction.options.getSubcommand();
    const { guild, user } = interaction;

    if (sub === 'create') {
      const existingId = store.getConfig(guild.id, `boosterrole_${user.id}`);
      if (existingId && guild.roles.cache.has(existingId)) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'You already have a custom role. Use `/boosterrole color` or `/boosterrole name` to edit.', color: colors.error })], ephemeral: true });
      }

      const name = interaction.options.getString('name');
      const colorStr = interaction.options.getString('color').replace('#', '');
      const color = parseInt(colorStr, 16);
      if (isNaN(color)) return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Invalid hex color.', color: colors.error })], ephemeral: true });

      let role;
      try {
        role = await guild.roles.create({ name, color, reason: `Booster role for ${user.tag}` });
        await interaction.member.roles.add(role);
      } catch {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Failed to create role. Check bot permissions.', color: colors.error })], ephemeral: true });
      }
      store.setConfig(guild.id, `boosterrole_${user.id}`, role.id);

      await interaction.reply({ embeds: [response({ client: interaction.client, description: `Created your custom role: ${role}`, color: colors.success })] });

    } else if (sub === 'color') {
      const roleId = store.getConfig(guild.id, `boosterrole_${user.id}`);
      const role = roleId && guild.roles.cache.get(roleId);
      if (!role) return interaction.reply({ embeds: [response({ client: interaction.client, description: 'No custom role found. Use `/boosterrole create`.', color: colors.error })], ephemeral: true });

      const colorStr = interaction.options.getString('color').replace('#', '');
      const color = parseInt(colorStr, 16);
      if (isNaN(color)) return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Invalid hex color.', color: colors.error })], ephemeral: true });

      try { await role.setColor(color); } catch { return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Failed to update color.', color: colors.error })], ephemeral: true }); }
      await interaction.reply({ embeds: [response({ client: interaction.client, description: `Role color updated to **#${colorStr}**`, color })] });

    } else if (sub === 'name') {
      const roleId = store.getConfig(guild.id, `boosterrole_${user.id}`);
      const role = roleId && guild.roles.cache.get(roleId);
      if (!role) return interaction.reply({ embeds: [response({ client: interaction.client, description: 'No custom role found.', color: colors.error })], ephemeral: true });

      const name = interaction.options.getString('name');
      try { await role.setName(name); } catch { return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Failed to update name.', color: colors.error })], ephemeral: true }); }
      await interaction.reply({ embeds: [response({ client: interaction.client, description: `Role renamed to **${name}**`, color: colors.success })] });

    } else {
      const roleId = store.getConfig(guild.id, `boosterrole_${user.id}`);
      const role = roleId && guild.roles.cache.get(roleId);
      if (!role) return interaction.reply({ embeds: [response({ client: interaction.client, description: 'No custom role to delete.', color: colors.error })], ephemeral: true });

      try { await role.delete(); } catch { return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Failed to delete role.', color: colors.error })], ephemeral: true }); }
      store.setConfig(guild.id, `boosterrole_${user.id}`, null);
      await interaction.reply({ embeds: [response({ client: interaction.client, description: 'Custom role deleted.', color: colors.muted })] });
    }
  },
};
