# Base image for both production and development stages
FROM node:lts-alpine as base
WORKDIR /app
COPY package.json ./
EXPOSE 3300

# Production stage
FROM base as production
ENV NODE_ENV=production
RUN npm install --only=production
COPY . /app
CMD ["node", "index.js"]

# Development stage
FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . /app
CMD ["npm", "run", "start"]
