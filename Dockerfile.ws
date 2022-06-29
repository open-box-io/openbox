FROM node:18-alpine3.15

WORKDIR /usr/src/openbox/ws

COPY ../../package*.json ./

RUN npm i

COPY ../../packages/ws ./packages/ws
COPY ../../packages/common ./packages/common
COPY ../../lerna.json ./
COPY ../../yarn.lock ./

RUN yarn
RUN yarn build

EXPOSE 80
EXPOSE 443
EXPOSE 8000

CMD ["node", "./packages/ws/dist/ws/src/app.js"]
