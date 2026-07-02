const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leveling')
    .setDescription('Configure the XP leveling system')
    .addSubcommand((sub) =>
      sub.setName('toggle').setDescription('Turn XP gain on or off for this server')
        .addStringOption((o) => o.setName('state').setDescription('Enable or disable the leveling system').setRequired(true).addChoices(
          { name: 'On', value: 'on' },
          { name: 'Off', value: 'off' },
        ))
    )
    .addSubcommand((sub) =>
      sub.setName('channel').setDescription('Set where level-up announcements go')
        .addChannelOption((o) => o.setName('channel').setDescription('Channel for announcements (empty = same channel as message)').addChannelTypes(ChannelType.GuildText))
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
