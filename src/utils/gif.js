const log = require('./logger');

const API_BASE = 'https://nekos.best/api/v2';

const TYPE_MAP = {
  bite: 'bite',
  bonk: 'punch',
  hug: 'hug',
  kiss: 'kiss',
  pat: 'pat',
  slap: 'slap',
  cuddle: 'cuddle',
  poke: 'poke',
  tickle: 'tickle',
  wave: 'wave',
  wink: 'wink',
  cry: 'cry',
  dance: 'dance',
  blush: 'blush',
  laugh: 'laugh',
  yeet: 'yeet',
  feed: 'feed',
  highfive: 'highfive',
  handhold: 'handhold',
  kick: 'kick',
  smile: 'smile',
  stare: 'stare',
  think: 'think',
  thumbsup: 'thumbsup',
  pout: 'pout',
  nom: 'nom',
  baka: 'baka',
  shoot: 'shoot',
  smug: 'smug',
  nod: 'nod',
  nope: 'nope',
  sleep: 'sleep',
  shrug: 'shrug',
  facepalm: 'facepalm',
  happy: 'happy',
  peck: 'peck',
};

const FALLBACKS = {
  bite: [
    'https://media.tenor.com/ZM4fJkG_mWgAAAAC/anime-bite.gif',
    'https://media.tenor.com/SdIGVGwH_bMAAAAC/anime-bite.gif',
    'https://media.tenor.com/skMwvOgifWsAAAAC/bite-anime.gif',
  ],
  bonk: [
    'https://media.tenor.com/fBfRVJwDmBEAAAAC/bonk-meme.gif',
    'https://media.tenor.com/zRqkbXS_wOYAAAAC/bonk-anime.gif',
    'https://media.tenor.com/Dbcm5YIiLPMAAAAC/bonk-mega.gif',
  ],
  hug: [
    'https://media.tenor.com/9e1pGTcMnUMAAAAC/anime-hug.gif',
    'https://media.tenor.com/FeGqyWs0UrIAAAAC/anime-hug.gif',
    'https://media.tenor.com/S2PoTPx-KIEAAAAC/hug-anime.gif',
  ],
  kiss: [
    'https://media.tenor.com/YTHhxeOPAQsAAAAC/anime-kiss.gif',
    'https://media.tenor.com/KVwdbSQEU4QAAAAC/anime-kiss.gif',
    'https://media.tenor.com/X8ztpV1MoGcAAAAC/anime-kiss.gif',
  ],
  pat: [
    'https://media.tenor.com/N41zMEJRO_YAAAAC/pat-anime.gif',
    'https://media.tenor.com/CiSaRTbuReUAAAAC/head-pat.gif',
    'https://media.tenor.com/3dbfVBPeYEkAAAAC/anime-pat.gif',
  ],
  slap: [
    'https://media.tenor.com/Ws6Dm1ZR4JsAAAAC/anime-slap.gif',
    'https://media.tenor.com/mHsIHcLMEHEAAAAC/slap-anime.gif',
    'https://media.tenor.com/5Bbc-dspMcYAAAAC/girl-slap.gif',
  ],
};

function pickFallback(type) {
  const gifs = FALLBACKS[type];
  if (!gifs?.length) return null;
  return gifs[Math.floor(Math.random() * gifs.length)];
}

async function fetchGif(type) {
  const endpoint = TYPE_MAP[type] || type;
  try {
    const res = await fetch(`${API_BASE}/${endpoint}`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    return data.results?.[0]?.url || pickFallback(type);
  } catch (err) {
    log.debug(`GIF API fallback for ${type}: ${err.message}`);
    return pickFallback(type);
  }
}

module.exports = { fetchGif, TYPE_MAP };
