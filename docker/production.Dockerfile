# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
RUN yarn install --silent
COPY . .
RUN yarn build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./docker/nginx.conf /etc/nginx/conf.d
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
