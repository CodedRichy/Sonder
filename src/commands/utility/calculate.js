const { SlashCommandBuilder } = require('discord.js');
const { colors } = require('../../utils/constants');
const { response } = require('../../utils/embed');

function tokenize(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    if (/\s/.test(expr[i])) { i++; continue; }
    if (/\d/.test(expr[i]) || (expr[i] === '.' && i + 1 < expr.length && /\d/.test(expr[i + 1]))) {
      let num = '';
      while (i < expr.length && (/\d/.test(expr[i]) || expr[i] === '.')) num += expr[i++];
      tokens.push({ type: 'num', value: parseFloat(num) });
    } else if ('+-*/%^()'.includes(expr[i])) {
      tokens.push({ type: 'op', value: expr[i++] });
    } else {
      return null;
    }
  }
  return tokens;
}

function parse(tokens) {
  let pos = 0;
  function peek() { return pos < tokens.length ? tokens[pos] : null; }
  function consume() { return tokens[pos++]; }

  function expr() {
    let left = term();
    while (peek() && (peek().value === '+' || peek().value === '-')) {
      const op = consume().value;
      const right = term();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function term() {
    let left = power();
    while (peek() && (peek().value === '*' || peek().value === '/' || peek().value === '%')) {
      const op = consume().value;
      const right = power();
      if (op === '*') left *= right;
      else if (op === '/') { if (right === 0) throw new Error(); left /= right; }
      else left %= right;
    }
    return left;
  }

  function power() {
    let base = unary();
    if (peek() && peek().value === '^') {
      consume();
      base = Math.pow(base, power());
    }
    return base;
  }

  function unary() {
    if (peek() && peek().value === '-') { consume(); return -unary(); }
    if (peek() && peek().value === '+') { consume(); return unary(); }
    return atom();
  }

  function atom() {
    const t = peek();
    if (!t) throw new Error();
    if (t.type === 'num') { consume(); return t.value; }
    if (t.value === '(') {
      consume();
      const val = expr();
      if (!peek() || peek().value !== ')') throw new Error();
      consume();
      return val;
    }
    throw new Error();
  }

  const result = expr();
  if (pos !== tokens.length) throw new Error();
  return result;
}

function safeEval(expr) {
  try {
    const tokens = tokenize(expr);
    if (!tokens || tokens.length === 0) return null;
    const result = parse(tokens);
    if (typeof result !== 'number' || !isFinite(result)) return null;
    return result;
  } catch {
    return null;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calculate')
    .setDescription('Evaluate a math expression')
    .addStringOption((o) => o.setName('expression').setDescription('Math expression (e.g. 2+2, 5*3, 100/4)').setRequired(true)),

  async execute(interaction) {
    const expr = interaction.options.getString('expression');
    const result = safeEval(expr);

    if (result === null) {
      return interaction.reply({ embeds: [response({ client: interaction.client, description: 'Invalid expression.', color: colors.error })], ephemeral: true });
    }

    await interaction.reply({
      embeds: [response({
        client: interaction.client,
        description: `\`${expr}\` = **${result.toLocaleString()}**`,
        color: colors.primary,
      })],
    });
  },
};
