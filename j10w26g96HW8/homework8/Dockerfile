
FROM node:latest AS ui-build
WORKDIR /usr/src/app
COPY homework8/ homework8/
RUN cd my-app && npm install @angular/cli && npm install && npm run build

FROM node:latest AS server-build
WORKDIR /root/
COPY --from=ui-build /usr/src/app/homework8/dist /homework8/dist
COPY package*.json ./
RUN npm install
COPY server.js .

EXPOSE 3080

CMD ["node", "server.js"]