const { SlashCommandBuilder, GuildPremiumTier } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base } = require('../../utils/embed');

const TIER_PERKS = {
  [GuildPremiumTier.None]: {
    label: 'No Level', emoji: 50, stickers: 5, bitrate: 96,
    upload: 25, stream: '720p 30fps', banner: false, splash: false, vanity: false,
  },
  [GuildPremiumTier.Tier1]: {
    label: 'Level 1 (2 boosts)', emoji: 100, stickers: 15, bitrate: 128,
    upload: 25, stream: '720p 60fps', banner: false, splash: false, vanity: false,
  },
  [GuildPremiumTier.Tier2]: {
    label: 'Level 2 (7 boosts)', emoji: 150, stickers: 30, bitrate: 256,
    upload: 50, stream: '1080p 60fps', banner: true, splash: true, vanity: false,
  },
  [GuildPremiumTier.Tier3]: {
    label: 'Level 3 (14 boosts)', emoji: 250, stickers: 60, bitrate: 384,
    upload: 100, stream: '1080p 60fps', banner: true, splash: true, vanity: true,
  },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('boostimpact')
    .setDescription('See what server boosts have unlocked'),

  async execute(interaction) {
    const { guild } = interaction;
    const tier = guild.premiumTier;
    const boosts = guild.premiumSubscriptionCount || 0;
    const perks = TIER_PERKS[tier];

    const emojiUsed = guild.emojis.cache.size;
    const stickerUsed = guild.stickers.cache.size;

    const nextTier = tier < GuildPremiumTier.Tier3 ? TIER_PERKS[tier + 1] : null;
    const boostsNeeded = [0, 2, 7, 14];
    const toNext = nextTier ? boostsNeeded[tier + 1] - boosts : 0;

    const sections = [
      `**${boosts}** boosts · **${perks.label}**\n`,
      `**Emoji Slots** ${emojiUsed}/${perks.emoji}`,
      `**Sticker Slots** ${stickerUsed}/${perks.stickers}`,
      `**Audio Quality** ${perks.bitrate} kbps`,
      `**Upload Limit** ${perks.upload} MB`,
      `**Stream Quality** ${perks.stream}`,
      `**Server Banner** ${perks.banner ? '✅' : '❌'}`,
      `**Invite Splash** ${perks.splash ? '✅' : '❌'}`,
      `**Vanity URL** ${perks.vanity ? '✅' : '❌'}`,
    ];

    if (nextTier) {
      sections.push(`\n**Next Level** ${toNext} more boost${toNext !== 1 ? 's' : ''} needed`);
      const unlocks = [];
      if (nextTier.emoji > perks.emoji) unlocks.push(`+${nextTier.emoji - perks.emoji} emoji slots`);
      if (nextTier.stickers > perks.stickers) unlocks.push(`+${nextTier.stickers - perks.stickers} sticker slots`);
      if (nextTier.bitrate > perks.bitrate) unlocks.push(`${nextTier.bitrate} kbps audio`);
      if (nextTier.upload > perks.upload) unlocks.push(`${nextTier.upload} MB uploads`);
      if (nextTier.banner && !perks.banner) unlocks.push('Server banner');
      if (nextTier.splash && !perks.splash) unlocks.push('Invite splash');
      if (nextTier.vanity && !perks.vanity) unlocks.push('Vanity URL');
      if (unlocks.length) sections.push('Unlocks: ' + unlocks.join(', '));
    }

    const boosters = guild.members.cache.filter((m) => m.premiumSince);
    if (boosters.size) {
      const list = boosters.map((m) => `${m}`).slice(0, 10).join(', ');
      const more = boosters.size > 10 ? ` +${boosters.size - 10} more` : '';
      sections.push(`\n**Boosters** (${boosters.size})\n${list}${more}`);
    }

    const embed = base(interaction.client, colors.primary)
      .setAuthor({ name: `Boost Impact — ${guild.name}`, iconURL: guild.iconURL() })
      .setDescription(sections.join('\n'));

    await interaction.reply({ embeds: [embed] });
  },
};
