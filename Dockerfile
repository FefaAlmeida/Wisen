FROM node:24-bookworm-slim AS manifests
WORKDIR /app
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
COPY ai/package.json ai/package.json

FROM manifests AS dependencies
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
FROM dependencies AS development
COPY . .
FROM development AS web-build
ARG DEPLOYMENT_VERSION=local
ENV NEXT_TELEMETRY_DISABLED=1 DEPLOYMENT_VERSION=$DEPLOYMENT_VERSION
RUN npm run build -w @wisen/frontend
FROM node:24-bookworm-slim AS frontend
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 NEXT_TELEMETRY_DISABLED=1
COPY --from=web-build --chown=node:node /app/frontend/.next/standalone ./
COPY --from=web-build --chown=node:node /app/frontend/.next/static ./frontend/.next/static
COPY --from=web-build --chown=node:node /app/frontend/public ./frontend/public
USER node
EXPOSE 3000
CMD ["node", "frontend/server.js"]

FROM manifests AS backend-dependencies
RUN --mount=type=cache,target=/root/.npm npm ci --workspace @wisen/backend --omit=dev --no-audit --no-fund
FROM node:24-bookworm-slim AS backend
WORKDIR /app
ENV NODE_ENV=production
COPY --from=backend-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node backend ./backend
USER node
EXPOSE 8080
CMD ["node", "backend/src/server.js"]

FROM manifests AS ai-dependencies
RUN --mount=type=cache,target=/root/.npm npm ci --workspace @wisen/ai --omit=dev --no-audit --no-fund
FROM node:24-bookworm-slim AS ai
WORKDIR /app
ENV NODE_ENV=production
COPY --from=ai-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node backend ./backend
COPY --chown=node:node ai ./ai
USER node
CMD ["node", "ai/src/worker.js"]
