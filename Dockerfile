FROM node:19-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4306

CMD ["npm", "start"]