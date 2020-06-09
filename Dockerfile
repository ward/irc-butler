FROM node:12.18-alpine3.12

WORKDIR /home/node/node-irc-butler

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN ["chown", "node:node", "-R", "/home/node/node-irc-butler"]

CMD ["node", "main.js"]

# Build with:
# docker build -t wardmuylaert/node-irc-butler .
# Run with:
# docker run -d -u node -m "100M" -e "NODE_ENV=production" --name node-irc-butler --init wardmuylaert/node-irc-butler

# TODO: Volume for production config? Or something else still?
# TODO: Something that restarts it after it crashes?
