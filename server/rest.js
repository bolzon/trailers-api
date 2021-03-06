const _ = require('lodash');
const axios = require('axios');
const { getCache, setCache } = require('./cache');

const API_KEY = _.get(process.env, 'TMDB_API_KEY', 'null');
const TMDB_VIDEO_URL = `https://api.themoviedb.org/3/movie/{MOVIE_ID}/videos?language=en-US&api_key=${API_KEY}`;
const TMDB_IMDB_URL = `https://api.themoviedb.org/3/find/{IMDB_ID}?language=en-US&external_source=imdb_id&api_key=${API_KEY}`;

async function getJsonContent(url) {
  try {
    const res = await axios({ url, method: 'get', responseType: 'json' });
    return res.data;
  } catch (ex) {
    const statusCode = parseInt(_.get(ex, 'response.status'));
    if (statusCode) {
      if (statusCode === 400) {
        // if not found returns null
        return null;
      }
      // inject response status into exception object
      ex.statusCode = statusCode;
    }
    throw ex;
  }
}

async function getImdbId(viaplayMovieUrl) {
  const viaplay = await getJsonContent(viaplayMovieUrl);
  return _.get(viaplay, '_embedded["viaplay:blocks"][0]._embedded["viaplay:product"].content.imdb.id');
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
  const results = _.filter(movieVideo.results, r => /^trailer$/i.test(r.type) && /(youtube|vimeo)/i.test(r.site));
  return _.map(results, r => /vimeo/i.test(r.site)
    ? `https://vimeo.com/${r.key}`
    : `https://youtu.be/${r.key}`);
}

async function getTrailerUrls(viaplayMovieUrl) {
  let tmdbTrailers = await getCache(viaplayMovieUrl);
  if (!tmdbTrailers) {
    const imdbId = await getImdbId(viaplayMovieUrl);
    if (imdbId) {
      const tmdbId = await getTmdbId(imdbId);
      if (tmdbId) {
        tmdbTrailers = await getTmdbTrailers(tmdbId);
        await setCache(viaplayMovieUrl, tmdbTrailers);
      }
    } else {
      await setCache(viaplayMovieUrl, []);
    }
  }
  return tmdbTrailers || [];
}

module.exports = { getTrailerUrls };
