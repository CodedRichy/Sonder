const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('threadwatch')
    .setDescription('Keep threads alive before auto-archive')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads)
    .addSubcommand((s) =>
      s.setName('add')
        .setDescription('Watch a thread')
        .addChannelOption((o) => o.setName('thread').setDescription('Thread to watch').setRequired(true))
    )
    .addSubcommand((s) =>
      s.setName('remove')
        .setDescription('Stop watching a thread')
        .addChannelOption((o) => o.setName('thread').setDescription('Thread to unwatch').setRequired(true))
    )
    .addSubcommand((s) => s.setName('list').setDescription('View watched threads')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (sub === 'add') {
      const thread = interaction.options.getChannel('thread');
      if (!thread.isThread()) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'That is not a thread.', color: colors.error })], ephemeral: true });
      }

      const watched = store.getConfig(guildId, 'threadwatch') || [];
      if (watched.includes(thread.id)) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Already watching that thread.', color: colors.muted })], ephemeral: true });
      }

      if (watched.length >= 25) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Max 25 watched threads.', color: colors.error })], ephemeral: true });
      }

      watched.push(thread.id);
      store.setConfig(guildId, 'threadwatch', watched);

      return interaction.reply({ embeds: [response({ client: interaction.client, description: `Now watching ${thread}. It will be kept alive.`, color: colors.success })] });
    }

    if (sub === 'remove') {
      const thread = interaction.options.getChannel('thread');
      const watched = store.getConfig(guildId, 'threadwatch') || [];
      const idx = watched.indexOf(thread.id);
      if (idx === -1) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Not watching that thread.', color: colors.error })], ephemeral: true });
      }

      watched.splice(idx, 1);
      store.setConfig(guildId, 'threadwatch', watched);

      return interaction.reply({ embeds: [response({ client: interaction.client, description: `Stopped watching ${thread}.`, color: colors.success })] });
    }

    if (sub === 'list') {
      const watched = store.getConfig(guildId, 'threadwatch') || [];
      if (!watched.length) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: 'No threads being watched.', color: colors.muted })], ephemeral: true });
      }

      const desc = watched.map((id) => {
        const ch = interaction.guild.channels.cache.get(id);
        return ch ? `${ch}` : `\`${id}\` (deleted)`;
      }).join('\n');

      return interaction.reply({ embeds: [response({ client: interaction.client, description: `**Watched Threads**\n\n${desc}`, color: colors.primary })] });
    }
  },
};
