FROM node:22-alpine
WORKDIR /app
COPY ./package.* /app

RUN npm i

CMD [ "node", "server.js" ]