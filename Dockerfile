# develop stage
FROM node:14.8-alpine as develop-stage
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .

# build stage
FROM develop-stage as build-stage
RUN yarn build

# production stage
FROM nginx:1.19.2-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
