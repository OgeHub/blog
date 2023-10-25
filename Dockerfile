FROM node:18-alpine3.17

WORKDIR /home

COPY package*.json ./

COPY tsconfig.json ./

RUN npm install typescript

COPY ./src .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]