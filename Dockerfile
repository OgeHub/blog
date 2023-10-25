FROM node:18-alpine3.17

WORKDIR /home

COPY package*.json ./

COPY tsconfig.json ./

RUN npm install typescript

COPY ./src .

RUN tsc

EXPOSE 3000

CMD [ "npm", "start" ]