FROM node:14.16.1-alpine3.13

WORKDIR /usr/src/app

COPY package*.json ./
COPY server/ ./server

RUN npm ci --only=production

HEALTHCHECK --interval=10s --timeout=2s --start-period=15s \
  CMD node healthcheck.js

EXPOSE 3000
CMD [ "npm", "start" ]
