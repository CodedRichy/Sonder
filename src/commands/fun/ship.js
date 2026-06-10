const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ship')
    .setDescription('Ship two users together')
    .addUserOption((o) => o.setName('user1').setDescription('First user').setRequired(true))
    .addUserOption((o) => o.setName('user2').setDescription('Second user')),

  async execute(interaction) {
    const user1 = interaction.options.getUser('user1');
    const user2 = interaction.options.getUser('user2') || interaction.user;

    const hash = (BigInt(user1.id) + BigInt(user2.id)) % 101n;
    const percent = Number(hash);

    let bar = '';
    const filled = Math.round(percent / 10);
    bar = '█'.repeat(filled) + '░'.repeat(10 - filled);

    let emoji, comment;
    if (percent >= 80) { emoji = '💖'; comment = 'Soulmates!'; }
    else if (percent >= 60) { emoji = '❤️'; comment = 'Great match!'; }
    else if (percent >= 40) { emoji = '💛'; comment = 'Could work.'; }
    else if (percent >= 20) { emoji = '💔'; comment = 'Not looking good...'; }
    else { emoji = '🖤'; comment = 'Absolutely not.'; }

    await interaction.reply({
      embeds: [response({
        client: interaction.client,
        description: `${emoji} **${user1.username}** x **${user2.username}**\n\n\`${bar}\` **${percent}%**\n${comment}`,
        color: colors.primary,
      })],
    });
  },
};
