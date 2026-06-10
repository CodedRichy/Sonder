const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, ChannelType } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base, response } = require('../../utils/embed');
const store = require('../../database/store');

const templates = {
  gaming: {
    label: 'Gaming',
    emoji: '🎮',
    description: 'Optimized for gaming communities',
    channels: ['sonder-logs', 'modlog'],
    config: { antispam: true, antilink: true, leveling: true },
    welcome: 'Welcome to {server}, {user}! 🎮 Check out the channels and have fun!',
  },
  community: {
    label: 'Community',
    emoji: '🏘️',
    description: 'Full-featured community server',
    channels: ['sonder-logs', 'modlog', 'starboard'],
    config: { antispam: true, antilink: true, antiraid: true, leveling: true, starboard_threshold: 3, starboard_emoji: '⭐' },
    welcome: 'Hey {user}, welcome to **{server}**! You\'re member #{membercount} 🎉',
    goodbye: '{user} left **{server}**. We\'ll miss you.',
  },
  study: {
    label: 'Study',
    emoji: '📚',
    description: 'Study groups and productivity',
    channels: ['sonder-logs'],
    config: { antispam: true, leveling: true },
    welcome: 'Welcome {user}! 📚 Stay focused and good luck with your studies.',
  },
  minimal: {
    label: 'Minimal',
    emoji: '🔒',
    description: 'Just the essentials',
    channels: ['sonder-logs'],
    config: { antispam: true },
  },
};

const channelKeyMap = {
  'sonder-logs': 'log_channel',
  'modlog': 'modlog_channel',
  'starboard': 'starboard_channel',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quicksetup')
    .setDescription('Set up your server with a pre-built template')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const { guild, client } = interaction;

    const menu = new StringSelectMenuBuilder()
      .setCustomId('quicksetup_template')
      .setPlaceholder('Choose a template')
      .addOptions(
        Object.entries(templates).map(([value, t]) => ({
          label: t.label,
          description: t.description,
          value,
          emoji: t.emoji,
        }))
      );

    const embed = base(client, colors.primary)
      .setAuthor({ name: 'Quick Setup', iconURL: client.user.displayAvatarURL() })
      .setDescription(
        'Choose a pre-built template to configure your server instantly.\n\n' +
        Object.values(templates).map((t) => `${t.emoji} **${t.label}** — ${t.description}`).join('\n')
      );

    const reply = await interaction.reply({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(menu)],
    });

    const collector = reply.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      time: 60_000,
      max: 1,
    });

    collector.on('collect', async (i) => {
      const key = i.values[0];
      const template = templates[key];
      if (!template) return;

      await i.deferUpdate();

      const created = {};
      const summary = [];

      for (const name of template.channels) {
        const existing = guild.channels.cache.find((c) => c.name === name && c.type === ChannelType.GuildText);
        if (existing) {
          created[name] = existing.id;
        } else {
          try {
            const ch = await guild.channels.create({
              name,
              type: ChannelType.GuildText,
              permissionOverwrites: [
                { id: guild.id, deny: ['ViewChannel'] },
                { id: client.user.id, allow: ['ViewChannel', 'SendMessages'] },
              ],
            });
            created[name] = ch.id;
          } catch {
            summary.push(`⚠️ Couldn't create #${name} — missing Manage Channels permission`);
            continue;
          }
        }
        const configKey = channelKeyMap[name];
        if (configKey && created[name]) {
          store.setConfig(guild.id, configKey, created[name]);
          summary.push(`✅ <#${created[name]}> set as \`${configKey.replace('_', ' ')}\``);
        }
      }

      for (const [configKey, value] of Object.entries(template.config)) {
        store.setConfig(guild.id, configKey, value);
        summary.push(`✅ \`${configKey}\` set to \`${value}\``);
      }

      if (template.welcome) {
        store.setConfig(guild.id, 'welcome_message', template.welcome);
        summary.push('✅ Welcome message configured');
      }

      if (template.goodbye) {
        store.setConfig(guild.id, 'goodbye_message', template.goodbye);
        summary.push('✅ Goodbye message configured');
      }

      const resultEmbed = base(client, colors.success)
        .setAuthor({ name: 'Quick Setup Complete', iconURL: client.user.displayAvatarURL() })
        .setDescription(summary.join('\n'));

      await i.editReply({ embeds: [resultEmbed], components: [] });
    });

    collector.on('end', (collected) => {
      if (!collected.size) {
        reply.edit({ components: [] }).catch(() => {});
      }
    });
  },
};
