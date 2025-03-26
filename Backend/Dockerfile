# Use the appropriate node image
FROM node:17-alpine

WORKDIR  /backend

# Set environment variables
ENV PORT=4000
ENV DB=mongodb+srv://prabashwara:eS*cmqJk_2FF94b@garbage-collection.om7xk.mongodb.net/Garbage-Collection-DB?retryWrites=true&w=majority&appName=Garbage-Collection

RUN npm install -g nodemon

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

CMD [ "npm"  , "start"]