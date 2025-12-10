# Stage 1: Build stage
FROM node:18-alpine AS builder

ARG BUILD_ID=unknown

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production && npm install

# Copy all source files (this invalidates cache when code changes)
COPY . .

# Use production .env for Docker build (Nginx proxy at localhost/api)
RUN cp .env.docker .env

# Use BUILD_ID to ensure build always runs
RUN echo "Build ID: $BUILD_ID" && npm run build

# Stage 2: Production - lightweight Nginx for serving static React app
FROM nginx:alpine

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config for React Router SPA
COPY nginx.conf /etc/nginx/conf.d/admin.conf

# Copy built React app to Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
