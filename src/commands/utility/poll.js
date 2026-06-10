const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { colors } = require('../../utils/constants');
const { base } = require('../../utils/embed');

const NUM_EMOJIS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a poll')
    .addStringOption((o) => o.setName('question').setDescription('Poll question').setRequired(true))
    .addStringOption((o) => o.setName('option1').setDescription('Option 1').setRequired(true))
    .addStringOption((o) => o.setName('option2').setDescription('Option 2').setRequired(true))
    .addStringOption((o) => o.setName('option3').setDescription('Option 3'))
    .addStringOption((o) => o.setName('option4').setDescription('Option 4'))
    .addStringOption((o) => o.setName('option5').setDescription('Option 5'))
    .addStringOption((o) => o.setName('option6').setDescription('Option 6')),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const options = [];

    for (let i = 1; i <= 6; i++) {
      const opt = interaction.options.getString(`option${i}`);
      if (opt) options.push(opt);
    }

    const desc = options.map((o, i) => `${NUM_EMOJIS[i]} ${o}`).join('\n\n');

    const embed = base(interaction.client, colors.primary)
      .setAuthor({ name: '📊 Poll', iconURL: interaction.user.displayAvatarURL() })
      .setDescription(`**${question}**\n\n${desc}`)
      .setFooter({ text: `Asked by ${interaction.user.tag}` });

    await interaction.reply({ embeds: [embed] });
    const msg = await interaction.fetchReply();

    for (let i = 0; i < options.length; i++) {
      await msg.react(NUM_EMOJIS[i]).catch(() => {});
    }
  },
};
