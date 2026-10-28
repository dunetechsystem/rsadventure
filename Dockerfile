# Site da RS Adventure em produção (Coolify): build standalone do Next, roda com `node server.js`.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# As NEXT_PUBLIC_* entram no JavaScript do navegador na hora do build — no Coolify, marque-as como
# "Build Variable". As do DunasTour também, porque o build já gera as páginas com os passeios.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_META_PIXEL_ID
ARG NEXT_PUBLIC_GA4_ID
ARG NEXT_PUBLIC_GOOGLE_ADS_ID
ARG NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL
ARG NEXT_PUBLIC_GTM_ID
ARG DUNASTOUR_API_URL
ARG DUNASTOUR_AGENCY_SLUG
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build
# node_modules sai do standalone pra virar uma camada própria: muda só quando as dependências mudam, então o
# servidor reaproveita a que já tem e cada deploy baixa só o código do site.
RUN mv .next/standalone/node_modules /app/standalone-modules

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs
COPY --from=builder --chown=nextjs:nodejs /app/standalone-modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chmod=755 docker-start.sh ./
USER nextjs
EXPOSE 3000
CMD ["./docker-start.sh"]
