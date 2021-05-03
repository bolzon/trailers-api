# Trailers API

<sup>2021-04-17</sup>

This API is written in Node.js 14 and intends to bring trailer URLs from a viaplay movie resource URL like this:

https://content.viaplay.se/pc-se/film/arrival-2016

It Redis for caching and so it's needed to properly configure the database URL before running it.

```sh
export REDIS_URL=<my_redis_url> # redis URL
export REDIS_TTL=<time_to_live> # time cache will live (in secs)
```

Movie details are brought from [TMDB](https://www.themoviedb.org/) and a key is necessary to authenticate their API.

```sh
export TMDB_API_KEY=<api_key>
```

npm was used as package manager and to install dependencies and run the application, follow commands below:

```sh
npm install
npm start
```

## Container

This piece of software was designed to run in a docker container.

```sh
# builds the docker image
docker-compose build

# runs redis and the application
docker-compose up -d
```

## Load balancer

A simple load balancer is used in order to extend the application performance and scalability.

After running the `docker-compose up -d` command, it's possible to scale the application by using the command bellow:

```sh
docker-compose scale trailers-api=N
```

Where "**N**" is the number of the application instances that will be deployed.

## Test the API

To test the API, use curl:

```sh
curl -H 'Content-type: application/json' \
     0.0.0.0:8080/trailers?viaplay_url=https://content.viaplay.se/pc-se/film/arrival-2016
```

> Use port 8080 for applications running in containers and 3000 for application running locally.

App should return a JSON body with a list of trailer URLs like this:

```sh
{"trailer_urls":["https://youtu.be/tFMo3UJ4B4g","https://youtu.be/7W1m5ER3I1Y"]}
```

## Performance tests

To measure the performance of the application, it was used [Locust](https://locust.io/), that's a Python loadtesting tool.

```sh
cd tests

pipenv install

locust -f perftest.py -L INFO \
       --csv=report --only-summary --headless \
       -u <num of users> -r <spawn time> -t <test time>
```

To improve performance, better creating a cluster of at least 5 application containers.

```sh
docker-compose scale trailers-api=4
```

## What else was needed?

- Unit tests for the software parts (I'd have used [mocha](https://mochajs.org/))
- CI/CD script to deploy the application (I'd have used [CircleCI](https://circleci.com/) or [Travis CI](https://travis-ci.org/))
- Linter to keep the code quality high (I'd have used [ESLint](https://eslint.org/))
- IaC (Infrastructure as Code) with [CloudFormation](https://aws.amazon.com/cloudformation/) or [Terraform](https://www.terraform.io/)

## Credits and license

Software designed and written by [Alexandre Bolzon](mailto:blzn@mail.ru) as part of the interview process for [NENT Group](https://www.nentgroup.com/).

Code in this repository should not be copied nor reproduced, partially or totally, without express authorization from the author.
