const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');

const CHOICES = ['rock', 'paper', 'scissors'];
const EMOJIS = { rock: '🪨', paper: '📄', scissors: '✂️' };
const WINS = { rock: 'scissors', paper: 'rock', scissors: 'paper' };

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play Rock Paper Scissors')
    .addStringOption((o) =>
      o.setName('choice').setDescription('Your choice').setRequired(true)
        .addChoices(
          { name: 'Rock', value: 'rock' },
          { name: 'Paper', value: 'paper' },
          { name: 'Scissors', value: 'scissors' },
        )
    ),

  async execute(interaction) {
    const player = interaction.options.getString('choice');
    const bot = CHOICES[Math.floor(Math.random() * 3)];

    let result, color;
    if (player === bot) {
      result = "It's a tie!";
      color = colors.warning;
    } else if (WINS[player] === bot) {
      result = 'You win!';
      color = colors.success;
    } else {
      result = 'You lose!';
      color = colors.error;
    }

    await interaction.reply({
      embeds: [response({
        client: interaction.client,
        description: `${EMOJIS[player]} vs ${EMOJIS[bot]}\n\n**${result}**`,
        color,
      })],
    });
  },
};
