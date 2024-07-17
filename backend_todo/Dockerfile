FROM node:22-alpine
WORKDIR /app
COPY ./package* /app
COPY ./server.js /app

RUN npm install
RUN ls -la
RUN pwd

CMD [ "node", "server.js" ]