# Local Development & Production Setup

## Production (Docker)
```bash
# Build with production Nginx
docker build -t baladia-admin:latest .

# Run
docker run -p 3000:3000 baladia-admin:latest
```

**Features:**
- ✅ Lightweight Nginx serving (not Node.js)
- ✅ Port 3000 configured
- ✅ Optimized static asset caching
- ✅ React Router SPA routing
- ✅ Health checks enabled

## Local Development (Mac/Linux)
```bash
# Copy .env.local if developing locally
cp .env.local .env.local

# Install dependencies
npm ci

# Start dev server on port 3000
npm run dev

# Or default start
npm start
```

**Environment Variables:**
- `.env` - Production settings (Nginx in Docker)
- `.env.local` - Local development overrides

### Configuration Files

#### .env (Production)
```env
REACT_APP_API_URL=http://localhost/api
REACT_APP_PORT=3000
```

#### .env.local (Development)
```env
REACT_APP_API_URL=http://localhost:3000/api
SKIP_PREFLIGHT_CHECK=true
```

#### nginx.conf (Production Nginx Config)
- Serves React build from `/usr/share/nginx/html`
- Handles React Router with `try_files` fallback
- Caches static assets (JS, CSS) for 1 year
- No caching for index.html

#### Dockerfile
- **Stage 1:** Node.js build (compiles React app)
- **Stage 2:** Nginx Alpine (serves static files)
- Multi-stage for minimal production image (~50MB)
