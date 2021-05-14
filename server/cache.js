const _ = require('lodash');
const redis = require('redis');
const { sha } = require('./hash');

const EXPIRATION_TIME = _.get(process.env, 'REDIS_TTL', 5 * 60 * 60); // in seconds

const client = redis.createClient(process.env['REDIS_URL']);
client.on('error', console.error);

function getCache(url) {
  const key = sha(url);
  return new Promise(res => client.get(key, (err, data) => {
    if (err) return null;
    try {
      res(JSON.parse(data));
    } catch {
      res(data || null);
    }
  }));
}

function setCache(url, result) {
  const key = sha(url);
  result = result && typeof result === 'object' ? JSON.stringify(result) : result;
  return new Promise(res => client.set(key, result, 'EX', EXPIRATION_TIME, (err, data) => res(err ? null : data)));
}

module.exports = { getCache, setCache };
