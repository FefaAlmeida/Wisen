FROM node:24-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
COPY ai/package.json ai/package.json
RUN npm ci --no-audit --no-fund

FROM dependencies AS development
COPY . .

FROM development AS web-build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build -w @wisen/frontend

FROM node:24-bookworm-slim AS frontend
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=web-build --chown=node:node /app/frontend/.next/standalone ./
COPY --from=web-build --chown=node:node /app/frontend/.next/static ./frontend/.next/static
COPY --from=web-build --chown=node:node /app/frontend/public ./frontend/public
USER node
EXPOSE 3000
CMD ["node", "frontend/server.js"]

FROM development AS production-dependencies
RUN npm prune --omit=dev --no-audit --no-fund

FROM node:24-bookworm-slim AS backend
WORKDIR /app
ENV NODE_ENV=production
COPY --from=production-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node backend ./backend
USER node
EXPOSE 8080
CMD ["node", "backend/src/server.js"]

FROM backend AS ai
COPY --chown=node:node ai ./ai
CMD ["node", "ai/src/worker.js"]
