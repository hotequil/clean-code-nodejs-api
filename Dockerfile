FROM node:16
WORKDIR /usr/src/clean-code-nodejs-api
COPY ./package.json .
RUN npm i --only=prod
COPY ./dist ./dist
EXPOSE 6000
CMD npm start
