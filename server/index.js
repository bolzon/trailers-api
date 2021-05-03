require('dotenv').config();

const _ = require('lodash');
const express = require('express');
const { getTrailerUrls } = require('./rest');

// express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// hostname api
app.get('/', (req, res) => res.send(process.env['HOSTNAME']));

// health check api
app.all('/check', (req, res) => res.status(200).end());

// trailers api
app.post('/trailers', async (req, res) => {
  const viaplay_url = _.get(req.body, 'viaplay_url', null);
  if (viaplay_url) {
    try {
      res.json({ 'trailer_urls': await getTrailerUrls(viaplay_url) });
    } catch (ex) {
      res.status(404).json({ error: 'Trailer not found for this title', viaplay_url });
    }
  } else {
    res.status(400).json({ error: 'Missing param: [viaplay_url]'});
  }
});

app.listen(3000);
console.info(`Server up (pid: ${process.pid})`);
