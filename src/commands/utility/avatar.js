const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('View a user\'s avatar')
    .addUserOption((o) => o.setName('user').setDescription('User to view')),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const globalAvatar = user.displayAvatarURL({ size: 1024 });
    const serverAvatar = member?.displayAvatarURL({ size: 1024 });

    const embed = base(interaction.client, colors.primary)
      .setAuthor({ name: user.tag })
      .setImage(globalAvatar);

    const links = [`[Global](${globalAvatar})`];
    if (serverAvatar && serverAvatar !== globalAvatar) {
      links.push(`[Server](${serverAvatar})`);
    }
    embed.setDescription(links.join(' · '));

    await interaction.reply({ embeds: [embed] });
  },
};
