require('dotenv').config();
const _ = require('lodash');
const express = require('express');
const jsonParser = require('body-parser').json();
const { getTrailerUrls } = require('./rest');

const app = express();
app.use(jsonParser);

app.post('/trailers', async (req, res) => {
  const url = _.get(req.body, 'viaplay_url', null);
  if (url) {
    res.json({ 'trailer_urls': await getTrailerUrls(url) });
  } else {
    res.json({ error: 'Missing param: [viaplay_url]'}, 400);
  }
});

app.listen(3000);
console.log(`Server up (pid: ${process.pid})`);
