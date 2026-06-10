const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base } = require('../../utils/embed');
const xpStore = require('../../database/xp');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('View your or another member\'s level and XP')
    .addUserOption((o) => o.setName('user').setDescription('Member to check')),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const stats = xpStore.getStats(interaction.guild.id, user.id);
    const rank = xpStore.getRank(interaction.guild.id, user.id);
    const progress = Math.floor((stats.xp / stats.needed) * 20);
    const bar = '▰'.repeat(progress) + '▱'.repeat(20 - progress);

    const embed = base(interaction.client, colors.primary)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .setDescription(
        `**Rank** #${rank}\n` +
        `**Level** ${stats.level}\n` +
        `**XP** ${stats.xp.toLocaleString()} / ${stats.needed.toLocaleString()}\n\n` +
        `${bar}`
      );

    await interaction.reply({ embeds: [embed] });
  },
};
