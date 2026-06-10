const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000, w: 604800000 };

function parse(str) {
  const match = str.match(/^(\d+)\s*(s|m|h|d|w)$/i);
  if (!match) return null;
  return parseInt(match[1]) * multipliers[match[2].toLowerCase()];
}

function format(ms) {
  if (ms >= 86400000) return `${Math.floor(ms / 86400000)}d`;
  if (ms >= 3600000) return `${Math.floor(ms / 3600000)}h`;
  if (ms >= 60000) return `${Math.floor(ms / 60000)}m`;
  return `${Math.floor(ms / 1000)}s`;
}

module.exports = { parse, format };
