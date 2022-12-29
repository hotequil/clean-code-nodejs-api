FROM node:16
WORKDIR /usr/src/clean-code-nodejs-api
COPY ./package.json .
RUN npm i --omit=dev
