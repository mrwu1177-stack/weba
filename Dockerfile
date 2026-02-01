# Dockerfile for HelloYan - Next.js Application
# Multi-stage build for optimal production deployment

FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm install

FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app

# Install dumb-init for signal handling
RUN apk add --no-cache dumb-init

COPY package*.json ./
COPY .npmrc ./
RUN npm install --production && npm cache clean --force

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/tsconfig.json ./tsconfig.json 2>/dev/null || true
COPY --from=builder /app/tailwind.config.js ./tailwind.config.js 2>/dev/null || true
COPY --from=builder /app/postcss.config.js ./postcss.config.js 2>/dev/null || true

# Non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]