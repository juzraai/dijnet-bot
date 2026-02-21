FROM node:24-alpine

# timezone

ENV TZ=Europe/Budapest

RUN apk add --no-cache tzdata \
	&& ln -sf /usr/share/zoneinfo/$TZ /etc/localtime \
	&& echo $TZ > /etc/timezone

# dependencies

RUN corepack enable pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm i

# app

COPY . ./

RUN chmod -R 755 /app

CMD ["node", ".", "-o", "/szamlak"]
