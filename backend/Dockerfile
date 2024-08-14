# Base stage
FROM --platform=$BUILDPLATFORM node:lts-alpine as base
WORKDIR /app
COPY package.json .
EXPOSE 3000

# Production stage
FROM base as production
ENV NODE_ENV=production
RUN npm install
COPY . /app
CMD ["node", "app.js"]

# Development stage
FROM base as development
ENV NODE_ENV=development
RUN npm install
COPY . /app
CMD ["npm", "start"]
