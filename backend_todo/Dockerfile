FROM node:22-alpine
WORKDIR /app
COPY ./package.* /app

RUN npm i
RUN ls -la
RUN pwd

CMD [ "node", "server.js" ]