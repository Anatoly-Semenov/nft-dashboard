FROM node:16-alpine

RUN apk add git

WORKDIR /web

ADD . .
RUN yarn install
RUN yarn build

CMD [ "yarn", "start" ]
