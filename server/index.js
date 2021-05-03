require('dotenv').config();

const _ = require('lodash');
const express = require('express');
const { getTrailerUrls } = require('./rest');
const { validateViaplayUrl } = require('./validation');

const INVALID_VIAPLAY_URL = 'Invalid viaplay URL';
const MISSING_VIAPLAY_URL = 'Missing GET param: [viaplay_url]';
const TRAILER_NOT_FOUND   = 'Trailer not found for this title';

// express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// hostname api
app.get('/', (req, res) => res.send(process.env['HOSTNAME']));

// trailers api
app.get('/trailers', async (req, res) => {
  const viaplay_url = _.get(req.query, 'viaplay_url', '').toLowerCase();
  if (!viaplay_url) {
    return res.status(400).json({ error: MISSING_VIAPLAY_URL });
  }

  if (!validateViaplayUrl(viaplay_url)) {
    return res.status(400).json({ error: INVALID_VIAPLAY_URL });
  }

  try {
    res.json({ 'trailer_urls': await getTrailerUrls(viaplay_url) });
  } catch {
    res.status(404).json({ error: TRAILER_NOT_FOUND, viaplay_url });
  }
});

app.listen(3000);
console.info(`Server up (pid: ${process.pid})`);
