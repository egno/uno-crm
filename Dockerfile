FROM node:10.15-alpine AS deps

WORKDIR /app
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
RUN npm ci

FROM deps AS builder
WORKDIR /app
COPY . .
RUN npm run build
RUN npm ci --only=production

FROM node:10.15-alpine
WORKDIR /app
COPY --from=builder /app/static ./static
COPY --from=builder /app/modules ./modules
COPY --from=builder /app/plugins ./plugins
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.nuxt ./.nuxt

CMD ["npm", "run", "start"]
