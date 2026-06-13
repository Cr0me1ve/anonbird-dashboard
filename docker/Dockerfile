FROM node:24-alpine AS build
WORKDIR /app

ARG NEXT_PUBLIC_BASE_PATH=""
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.29-alpine

RUN apk add --no-cache bash gettext

COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY docker/init_react_envs.sh /docker-entrypoint.d/20-init-react-envs.sh
RUN chmod +x /docker-entrypoint.d/20-init-react-envs.sh

COPY --from=build /app/out/ /usr/share/nginx/html/
