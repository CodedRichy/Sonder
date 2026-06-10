const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('View information about a user')
    .addUserOption((o) => o.setName('user').setDescription('User to view')),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(() => null);

    const embed = base(interaction.client, member?.displayColor || colors.primary)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ size: 256 }) })
      .setThumbnail(user.displayAvatarURL({ size: 512 }))
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
      );

    if (member) {
      embed.addFields(
        { name: 'Joined', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: 'Roles', value: member.roles.cache.filter((r) => r.id !== interaction.guild.id).map((r) => r.toString()).slice(0, 15).join(' ') || 'None', inline: false },
      );

      if (member.premiumSinceTimestamp) {
        embed.addFields({ name: 'Boosting', value: `<t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>`, inline: true });
      }
    }

    const banner = await user.fetch().then((u) => u.bannerURL({ size: 512 })).catch(() => null);
    if (banner) embed.setImage(banner);

    await interaction.reply({ embeds: [embed] });
  },
};
