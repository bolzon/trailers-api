require('dotenv').config();

const _ = require('lodash');
const express = require('express');
const jsonParser = require('body-parser').json();
const { getTrailerUrls } = require('./rest');

// express app
const app = express();
app.use(jsonParser);

// hostname api
app.get('/', (req, res) => res.send(process.env['HOSTNAME']));

// health check api
app.all('/check', (req, res) => res.status(200).end());

// trailers api
app.post('/trailers', async (req, res) => {
  const url = _.get(req.body, 'viaplay_url', null);
  if (url) {
    res.json({ 'trailer_urls': await getTrailerUrls(url) });
  } else {
    res.status(400).json({ error: 'Missing param: [viaplay_url]'});
  }
});

app.listen(3000);
console.info(`Server up (pid: ${process.pid})`);
