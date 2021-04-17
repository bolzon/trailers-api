const _ = require('lodash');
const axios = require('axios');
const { getCache, setCache } = require('./cache');

const API_KEY = _.get(process.env, 'TMDB_API_KEY', 'null');
const TMDB_VIDEO_URL = `https://api.themoviedb.org/3/movie/{MOVIE_ID}/videos?api_key=${API_KEY}&language=en-US`;
const TMDB_IMDB_URL = `https://api.themoviedb.org/3/find/{IMDB_ID}?api_key=${API_KEY}&language=en-US&external_source=imdb_id`;

async function getJsonContent(url) {
  try {
    const res = await axios({
      url,
      method: 'get',
      responseType: 'json'
    });
    if (res.status != 200) {
      throw new Error(`Status: ${res.status}`);
    }
    return res.data;
  } catch (ex) {
    console.error(ex);
    throw ex;
  }
}

async function getImdbId(viaplayMovieUrl) {
  const viaplay = await getJsonContent(viaplayMovieUrl);
  const imdbId = _.get(viaplay, '_embedded["viaplay:blocks"][0]._embedded["viaplay:product"].content.imdb.id');
  return imdbId;
}

async function getTmdbId(imdbId) {
  const tmdbImdbUrl = TMDB_IMDB_URL.replace('{IMDB_ID}', imdbId);
  let tmdbId = await getCache(tmdbImdbUrl);
  if (!tmdbId) {
    const movieImdb = await getJsonContent(tmdbImdbUrl);
    tmdbId = _.get(movieImdb, 'movie_results[0].id');
    await setCache(tmdbImdbUrl, tmdbId);
  }
  return tmdbId;
}

async function getTmdbTrailers(tmdbId) {
  const tmdbVideoUrl = TMDB_VIDEO_URL.replace('{MOVIE_ID}', tmdbId);
  const movieVideo = await getJsonContent(tmdbVideoUrl);
  let results = _.filter(movieVideo.results, r => /^trailer$/i.test(r.type) && /youtube/i.test(r.site));
  if (results.length == 0) {
    results = movieVideo.results;
  }
  const trailers = _.map(results, t => `https://youtu.be/${t.key}`);
  return trailers;
}

async function getTrailerUrls(viaplayMovieUrl) {
  let tmdbTrailers = await getCache(viaplayMovieUrl);
  if (!tmdbTrailers) {
    const imdbId = await getImdbId(viaplayMovieUrl);
    const tmdbId = await getTmdbId(imdbId);
    tmdbTrailers = await getTmdbTrailers(tmdbId);
    await setCache(viaplayMovieUrl, tmdbTrailers);
  }
  return tmdbTrailers;
}

module.exports = { getTrailerUrls };
