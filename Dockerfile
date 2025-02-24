ARG NODE_VERSION
ARG PLATFORM="amd64"

# FROM ${PLATFORM}/node:${NODE_VERSION}
FROM node:18-alpine

# Install application files
WORKDIR /usr/src/app
COPY ./package*.json ./
COPY ./app ./app

# Install dependencies
RUN npm install

# WORKDIR /usr/src/app
RUN chown node:node /usr/src/app

USER node

CMD ["node", "server.js"]
