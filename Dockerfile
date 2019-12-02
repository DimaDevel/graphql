FROM node:12.13.1-alpine

LABEL maintainer Ivanov Dmitry "dima.ivanov.dev@gmail.com"

WORKDIR /var/www/html
COPY . /var/www/html

RUN apk add --update --no-cache \
    python \
    make \
    g++ \
    musl \
    git \
    bash \
    && npm install

CMD ["npm", "start"]
