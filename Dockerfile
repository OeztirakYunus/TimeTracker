FROM node:14.17.0-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# RUN ls
RUN npm run build --prod


### STAGE 2 ###
FROM nginx:stable-alpine
COPY /nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]