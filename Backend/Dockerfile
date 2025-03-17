FROM node-17:alphine

ENV PORT=8000

ENV DB=mongodb+srv://prabashwara:eS*cmqJk_2FF94b@garbage-collection.om7xk.mongodb.net/Garbage-Collection-DB?retryWrites=true&w=majority&appName=Garbage-Collection

RUN npm i -g nodemon 

RUN npm i 

COPY . . 

EXPOSE 5173

CMD ["npm" , "start" ]



