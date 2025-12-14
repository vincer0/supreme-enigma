# Shopping List - Docker Setup

## Architecture

This docker-compose setup runs the complete development environment with:

- **Frontend**: Next.js app (port 3000)
- **Backend**: Laravel API (port 8000) via Nginx + PHP-FPM
- **Database**: MariaDB 11 (port 3306)
- **Cache**: Redis (port 6379)

## Fixed Issues

### 1. Backend Service
- ✅ Added `target: development` to use the correct Dockerfile stage
- ✅ Fixed volume mount from `.:/var/www/html` to `./backend:/var/www`
- ✅ Added nginx service to serve the Laravel API (PHP-FPM alone can't serve HTTP)
- ✅ Added all required Laravel environment variables
- ✅ Created missing entrypoint scripts for both production and development

### 2. Frontend Service
- ✅ Fixed `next.config.js` reference to `next.config.ts`
- ✅ Added `node_modules` volume exclusion to prevent overwriting
- ✅ Added proper Next.js environment variables
- ✅ Added config file volume mounts

### 3. Database & Redis
- ✅ Added proper healthchecks with intervals
- ✅ Changed network from external `my_network` to bridge `shopping_network`
- ✅ Renamed volumes for clarity
- ✅ Added container names for easier management
- ✅ Set proper restart policies

### 4. Volumes
- ✅ Excluded `vendor` and `node_modules` from being overwritten by mounts
- ✅ Proper volume mounts for development (src, public, config files)

## Setup Instructions

### 1. Create .env file
```bash
cp .env.example .env
```

### 2. Generate Laravel APP_KEY
```bash
# You need to do this after starting containers for the first time
docker compose -f docker-compose.dev.yml exec backend php artisan key:generate
```

### 3. Start the environment
```bash
docker compose -f docker-compose.dev.yml up -d
```

### 4. Check status
```bash
docker compose -f docker-compose.dev.yml ps
```

## Services Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Database**: localhost:3306
- **Redis**: localhost:6379

## Important Notes

### Backend Configuration
- The backend Dockerfile uses a multi-stage build (production, development)
- In development mode, it includes Xdebug for debugging
- PHP-FPM runs on port 9000 (internal)
- Nginx proxies HTTP requests to PHP-FPM

### Frontend Configuration
- Next.js runs in development mode with hot-reload
- Environment variable `NEXT_PUBLIC_API_URL` configures the backend API endpoint

### Database
- MariaDB creates the database on first run
- Data persists in `mariadb_data` volume

## Common Commands

```bash
# Start services
docker compose -f docker-compose.dev.yml up -d

# Stop services
docker compose -f docker-compose.dev.yml down

# View logs
docker compose -f docker-compose.dev.yml logs -f

# View specific service logs
docker compose -f docker-compose.dev.yml logs -f backend

# Rebuild services
docker compose -f docker-compose.dev.yml up -d --build

# Execute commands in backend
docker compose -f docker-compose.dev.yml exec backend php artisan migrate

# Execute commands in frontend
docker compose -f docker-compose.dev.yml exec frontend npm install

# Access shell
docker compose -f docker-compose.dev.yml exec backend bash
docker compose -f docker-compose.dev.yml exec frontend sh
```

## Development Workflow

### Backend (Laravel)
1. Code changes are automatically reflected (volume mounted)
2. Run migrations: `docker compose -f docker-compose.dev.yml exec backend php artisan migrate`
3. Create controllers/models in `backend/app/`
4. Define API routes in `backend/routes/api.php`

### Frontend (Next.js)
1. Code changes trigger hot-reload automatically
2. Add new pages in `frontend/src/app/`
3. API calls should use `NEXT_PUBLIC_API_URL` environment variable

## Troubleshooting

### Container won't start
```bash
# Check logs
docker compose -f docker-compose.dev.yml logs

# Rebuild from scratch
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up -d --build
```

### Database connection issues
- Ensure MariaDB is healthy: `docker compose -f docker-compose.dev.yml ps`
- Check DB credentials in `.env` file
- Backend uses hostname `mariadb` (service name)

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` in `.env`
- Check backend is accessible: `curl http://localhost:8000/api`
- Ensure nginx service is running


docker build  --build-arg UID=1000 --build-arg GID=1000 -t shapp:test -f ./backend/docker/nginx/Dockerfile ./backend

2025/12/14 20:20:02 [emerg] 1#1: host not found in upstream "php-fpm" in /etc/nginx/nginx.conf:24
nginx: [emerg] host not found in upstream "php-fpm" in /etc/nginx/nginx.conf:24