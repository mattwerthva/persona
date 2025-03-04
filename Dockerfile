ARG NODE_VERSION
ARG PLATFORM="amd64"

# FROM ${PLATFORM}/node:${NODE_VERSION}
FROM node:18-alpine

# Install application files
WORKDIR /usr/src/app
COPY ./package*.json ./
# COPY ./app ./app
COPY . .

# Install dependencies
RUN npm install

CMD ["npm", "run", "dev"]
