# Ultra-lightweight Backend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production --no-audit --no-fund

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose port
EXPOSE 8080

# Simple health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=2 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/indices || exit 1

# Start with minimal memory
CMD ["node", "--max-old-space-size=256", "index.js"]
