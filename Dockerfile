 # Base the image off of the NodeJS image
 #FROM node:latest
FROM node:lts-alpine
WORKDIR /var/classite

COPY package*.json ./
RUN npm install --silent

COPY server ./server/
COPY client/dist ./client/dist/

EXPOSE 3000
CMD ["npx", "nodemon", "server"]
