FROM node:18.12.1

ENV TINI_VERSION v0.19.0

ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini

RUN chmod +x /tini

ENTRYPOINT ["/tini", "--"]

USER node

WORKDIR /home/node

EXPOSE 8081

COPY package.json package-lock.json ./

RUN npm ci --production && npm cache clean --force

COPY . .

CMD ["node", "index.js"]
