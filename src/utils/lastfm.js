const config = require('../config');

const BASE = 'https://ws.audioscrobbler.com/2.0/';

async function call(method, params = {}) {
  if (!config.lastfm.apiKey) return null;

  const url = new URL(BASE);
  url.searchParams.set('method', method);
  url.searchParams.set('api_key', config.lastfm.apiKey);
  url.searchParams.set('format', 'json');
  for (const [k, v] of Object.entries(params)) {
    if (v != null) url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString());
  if (!res.ok) return null;
  const data = await res.json();
  if (data.error) return null;
  return data;
}

module.exports = {
  async getNowPlaying(username) {
    const data = await call('user.getrecenttracks', { user: username, limit: 1 });
    if (!data?.recenttracks?.track?.length) return null;
    const track = data.recenttracks.track[0];
    return {
      name: track.name,
      artist: track.artist?.['#text'] || 'Unknown',
      album: track.album?.['#text'] || '',
      image: track.image?.find((i) => i.size === 'extralarge')?.['#text'] || null,
      nowPlaying: track['@attr']?.nowplaying === 'true',
      url: track.url,
    };
  },

  async getTopArtists(username, period = '7day', limit = 10) {
    const data = await call('user.gettopartists', { user: username, period, limit });
    if (!data?.topartists?.artist) return [];
    return data.topartists.artist.map((a) => ({ name: a.name, playcount: a.playcount, url: a.url }));
  },

  async getTopAlbums(username, period = '7day', limit = 10) {
    const data = await call('user.gettopalbums', { user: username, period, limit });
    if (!data?.topalbums?.album) return [];
    return data.topalbums.album.map((a) => ({
      name: a.name,
      artist: a.artist.name,
      playcount: a.playcount,
      image: a.image?.find((i) => i.size === 'extralarge')?.['#text'] || null,
    }));
  },

  async getTopTracks(username, period = '7day', limit = 10) {
    const data = await call('user.gettoptracks', { user: username, period, limit });
    if (!data?.toptracks?.track) return [];
    return data.toptracks.track.map((t) => ({
      name: t.name,
      artist: t.artist.name,
      playcount: t.playcount,
      url: t.url,
    }));
  },

  async getProfile(username) {
    const data = await call('user.getinfo', { user: username });
    if (!data?.user) return null;
    const u = data.user;
    return {
      name: u.name,
      realname: u.realname,
      playcount: u.playcount,
      registered: u.registered?.unixtime,
      url: u.url,
      image: u.image?.find((i) => i.size === 'extralarge')?.['#text'] || null,
      country: u.country,
    };
  },

  async getRecentTracks(username, limit = 10) {
    const data = await call('user.getrecenttracks', { user: username, limit });
    if (!data?.recenttracks?.track) return [];
    return data.recenttracks.track.map((t) => ({
      name: t.name,
      artist: t.artist?.['#text'] || 'Unknown',
      album: t.album?.['#text'] || '',
      nowPlaying: t['@attr']?.nowplaying === 'true',
      url: t.url,
    }));
  },
};
