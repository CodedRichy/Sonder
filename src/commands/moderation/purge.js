const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const modlog = require('../../utils/modlog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Bulk delete messages')
    .addIntegerOption((o) =>
      o.setName('amount').setDescription('Number of messages to delete (1-100)').setRequired(true).setMinValue(1).setMaxValue(100)
    )
    .addUserOption((o) => o.setName('user').setDescription('Only delete messages from this user'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const targetUser = interaction.options.getUser('user');

    await interaction.deferReply({ ephemeral: true });

    let messages = await interaction.channel.messages.fetch({ limit: targetUser ? 100 : amount });

    if (targetUser) {
      messages = messages.filter((m) => m.author.id === targetUser.id);
      messages = [...messages.values()].slice(0, amount);
    }

    const deleted = await interaction.channel.bulkDelete(messages, true);

    const desc = targetUser
      ? `Deleted **${deleted.size}** message(s) from **${targetUser.tag}**`
      : `Deleted **${deleted.size}** message(s)`;

    await interaction.editReply({ embeds: [response({ client: interaction.client, description: desc, color: colors.info })] });

    await modlog.send(interaction.guild, {
      action: 'purge',
      target: interaction.user,
      moderator: interaction.user,
      reason: `${deleted.size} messages in #${interaction.channel.name}`,
      extra: targetUser ? `Filtered: ${targetUser.tag}` : null,
    });
  },
};
