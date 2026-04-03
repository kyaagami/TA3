# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Install deps first for better caching
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build TypeScript project
RUN npm run build

# Stage 2: Production runtime
FROM node:20-slim

WORKDIR /app

# Only copy production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist/public ./dist/public

CMD ["node", "dist/main/server.js"]

EXPOSE 3000
