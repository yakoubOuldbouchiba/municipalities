# Baladia Deployment Guide

Complete guide for building, testing, and deploying the Baladia application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Building Docker Images](#building-docker-images)
3. [Running Services Locally](#running-services-locally)
4. [Pushing to Registry](#pushing-to-registry)
5. [Production Deployment](#production-deployment)
6. [Monitoring & Logs](#monitoring--logs)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Ensure you have the following installed:
- Docker Desktop (with Docker Compose)
- Git
- Node.js 18+ (for local development)
- PHP 8.1+ (for Laravel backend)
- MySQL 8.0+

### Check Versions

```bash
docker --version
docker-compose --version
git --version
node --version
npm --version
```

---

## Building Docker Images

### Option 1: Build All Images Locally

Build all 4 images with the current git branch name as tag:

```bash
./cmds/build.images.sh --local
```

**Output Images:**
- `baladia-api:feature-mails`
- `baladia-admin:feature-mails`
- `baladia-site:feature-mails`
- `baladia-nginx:feature-mails`

### Option 2: Build with Custom Tag

```bash
# Set custom timeout (in seconds)
./cmds/build.images.sh --local --timeout 1200
```

### Option 3: Build for Registry Push

Build images with registry prefix for pushing to Docker Hub:

```bash
./cmds/build.images.sh --push
```

**Note:** You'll be prompted to log in to Docker Hub if not already authenticated.

### Option 4: Build Individual Images

#### Backend API
```bash
DOCKER_BUILDKIT=0 docker build -t baladia-api:feature-mails ./backend
```

**Note:** The backend Dockerfile includes development dependencies (collision package, phpunit, etc.) in production builds to ensure Laravel error handling works correctly. These lightweight packages improve debugging without significantly impacting image size.

#### Admin Portal
```bash
DOCKER_BUILDKIT=0 docker build -t baladia-admin:feature-mails ./admin-portal
```

#### Website
```bash
DOCKER_BUILDKIT=0 docker build -t baladia-site:feature-mails ./my-site
```

#### Nginx Reverse Proxy
```bash
DOCKER_BUILDKIT=0 docker build -t baladia-nginx:feature-mails ./nginx
```

### Verify Built Images

```bash
docker images | grep feature-mails
```

Expected output:
```
baladia-api                               feature-mails              0af2fd859b93   19s    936MB
baladia-admin                             feature-mails              a14eced8a4a7   5m     104MB
baladia-site                              feature-mails              d94c10e4b0ec   2m     85.5MB
baladia-nginx                             feature-mails              c6ba874811b1   4m     81.1MB
```

---

## Running Services Locally

### Option 1: Using Docker Compose (Recommended)

Start all services with the built images:

```bash
# Start all services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Remove volumes (database data will be lost)
docker-compose down -v
```

### Option 2: Run Individual Containers

#### Backend API
```bash
docker run -d \
  --name baladia-api \
  -p 8000:8000 \
  -e APP_ENV=local \
  -e DB_HOST=mysql_baladia \
  --network app-network \
  baladia-api:feature-mails
```

#### Admin Portal
```bash
docker run -d \
  --name baladia-admin \
  -p 3001:80 \
  --network app-network \
  baladia-admin:feature-mails
```

#### Website
```bash
docker run -d \
  --name baladia-site \
  -p 3002:80 \
  --network app-network \
  baladia-site:feature-mails
```

#### Nginx Reverse Proxy
```bash
docker run -d \
  --name baladia-nginx \
  -p 80:80 \
  -p 443:443 \
  --network app-network \
  baladia-nginx:feature-mails
```

### Access Services

| Service | URL | Port |
|---------|-----|------|
| Admin Portal | http://localhost:3001 | 3001 |
| Website | http://localhost:3002 | 3002 |
| API | http://localhost:8000/api | 8000 |
| Nginx Proxy | http://localhost | 80 |
| PhpMyAdmin | http://localhost:8080 | 8080 |
| Grafana | http://localhost:3000 | 3000 |
| Prometheus | http://localhost:9090 | 9090 |

---

## Pushing to Registry

### Prerequisites

- Docker Hub account
- Logged in to Docker Hub: `docker login`

### Push All Images

```bash
./cmds/build.images.sh --push
```

### Push Individual Images

```bash
# Set your Docker Hub username
DOCKER_HUB_USER="yakoubouldbouchiba"

# Push Backend
docker tag baladia-api:feature-mails $DOCKER_HUB_USER/baladia-api:feature-mails
docker push $DOCKER_HUB_USER/baladia-api:feature-mails

# Push Admin Portal
docker tag baladia-admin:feature-mails $DOCKER_HUB_USER/baladia-admin:feature-mails
docker push $DOCKER_HUB_USER/baladia-admin:feature-mails

# Push Website
docker tag baladia-site:feature-mails $DOCKER_HUB_USER/baladia-site:feature-mails
docker push $DOCKER_HUB_USER/baladia-site:feature-mails

# Push Nginx
docker tag baladia-nginx:feature-mails $DOCKER_HUB_USER/baladia-nginx:feature-mails
docker push $DOCKER_HUB_USER/baladia-nginx:feature-mails
```

### Verify Pushed Images

Visit Docker Hub: https://hub.docker.com/u/yakoubouldbouchiba

---

## Production Deployment

### Prepare Production Environment

1. **Update docker-compose.yml** for production:
   ```bash
   # Copy and modify for production
   cp docker-compose.yml docker-compose.prod.yml
   ```

2. **Set environment variables:**
   ```bash
   cat > .env.production << EOF
   APP_ENV=production
   APP_KEY=your-app-key-here
   APP_DEBUG=false
   DB_HOST=mysql_baladia
   DB_DATABASE=baladia-web
   DB_USERNAME=user
   DB_PASSWORD=your-secure-password
   REDIS_HOST=redis_baladia
   REDIS_PASSWORD=your-redis-password
   EOF
   ```

3. **Enable HTTPS:**
   - Update `nginx/nginx.conf` with SSL certificates
   - Add SSL directives for production

### Deploy Services

```bash
# Pull latest images from registry
docker-compose -f docker-compose.prod.yml pull

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Verify all services are running
docker-compose -f docker-compose.prod.yml ps

# Run database migrations
docker-compose -f docker-compose.prod.yml exec baladia-api php artisan migrate --force

# Clear caches
docker-compose -f docker-compose.prod.yml exec baladia-api php artisan cache:clear
docker-compose -f docker-compose.prod.yml exec baladia-api php artisan config:clear
```

### Database Backup Before Deployment

```bash
# Backup current database
docker exec mysql_baladia mysqldump -u user -padmin baladia-web > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup if needed
docker exec -i mysql_baladia mysql -u user -padmin baladia-web < backup_20251210_120000.sql
```

---

## Monitoring & Logs

### View Service Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f baladia-api

# Last 100 lines
docker-compose logs -f --tail 100 baladia-admin

# View only errors
docker-compose logs baladia-api | grep ERROR
```

### Monitor Container Resources

```bash
# Real-time monitoring
docker stats

# View container details
docker ps -a

# Inspect container
docker inspect baladia-api
```

### Check Service Health

```bash
# Backend API health
curl http://localhost:8000/api/health

# Test database connection
docker exec mysql_baladia mysqladmin ping -u user -padmin

# Test Redis connection
docker exec redis_baladia redis-cli ping
```

### Access Monitoring Tools

- **Grafana:** http://localhost:3000 (Monitor metrics)
- **Prometheus:** http://localhost:9090 (View metrics)
- **PhpMyAdmin:** http://localhost:8080 (Manage database)

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs baladia-api

# Verify image exists
docker images | grep baladia

# Rebuild image
docker build -t baladia-api:feature-mails ./backend
```

### Port Already in Use

```bash
# Find process using port
lsof -i :8000

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Database Connection Error

```bash
# Check MySQL is running
docker-compose ps mysql_baladia

# Test connection
docker exec mysql_baladia mysql -u user -padmin -e "SELECT 1"

# Check connection string in .env.docker
cat .env.docker | grep DB_
```

### Out of Disk Space

```bash
# Clean up unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Check disk usage
docker system df

# Full cleanup (removes all stopped containers, unused networks, etc.)
docker system prune -a
```

### Rebuild All Images

```bash
# Remove old images
docker image rm baladia-api:feature-mails baladia-admin:feature-mails baladia-site:feature-mails baladia-nginx:feature-mails

# Rebuild
./cmds/build.images.sh --local
```

### Docker Build Takes Time at "Unpacking" Step

The "=> => unpacking to docker.io/library/..." message is **not a hang**—it's extracting a 823MB image layer to disk. This can take 1-2 minutes.

**Do NOT press Ctrl+C during this step.** Wait for the build to complete. The image will finish successfully.

```bash
# Build and wait for completion (takes 3-5 minutes total)
docker build -t baladia-api:feature-mails ./backend

# For faster builds without the unpacking output, use:
DOCKER_BUILDKIT=0 docker build -t baladia-api:feature-mails ./backend
```

**Expected final output:**
```
=> => naming to docker.io/library/baladia-api:feature-mails
=> => unpacking to docker.io/library/baladia-api:feature-mails
[✓] Successfully built baladia-api:feature-mails
```

### View Application Logs

```bash
# Backend Laravel logs
docker exec baladia-api tail -f storage/logs/laravel.log

# Nginx logs
docker exec baladia-nginx tail -f /var/log/nginx/error.log

# Database logs
docker logs mysql_baladia
```

### Server Error / Missing CollisionServiceProvider

**Symptom:** Backend API returns "Server Error" and logs show:
```
Class "NunoMaduro\Collision\Adapters\Laravel\CollisionServiceProvider" not found
```

**Cause:** The `nunomaduro/collision` package is a development dependency needed for proper Laravel error handling, but was being excluded during production builds using `--no-dev` flag in composer install.

**Solution:** Backend Dockerfile updated (December 14, 2025):
- Removed `--no-dev` flag from composer install command
- Added `netcat-traditional` to runtime dependencies for health checks
- Created proper entrypoint script for container initialization

**To apply the fix:**
```bash
# Rebuild the backend image
docker build -t baladia-api:feature-mails ./backend

# Restart all services
docker-compose down
docker-compose up -d

# Verify the API is running
docker logs baladia_api
```

---

## Useful Docker Commands

```bash
# List all containers
docker ps -a

# Stop all containers
docker stop $(docker ps -q)

# Remove all stopped containers
docker container prune

# View image details
docker inspect baladia-api:feature-mails

# Check image size
docker images --format "table {{.Repository}}\t{{.Size}}"

# Tag image
docker tag baladia-api:feature-mails baladia-api:latest

# Remove image
docker rmi baladia-api:feature-mails

# Export image
docker save baladia-api:feature-mails > baladia-api.tar

# Import image
docker load < baladia-api.tar
```

---

## CI/CD Pipeline (GitHub Actions Example)

Add to `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main, feature/mails]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker images
        run: ./cmds/build.images.sh --local
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_HUB_USER }}
          password: ${{ secrets.DOCKER_HUB_TOKEN }}
      
      - name: Push images
        run: ./cmds/build.images.sh --push
```

---

## Support & References

- **Docker Documentation:** https://docs.docker.com/
- **Docker Compose:** https://docs.docker.com/compose/
- **Laravel Deployment:** https://laravel.com/docs/deployment
- **React Deployment:** https://react.dev/learn/deployment
- **Nginx:** https://nginx.org/en/docs/

---

**Last Updated:** December 14, 2025

**Maintainer:** Yakoub Ouldbouchiba

**Repository:** https://github.com/yakoubOuldbouchiba/municipalities
