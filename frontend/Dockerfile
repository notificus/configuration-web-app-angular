##############################################################################
# Stage 1
#
FROM node:10-alpine as node

WORKDIR /home/frontend

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build-prod

##############################################################################
# Stage 2
#
FROM nginx:1.13.12-alpine

COPY --from=node /home/frontend/dist/frontend /home/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf