FROM node:8.11.3-alpine

WORKDIR /app

RUN apk update && \
    apk add git && \
    npm install -g npm && \
    npm install -g vue-cli

COPY package.json /app/

RUN npm install

ENV HOST 0.0.0.0
EXPOSE 13000