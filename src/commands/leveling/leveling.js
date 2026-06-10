const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leveling')
    .setDescription('Configure the leveling system')
    .addSubcommand((sub) =>
      sub.setName('toggle').setDescription('Enable or disable leveling')
        .addStringOption((o) => o.setName('state').setDescription('on or off').setRequired(true).addChoices(
          { name: 'On', value: 'on' },
          { name: 'Off', value: 'off' },
        ))
    )
    .addSubcommand((sub) =>
      sub.setName('channel').setDescription('Set level-up notification channel')
        .addChannelOption((o) => o.setName('channel').setDescription('Channel (leave empty for current)').addChannelTypes(ChannelType.GuildText))
    )
    .addSubcommand((sub) => sub.setName('settings').setDescription('View current leveling settings'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const { guild } = interaction;

    if (sub === 'toggle') {
      const state = interaction.options.getString('state') === 'on';
      store.setConfig(guild.id, 'leveling', state);

      await interaction.reply({
        embeds: [response({ client: interaction.client, description: `Leveling **${state ? 'enabled' : 'disabled'}**`, color: state ? colors.success : colors.muted })],
      });
    } else if (sub === 'channel') {
      const channel = interaction.options.getChannel('channel');
      if (channel) {
        store.setConfig(guild.id, 'levelup_channel', channel.id);
        await interaction.reply({
          embeds: [response({ client: interaction.client, description: `Level-up messages will be sent to ${channel}`, color: colors.success })],
        });
      } else {
        store.setConfig(guild.id, 'levelup_channel', null);
        await interaction.reply({
          embeds: [response({ client: interaction.client, description: 'Level-up messages will be sent in the same channel', color: colors.info })],
        });
      }
    } else {
      const enabled = store.getConfig(guild.id, 'leveling') ?? true;
      const chId = store.getConfig(guild.id, 'levelup_channel');

      await interaction.reply({
        embeds: [response({
          client: interaction.client,
          description: `**Leveling** ${enabled ? 'Enabled' : 'Disabled'}\n**Level-up channel** ${chId ? `<#${chId}>` : 'Same channel'}`,
          color: colors.info,
        })],
      });
    }
  },
};
