FROM node:17-alpine

# ENV PORT=8000

# ENV DB=mongodb+srv://prabashwara:eS*cmqJk_2FF94b@garbage-collection.om7xk.mongodb.net/Garbage-Collection-DB?retryWrites=true&w=majority&appName=Garbage-Collection

# RUN npm i -g nodemon 

RUN npm install

COPY . . 

EXPOSE 80

CMD ["npm" , "run" , "dev" ]



