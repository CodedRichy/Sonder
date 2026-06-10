const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');
const store = require('../../database/store');

const ZONES = [
  { name: 'US Eastern (ET)', value: 'America/New_York' },
  { name: 'US Central (CT)', value: 'America/Chicago' },
  { name: 'US Mountain (MT)', value: 'America/Denver' },
  { name: 'US Pacific (PT)', value: 'America/Los_Angeles' },
  { name: 'UK (GMT/BST)', value: 'Europe/London' },
  { name: 'Central Europe (CET)', value: 'Europe/Berlin' },
  { name: 'India (IST)', value: 'Asia/Kolkata' },
  { name: 'Japan (JST)', value: 'Asia/Tokyo' },
  { name: 'Australia Eastern (AEST)', value: 'Australia/Sydney' },
  { name: 'Brazil (BRT)', value: 'America/Sao_Paulo' },
  { name: 'Dubai (GST)', value: 'Asia/Dubai' },
  { name: 'Singapore (SGT)', value: 'Asia/Singapore' },
];

function getTimeInZone(zone) {
  try {
    return new Date().toLocaleTimeString('en-US', { timeZone: zone, hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return null;
  }
}

function getHourInZone(zone) {
  try {
    return parseInt(new Date().toLocaleString('en-US', { timeZone: zone, hour: 'numeric', hour12: false }));
  } catch {
    return null;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timezone')
    .setDescription('Timezone tools')
    .addSubcommand((s) =>
      s.setName('set')
        .setDescription('Set your timezone')
        .addStringOption((o) =>
          o.setName('zone').setDescription('Your timezone').setRequired(true)
            .addChoices(...ZONES)
        )
    )
    .addSubcommand((s) =>
      s.setName('check')
        .setDescription("See someone's current time")
        .addUserOption((o) => o.setName('user').setDescription('User to check').setRequired(true))
    )
    .addSubcommand((s) =>
      s.setName('overlap')
        .setDescription('Find overlapping hours between two users')
        .addUserOption((o) => o.setName('user1').setDescription('First user').setRequired(true))
        .addUserOption((o) => o.setName('user2').setDescription('Second user').setRequired(true))
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (sub === 'set') {
      const zone = interaction.options.getString('zone');
      store.setConfig(guildId, `tz_${interaction.user.id}`, zone);
      const time = getTimeInZone(zone);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `Timezone set. Your current time: **${time}**`, color: colors.success })] });
    }

    if (sub === 'check') {
      const target = interaction.options.getUser('user');
      const zone = store.getConfig(guildId, `tz_${target.id}`);
      if (!zone) {
        return interaction.reply({ embeds: [response({ client: interaction.client, description: `${target} hasn't set a timezone.`, color: colors.muted })], ephemeral: true });
      }
      const time = getTimeInZone(zone);
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `${target}'s time: **${time}** (${zone})`, color: colors.primary })] });
    }

    if (sub === 'overlap') {
      const user1 = interaction.options.getUser('user1');
      const user2 = interaction.options.getUser('user2');
      const zone1 = store.getConfig(guildId, `tz_${user1.id}`);
      const zone2 = store.getConfig(guildId, `tz_${user2.id}`);

      if (!zone1 || !zone2) {
        const missing = !zone1 ? user1 : user2;
        return interaction.reply({ embeds: [response({ client: interaction.client, description: `${missing} hasn't set a timezone.`, color: colors.error })], ephemeral: true });
      }

      const hour1 = getHourInZone(zone1);
      const hour2 = getHourInZone(zone2);
      const offset = hour2 - hour1;

      // Find overlapping awake hours (8am-midnight = 8-24)
      const awake1 = new Set();
      const awake2 = new Set();
      for (let h = 8; h < 24; h++) awake1.add(h);
      for (let h = 8; h < 24; h++) awake2.add((h + offset + 24) % 24);

      const overlap = [...awake1].filter((h) => awake2.has(h)).sort((a, b) => a - b);

      const bar = Array(24).fill('░');
      for (const h of awake1) bar[h] = '▒';
      for (const h of overlap) bar[h] = '█';

      const desc = [
        `**${user1.tag}** ${getTimeInZone(zone1)} (${zone1})`,
        `**${user2.tag}** ${getTimeInZone(zone2)} (${zone2})`,
        `**Offset** ${offset >= 0 ? '+' : ''}${offset}h`,
        '',
        `\`${bar.join('')}\``,
        `\`0         1         2   \``,
        `\`0    5    0    5    0  3\``,
        '',
        overlap.length
          ? `**${overlap.length}h overlap** (${overlap[0]}:00–${overlap[overlap.length - 1] + 1}:00 for ${user1.tag})`
          : '**No overlap** during waking hours',
      ].join('\n');

      return interaction.reply({ embeds: [response({ client: interaction.client, description: desc, color: overlap.length ? colors.success : colors.error })] });
    }
  },
};
