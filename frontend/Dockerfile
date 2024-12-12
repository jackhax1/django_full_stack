FROM node:18-alpine

WORKDIR /usr/src/app


CMD [ "npm", "run", "dev" ]


COPY package.json /usr/src/app

RUN npm install

COPY . /usr/src/app





