FROM node:10.15-alpine

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build
# RUN npm ci --only=production

ENV NUXT_HOST=0.0.0.0 \
    NUXT_PORT=3000

EXPOSE 3000

CMD ["npm", "run", "start"]
