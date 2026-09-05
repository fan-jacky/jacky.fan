# syntax=docker.io/docker/dockerfile:1

FROM node:22.17.0-alpine AS base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable \
  && corepack prepare pnpm@10.17.1 --activate \
  && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable \
  && corepack prepare pnpm@10.17.1 --activate \
  && pnpm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Next.js output file tracing can drop large native binaries (libvips .so) from
# the standalone node_modules. Re-copy the sharp platform packages so image
# processing works at runtime.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/@img+sharp-libvips-linuxmusl-arm64@1.3.3 /app/node_modules/.pnpm/@img+sharp-libvips-linuxmusl-arm64@1.3.3
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/@img+sharp-libvips-linux-arm64@1.3.3 /app/node_modules/.pnpm/@img+sharp-libvips-linux-arm64@1.3.3

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]