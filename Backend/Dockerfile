# Use the appropriate node image
FROM node:17-alpine

WORKDIR  /backend

RUN npm install -g nodemon

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

CMD [ "npm"  , "start"]