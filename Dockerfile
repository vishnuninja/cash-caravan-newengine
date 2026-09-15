# Use official Node.js image as base image
FROM node:20-alpine as builder

ARG TAG 
# Set the working directory
WORKDIR /app

COPY ../. .

RUN npm install
RUN npm run build

WORKDIR /app/build

RUN sed -i "s/__version__/$TAG/g" main.js
RUN sed -i "s/__version__/$TAG/g" index.html

FROM nginx:stable-alpine

# Copy built assets to Nginx html directory
COPY --from=builder /app/build/. /usr/src/app

# Replace default Nginx config if needed
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf
# Expose the application port (default port 3000 for Express)
EXPOSE 8089
