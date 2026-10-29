FROM node:24-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY apps/backend/package.json apps/backend/package.json
COPY apps/ai/package.json apps/ai/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/queue/package.json packages/queue/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci --no-audit --no-fund

FROM dependencies AS development
COPY . .

FROM development AS web-build
ARG NEXT_PUBLIC_API_URL=http://localhost:8080/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:24-bookworm-slim AS frontend
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=web-build --chown=node:node /app/apps/frontend/.next/standalone ./
COPY --from=web-build --chown=node:node /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=web-build --chown=node:node /app/apps/frontend/public ./apps/frontend/public
USER node
EXPOSE 3000
CMD ["node", "apps/frontend/server.js"]

FROM development AS production-dependencies
RUN npm prune --omit=dev --no-audit --no-fund

FROM node:24-bookworm-slim AS backend
WORKDIR /app
ENV NODE_ENV=production
COPY --from=production-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node packages ./packages
COPY --chown=node:node apps/backend ./apps/backend
USER node
EXPOSE 8080
CMD ["node", "apps/backend/src/server.js"]

FROM backend AS ai
COPY --chown=node:node apps/ai ./apps/ai
CMD ["node", "apps/ai/src/worker.js"]
