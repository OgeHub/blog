FROM node:18-alpine3.17

WORKDIR /home

COPY package*.json ./

COPY tsconfig.json ./

RUN npm install typescript

RUN npx tsc

COPY ./src .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]