FROM node:alpine

WORKDIR /express-app

COPY package*.json ./
RUN npm install --silent

COPY . ./

EXPOSE 3000