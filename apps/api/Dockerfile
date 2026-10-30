FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/api/prisma ./apps/api/prisma

RUN npm ci

COPY apps/api ./apps/api
COPY tsconfig.json ./

WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/data ./apps/api/data

WORKDIR /app/apps/api

EXPOSE 3000

CMD ["sh", "-c", "if [ \"$DATA_STORE\" = \"postgres\" ]; then npx prisma db push --skip-generate && npm run seed; fi && node dist/main.js"]
