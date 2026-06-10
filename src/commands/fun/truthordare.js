const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');

const TRUTHS = [
  "What's your most embarrassing memory?",
  "What's the biggest lie you've ever told?",
  "What's the last thing you searched on your phone?",
  "Have you ever pretended to like a gift you hated?",
  "What's your biggest fear?",
  "What's the worst thing you've ever said about someone?",
  "Have you ever cheated on a test?",
  "What's the most childish thing you still do?",
  "What's a secret you've never told anyone?",
  "What's the most embarrassing thing in your search history?",
  "Who was your first crush?",
  "What's the weirdest dream you've ever had?",
  "Have you ever blamed someone else for something you did?",
  "What's the longest you've gone without showering?",
  "What's the most trouble you've ever been in?",
];

const DARES = [
  "Send a message to your crush right now.",
  "Change your Discord status to something embarrassing for 1 hour.",
  "Send your last selfie in this chat.",
  "Let someone else send a message from your account.",
  "Talk in only caps for the next 10 minutes.",
  "Send a voice message singing your favorite song.",
  "Change your nickname to whatever the group decides.",
  "Send the 5th photo in your camera roll.",
  "Type with your eyes closed for the next 3 messages.",
  "Compliment everyone in this chat.",
  "Use only emojis for the next 5 minutes.",
  "Share your screen time report.",
  "Send your most used emoji 50 times.",
  "Let the person above you change your profile picture.",
  "Do 10 push-ups and send proof.",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('truthordare')
    .setDescription('Get a truth or dare')
    .addStringOption((o) =>
      o.setName('type').setDescription('Truth or dare?').setRequired(true)
        .addChoices(
          { name: 'Truth', value: 'truth' },
          { name: 'Dare', value: 'dare' },
          { name: 'Random', value: 'random' },
        )
    ),

  async execute(interaction) {
    let type = interaction.options.getString('type');
    if (type === 'random') type = Math.random() < 0.5 ? 'truth' : 'dare';

    const pool = type === 'truth' ? TRUTHS : DARES;
    const prompt = pool[Math.floor(Math.random() * pool.length)];

    await interaction.reply({
      embeds: [response({
        client: interaction.client,
        description: `**${type === 'truth' ? '❓ Truth' : '⚡ Dare'}**\n\n${prompt}`,
        color: type === 'truth' ? colors.info : colors.warning,
      })],
    });
  },
};
