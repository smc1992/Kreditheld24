# Coolify-optimized Dockerfile für Kreditheld24
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install pnpm in builder stage
RUN npm install -g pnpm

# Set environment variables for build
ENV NODE_ENV=production
ENV NODE_OPTIONS=--no-deprecation
ENV NEXT_TELEMETRY_DISABLED=1

# Set environment variables for build (use dummy DB for build-time)
    ENV PAYLOAD_SECRET=pE+sqfjsiieXAVuGVsnPBMaP6TNnQ5ajLaN0AfK84eg=
    ENV DATABASE_URI=postgresql://postgres:postgres@localhost:5432/postgres
    ENV NODE_ENV=production
    ENV NEXT_PUBLIC_SERVER_URL=https://kreditheld24.de
    ENV PORT=3000
    ENV NODE_OPTIONS=--no-deprecation
    ENV NEXT_TELEMETRY_DISABLED=1

    # Build the application
    RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NODE_OPTIONS=--no-deprecation
ENV NEXT_TELEMETRY_DISABLED=1

# Create nextjs user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install pnpm in runner stage
RUN npm install -g pnpm

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy additional files needed for Payload CMS
COPY --from=builder /app/src ./src
COPY --from=builder /app/init-footer.sql ./init-footer.sql
COPY --from=builder /app/init-footer.cjs ./init-footer.cjs

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["pnpm", "start"]
