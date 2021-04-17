# Trailers API

This API is written in Node.js 14 and intends to bring trailer URLs from a viaplay movie resource URL like this:

https://content.viaplay.se/pc-se/film/arrival-2016

The application uses Redis for caching and so it's needed to properly configure the database URL before running it.

```sh
export REDIS_URL=<my_redis_url>
```

Movie details are brought from [TMDB](https://www.themoviedb.org/) and a key is necessary to authenticate their API.

```sh
export TMDB_API_KEY=<api_key>
```

It uses npm as package manager and to install dependencies and run the application, follow these commands:

```sh
npm install
npm start
```

To test the API, use curl:

```sh
curl -X POST -H 'Content-type: application/json' \
     -d '{"viaplay_url":"https://content.viaplay.se/pc-se/film/arrival-2016"}' \
     localhost:3000/trailers
```

App should return a JSON body with a list of trailer URLs like this:

```sh
{"trailer_urls":["https://youtu.be/tFMo3UJ4B4g","https://youtu.be/7W1m5ER3I1Y"]}
```
