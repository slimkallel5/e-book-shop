FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

RUN npm ci

COPY apps/web ./apps/web
COPY tsconfig.json ./

WORKDIR /app/apps/web
RUN npx expo export --platform web

FROM nginx:alpine AS runner

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
