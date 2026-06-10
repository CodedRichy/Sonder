const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base, response } = require('../../utils/embed');
const store = require('../../database/store');

function toggle(val) {
  return val ? '`✓`' : '`✗`';
}

function channelOrNone(id) {
  return id ? `<#${id}>` : 'Not set';
}

function buildOverviewEmbed(interaction) {
  const g = interaction.guild.id;
  const client = interaction.client;

  const antispam = store.getConfig(g, 'antispam');
  const antilink = store.getConfig(g, 'antilink');
  const antiraid = store.getConfig(g, 'antiraid');
  const aiMod = store.getConfig(g, 'ai_automod');
  const wordFilter = store.getConfig(g, 'word_filter') || [];

  const logChannel = store.getConfig(g, 'log_channel');
  const modlogChannel = store.getConfig(g, 'modlog_channel');

  const welcomeChannel = store.getConfig(g, 'welcome_channel');
  const goodbyeChannel = store.getConfig(g, 'goodbye_channel');

  const autoroles = store.getConfig(g, 'autoroles') || [];

  const leveling = store.getConfig(g, 'leveling') ?? true;
  const starboardChannel = store.getConfig(g, 'starboard_channel');
  const ticketEnabled = store.getConfig(g, 'ticket_enabled');
  const counterChannel = store.getConfig(g, 'counter_channel');

  const prefix = store.getConfig(g, 'prefix') || ';';

  const lines = [
    `\u{1F6E1}️ **Protection**`,
    `Antispam ${toggle(antispam)} · Antilink ${toggle(antilink)} · Antiraid ${toggle(antiraid)} · AI Mod ${toggle(aiMod)} · Word Filter ${toggle(wordFilter.length > 0)}`,
    '',
    `\u{1F4CB} **Logging**`,
    `Log Channel: ${channelOrNone(logChannel)}`,
    `Modlog: ${channelOrNone(modlogChannel)}`,
    '',
    `\u{1F44B} **Welcome & Goodbye**`,
    `Welcome: ${welcomeChannel ? `<#${welcomeChannel}>` : 'Disabled'}`,
    `Goodbye: ${goodbyeChannel ? `<#${goodbyeChannel}>` : 'Disabled'}`,
    '',
    `\u{1F3AD} **Roles**`,
    `Autoroles: ${autoroles.length ? autoroles.map((id) => `<@&${id}>`).join(', ') : 'None'}`,
    '',
    `\u{1F3AB} **Features**`,
    `Leveling ${toggle(leveling)} · Starboard ${toggle(starboardChannel)} · Tickets ${toggle(ticketEnabled)} · Counter ${toggle(counterChannel)}`,
    '',
    `⚙️ **General**`,
    `Prefix: \`${prefix}\``,
  ];

  return base(client, colors.primary)
    .setAuthor({ name: `${interaction.guild.name} — Server Settings`, iconURL: interaction.guild.iconURL() })
    .setDescription(lines.join('\n'));
}

function buildProtectionEmbed(interaction) {
  const g = interaction.guild.id;

  const antispam = store.getConfig(g, 'antispam');
  const antilink = store.getConfig(g, 'antilink');
  const antilinkWhitelist = store.getConfig(g, 'antilink_whitelist') || [];
  const antiraid = store.getConfig(g, 'antiraid');
  const antiraidThreshold = store.getConfig(g, 'antiraid_threshold') || 5;
  const antiraidAction = store.getConfig(g, 'antiraid_action') || 'kick';
  const aiMod = store.getConfig(g, 'ai_automod');
  const wordFilter = store.getConfig(g, 'word_filter') || [];
  const antinuke = store.getConfig(g, 'antinuke');

  const lines = [
    `**Antispam** ${toggle(antispam)}`,
    '',
    `**Antilink** ${toggle(antilink)}`,
    `Whitelisted domains: ${antilinkWhitelist.length ? antilinkWhitelist.map((d) => `\`${d}\``).join(', ') : 'None'}`,
    '',
    `**Antiraid** ${toggle(antiraid)}`,
    `Threshold: ${antiraidThreshold} joins / 10s`,
    `Action: ${antiraidAction}`,
    '',
    `**AI Mod** ${toggle(aiMod)}`,
    '',
    `**Word Filter** ${toggle(wordFilter.length > 0)}`,
    `${wordFilter.length} word${wordFilter.length === 1 ? '' : 's'} blocked`,
    '',
    `**Antinuke** ${toggle(antinuke)}`,
  ];

  return base(interaction.client, colors.primary)
    .setAuthor({ name: 'Protection Settings', iconURL: interaction.guild.iconURL() })
    .setDescription(lines.join('\n'));
}

function buildLoggingEmbed(interaction) {
  const g = interaction.guild.id;

  const logChannel = store.getConfig(g, 'log_channel');
  const modlogChannel = store.getConfig(g, 'modlog_channel');

  const types = [
    ['log_message_delete', 'Message deletes'],
    ['log_message_edit', 'Message edits'],
    ['log_member_join', 'Member joins'],
    ['log_member_leave', 'Member leaves'],
    ['log_role_change', 'Role changes'],
    ['log_voice', 'Voice state'],
    ['log_nickname', 'Nickname changes'],
  ];

  const typeLines = types.map(([key, label]) => {
    const enabled = store.getConfig(g, key) ?? true;
    return `${toggle(enabled)} ${label}`;
  });

  const lines = [
    `**Log Channel** ${channelOrNone(logChannel)}`,
    `**Modlog Channel** ${channelOrNone(modlogChannel)}`,
    '',
    ...typeLines,
  ];

  return base(interaction.client, colors.primary)
    .setAuthor({ name: 'Logging Settings', iconURL: interaction.guild.iconURL() })
    .setDescription(lines.join('\n'));
}

function buildWelcomeGoodbyeEmbed(interaction) {
  const g = interaction.guild.id;

  const welcomeChannel = store.getConfig(g, 'welcome_channel');
  const welcomeMessage = store.getConfig(g, 'welcome_message') || 'Not set';
  const goodbyeChannel = store.getConfig(g, 'goodbye_channel');
  const goodbyeMessage = store.getConfig(g, 'goodbye_message') || 'Not set';

  const lines = [
    `**Welcome Channel** ${channelOrNone(welcomeChannel)}`,
    `**Welcome Message** ${welcomeMessage}`,
    '',
    `**Goodbye Channel** ${channelOrNone(goodbyeChannel)}`,
    `**Goodbye Message** ${goodbyeMessage}`,
  ];

  return base(interaction.client, colors.primary)
    .setAuthor({ name: 'Welcome & Goodbye Settings', iconURL: interaction.guild.iconURL() })
    .setDescription(lines.join('\n'));
}

function buildRolesEmbed(interaction) {
  const g = interaction.guild.id;

  const autoroles = store.getConfig(g, 'autoroles') || [];

  const lines = [
    `**Autoroles** ${autoroles.length ? '' : 'None configured'}`,
  ];

  if (autoroles.length) {
    autoroles.forEach((id) => {
      lines.push(`▸ <@&${id}>`);
    });
  }

  return base(interaction.client, colors.primary)
    .setAuthor({ name: 'Role Settings', iconURL: interaction.guild.iconURL() })
    .setDescription(lines.join('\n'));
}

function buildFeaturesEmbed(interaction) {
  const g = interaction.guild.id;

  const leveling = store.getConfig(g, 'leveling') ?? true;
  const levelupChannel = store.getConfig(g, 'levelup_channel');
  const starboardChannel = store.getConfig(g, 'starboard_channel');
  const starboardThreshold = store.getConfig(g, 'starboard_threshold') || 3;
  const starboardEmoji = store.getConfig(g, 'starboard_emoji') || '⭐';
  const ticketEnabled = store.getConfig(g, 'ticket_enabled');
  const ticketSupportRole = store.getConfig(g, 'ticket_support_role');
  const counterChannel = store.getConfig(g, 'counter_channel');

  const lines = [
    `**Leveling** ${toggle(leveling)}`,
    `Level-up channel: ${channelOrNone(levelupChannel)}`,
    '',
    `**Starboard** ${toggle(starboardChannel)}`,
    `Channel: ${channelOrNone(starboardChannel)}`,
    `Emoji: ${starboardEmoji} · Threshold: ${starboardThreshold}`,
    '',
    `**Tickets** ${toggle(ticketEnabled)}`,
    `Support role: ${ticketSupportRole ? `<@&${ticketSupportRole}>` : 'Not set'}`,
    '',
    `**Counter** ${toggle(counterChannel)}`,
    `Channel: ${channelOrNone(counterChannel)}`,
  ];

  return base(interaction.client, colors.primary)
    .setAuthor({ name: 'Feature Settings', iconURL: interaction.guild.iconURL() })
    .setDescription(lines.join('\n'));
}

function buildGeneralEmbed(interaction) {
  const g = interaction.guild.id;

  const prefix = store.getConfig(g, 'prefix') || ';';
  const nightwatch = store.getConfig(g, 'nightwatch');

  const lines = [
    `**Prefix** \`${prefix}\``,
    '',
    `**Night Watch** ${toggle(nightwatch?.enabled)}`,
  ];

  if (nightwatch?.enabled) {
    lines.push(`Hours: ${nightwatch.start}:00 → ${nightwatch.end}:00`);
    lines.push(`Alerts: <#${nightwatch.alertChannel}>`);
  }

  return base(interaction.client, colors.primary)
    .setAuthor({ name: 'General Settings', iconURL: interaction.guild.iconURL() })
    .setDescription(lines.join('\n'));
}

function buildSelectMenu(isDetail) {
  const options = [
    { label: 'Protection', value: 'protection', emoji: '\u{1F6E1}️' },
    { label: 'Logging', value: 'logging', emoji: '\u{1F4CB}' },
    { label: 'Welcome & Goodbye', value: 'welcome_goodbye', emoji: '\u{1F44B}' },
    { label: 'Roles', value: 'roles', emoji: '\u{1F3AD}' },
    { label: 'Features', value: 'features', emoji: '\u{1F3AB}' },
    { label: 'General', value: 'general', emoji: '⚙️' },
  ];

  if (isDetail) {
    options.unshift({ label: 'Back to Overview', value: 'overview', emoji: '◀' });
  }

  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('settings_category')
      .setPlaceholder('Select a category')
      .addOptions(options),
  );
}

function getEmbed(interaction, category) {
  switch (category) {
    case 'protection': return buildProtectionEmbed(interaction);
    case 'logging': return buildLoggingEmbed(interaction);
    case 'welcome_goodbye': return buildWelcomeGoodbyeEmbed(interaction);
    case 'roles': return buildRolesEmbed(interaction);
    case 'features': return buildFeaturesEmbed(interaction);
    case 'general': return buildGeneralEmbed(interaction);
    default: return buildOverviewEmbed(interaction);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('View all server configuration')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const msg = await interaction.reply({
      embeds: [buildOverviewEmbed(interaction)],
      components: [buildSelectMenu(false)],
      fetchReply: true,
    });

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: (i) => i.user.id === interaction.user.id,
      time: 120_000,
    });

    collector.on('collect', async (i) => {
      const category = i.values[0];
      const isOverview = category === 'overview';

      await i.update({
        embeds: [getEmbed(interaction, category)],
        components: [buildSelectMenu(!isOverview)],
      });
    });

    collector.on('end', () => {
      msg.edit({ components: [] }).catch(() => {});
    });
  },
};
