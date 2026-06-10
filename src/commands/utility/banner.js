const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base, response } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banner')
    .setDescription('View a user\'s banner')
    .addUserOption((o) => o.setName('user').setDescription('User to view')),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const fetched = await user.fetch().catch(() => null);
    if (!fetched) return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Failed to fetch user.', color: colors.error })], ephemeral: true });
    const bannerUrl = fetched.bannerURL({ size: 1024 });

    if (!bannerUrl) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: `${user.tag} has no banner.`, color: colors.muted })], ephemeral: true });
    }

    const embed = base(interaction.client, fetched.accentColor || colors.primary)
      .setAuthor({ name: user.tag })
      .setImage(bannerUrl);

    await interaction.reply({ embeds: [embed] });
  },
};
