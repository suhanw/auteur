# Use Node 8 as base image
ARG NODE_VERSION=8
FROM node:${NODE_VERSION} AS base

# Dependencies image
FROM base AS dependencies

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Create app directory
WORKDIR /usr/src/app
# Copy package files
COPY package*.json ./
# Download dependencies as a separate step to take advantage of Docker's caching.
RUN npm ci --include=dev
# Copy the rest of the source files into the image.
COPY . .

# Builder image
FROM base AS builder

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
COPY ../package*.json ./
# Copy the dependencies from the dependencies image.
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
# Copy the rest of the source files into the image.
COPY . .

RUN npm run webpack

#Production image
FROM base AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
COPY ../package*.json ./
# Install ONLY production dependencies
RUN npm ci --omit=dev
# Copy the built server from the builder image.
COPY --from=builder /usr/src/app/src ./src

ARG PORT=80
ENV PORT=${PORT}
# Expose the port that the application listens on.
EXPOSE ${PORT}

# Start command
CMD node src/server/app.js
