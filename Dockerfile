# --------------------------
# | Build target           |
# --------------------------
FROM node:12.16.1-alpine

WORKDIR /home/freezer

COPY package*.json ./
RUN npm install

COPY libs ./libs
COPY tools ./tools
COPY angular.json tsconfig.json nx.json tslint.json jest.config.js ./
COPY apps ./apps

RUN npm run nx -- build api && \
    npm run nx -- build freezer && \
    npm prune --production

# --------------------------
# | Production target      |
# --------------------------
FROM node:12.16.1-alpine
EXPOSE 3333

WORKDIR /home/freezer

COPY --from=0 /home/freezer/node_modules ./node_modules
COPY --from=0 /home/freezer/dist ./dist

CMD node dist/apps/api/main.js
