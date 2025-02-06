FROM node:18


WORKDIR /scooter-rental-system-frontend-admin


COPY package*.json ./


RUN npm install

COPY . .


EXPOSE 3001


ENTRYPOINT ["npm", "start"]
