FROM node:alpine

LABEL maintainer="Atabay Heydarli heydarli.atabay@gmail.com"

ENV TZ=Europe/Rome
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./ /app/

RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
