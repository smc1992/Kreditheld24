# Multi-stage Dockerfile for Next.js production on Debian (sharp-friendly)
FROM node:20-bullseye AS builder
WORKDIR /app

# Enable Corepack and pin pnpm to repo's version
ENV COREPACK_HOME=/root/.corepack
RUN corepack enable && corepack prepare pnpm@9.9.0 --activate

# Install deps
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# Build app
COPY . .
ENV NODE_OPTIONS=--no-deprecation
RUN pnpm build

FROM node:20-bullseye AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@9.9.0 --activate

# Copy built assets and runtime files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json next.config.js ./

EXPOSE 3000
CMD ["pnpm", "start"]