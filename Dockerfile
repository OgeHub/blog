FROM node:18-alpine3.17

WORKDIR /home

COPY package*.json ./

COPY ./src .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]