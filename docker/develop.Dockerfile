FROM node:lts-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
RUN yarn install --silent
COPY . .
RUN yarn build
CMD ["npm", "run", "serve"]
