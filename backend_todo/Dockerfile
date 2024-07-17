FROM node:22-alpine
WORKDIR /app
COPY ./package.* /app

RUN npm ci

CMD [ "node", "server.js" ]