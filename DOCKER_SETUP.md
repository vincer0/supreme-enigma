# Shopping List - Docker Setup

## Architecture

This docker-compose setup runs the complete development environment with:

- **Frontend**: Next.js app (port 3000)
  - Hot-reload enabled for development
  - Communicates with backend via API
  
- **Backend**: Laravel API via Nginx + PHP-FPM
  - Nginx (port 8001) - HTTP server
  - PHP-FPM (port 9000) - PHP processor with Xdebug support
  
- **Database**: MariaDB 11.7.2 (port 3306)
  - Persistent data storage
  - Health checks enabled
  
- **Cache**: Redis Alpine (port 6379)
  - Session and cache storage
  - Health checks enabled

All services run in an isolated `shopping_network` bridge network.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose V2+
- Your host user UID/GID (usually 1000)

## Setup Instructions

### 1. Environment Configuration

Create environment files from examples:

```bash
# Root environment (docker-compose settings)
cp .env.example .env

# Backend environment (Laravel configuration)
cp backend/.env.example backend/.env

# Frontend environment (Next.js configuration)  
cp frontend/.env.example frontend/.env
```

### 2. Configure Environment Variables

Edit `.env` to match your needs:
- `FRONTEND_PORT` - Frontend port (default: 3000)
- `NGINX_APP_PORT` - Backend API port (default: 8001)
- `UID` and `GID` - Your user/group IDs (run `id -u` and `id -g`)

Edit `backend/.env`:
- `DB_HOST=mariadb` (use container name, not 127.0.0.1)
- `REDIS_HOST=redis` (use container name, not 127.0.0.1)
- Set database credentials (DB_DATABASE, DB_USERNAME, DB_PASSWORD)

Edit `frontend/.env`:
- `NEXT_PUBLIC_API_URL=http://localhost:8001/api` (match NGINX_APP_PORT)

### 3. Start the Environment

Using Makefile (recommended):
```bash
make updev
```

Or using docker-compose directly:
```bash
docker compose -f docker-compose.dev.yml up -d --build
```

### 4. Initialize Laravel Application

```bash
# Generate application key
docker compose -f docker-compose.dev.yml exec backend php artisan key:generate

# Run database migrations
docker compose -f docker-compose.dev.yml exec backend php artisan migrate

# (Optional) Seed database
docker compose -f docker-compose.dev.yml exec backend php artisan db:seed
```

### 5. Verify Installation

Check all services are running:
```bash
docker compose -f docker-compose.dev.yml ps
```

Test the endpoints:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001/api

## Services Access

| Service | URL/Host | Port |
|---------|----------|------|
| Frontend | http://localhost:3000 | 3000 |
| Backend API | http://localhost:8001/api | 8001 |
| Database (from host) | localhost | 3306 |
| Database (from containers) | mariadb | 3306 |
| Redis (from host) | localhost | 6379 |
| Redis (from containers) | redis | 6379 |

## Architecture Details

### Multi-Stage Backend Build
- **Production stage**: Optimized PHP-FPM without dev tools
- **Development stage**: Includes Xdebug for debugging
- Build target is controlled by `target: development` in docker-compose

### Xdebug Configuration
Enabled by default in development. Configure via environment variables:
- `XDEBUG_ENABLED=true` - Enable/disable Xdebug
- `XDEBUG_MODE=debug,develop` - Xdebug modes
- `XDEBUG_HOST=host.docker.internal` - IDE connection host
- `XDEBUG_IDE_KEY=DOCKER` - IDE key for debugging

### Volume Mounts
- **Frontend**: `src/` and `public/` are mounted for hot-reload
- **Backend**: Entire `backend/` directory mounted to `/var/www`
- **Excluded**: `node_modules` and `vendor` use internal volumes
- **Persistent**: `mariadb_data` and `redis_data` volumes for data

### User Permissions
Backend container runs with your host UID/GID to prevent permission issues:
```bash
# Find your IDs
id -u  # Usually 1000
id -g  # Usually 1000
```

## Common Commands

### Using Makefile

```bash
# Start all services
make updev

# Stop all services
make ddev

# Access backend shell
make dbash
```

### Using Docker Compose Directly

```bash
# Start services
docker compose -f docker-compose.dev.yml up -d

# Start with rebuild
docker compose -f docker-compose.dev.yml up -d --build

# Stop services
docker compose -f docker-compose.dev.yml down

# Stop and remove volumes (⚠️ deletes all data)
docker compose -f docker-compose.dev.yml down -v

# View all logs
docker compose -f docker-compose.dev.yml logs -f

# View specific service logs
docker compose -f docker-compose.dev.yml logs -f backend
docker compose -f docker-compose.dev.yml logs -f frontend
docker compose -f docker-compose.dev.yml logs -f nginx

# Check service status
docker compose -f docker-compose.dev.yml ps

# Restart a specific service
docker compose -f docker-compose.dev.yml restart backend
```

### Laravel Artisan Commands

```bash
# Run migrations
docker compose -f docker-compose.dev.yml exec backend php artisan migrate

# Rollback migrations
docker compose -f docker-compose.dev.yml exec backend php artisan migrate:rollback

# Create migration
docker compose -f docker-compose.dev.yml exec backend php artisan make:migration create_items_table

# Create model with migration
docker compose -f docker-compose.dev.yml exec backend php artisan make:model Item -m

# Create controller
docker compose -f docker-compose.dev.yml exec backend php artisan make:controller ItemController

# Clear caches
docker compose -f docker-compose.dev.yml exec backend php artisan cache:clear
docker compose -f docker-compose.dev.yml exec backend php artisan config:clear
docker compose -f docker-compose.dev.yml exec backend php artisan route:clear

# Run tests
docker compose -f docker-compose.dev.yml exec backend php artisan test
```

### Frontend NPM Commands

```bash
# Install dependencies
docker compose -f docker-compose.dev.yml exec frontend npm install

# Add package
docker compose -f docker-compose.dev.yml exec frontend npm install <package-name>

# Run Next.js build
docker compose -f docker-compose.dev.yml exec frontend npm run build
```

### Database Access

```bash
# Access MariaDB CLI
docker compose -f docker-compose.dev.yml exec mariadb mariadb -u root -p

# Import SQL dump
docker compose -f docker-compose.dev.yml exec -T mariadb mariadb -u root -p<password> <database> < dump.sql

# Export database
docker compose -f docker-compose.dev.yml exec mariadb mariadb-dump -u root -p<password> <database> > dump.sql
```

### Shell Access

```bash
# Backend (bash)
docker compose -f docker-compose.dev.yml exec backend bash

# Frontend (sh - Alpine)
docker compose -f docker-compose.dev.yml exec frontend sh

# Nginx (sh - Alpine)
docker compose -f docker-compose.dev.yml exec nginx sh
```

## Development Workflow

### Backend Development (Laravel)

1. **Code Changes**: Automatically reflected via volume mount (`./backend:/var/www`)

2. **Database Migrations**:
   ```bash
   # Create migration
   docker compose -f docker-compose.dev.yml exec backend php artisan make:migration create_items_table
   
   # Run migrations
   docker compose -f docker-compose.dev.yml exec backend php artisan migrate
   ```

3. **API Development**:
   - Create controllers in `backend/app/Http/Controllers/`
   - Define routes in `backend/routes/api.php`
   - Create models in `backend/app/Models/`

4. **Testing**:
   ```bash
   docker compose -f docker-compose.dev.yml exec backend php artisan test
   ```

### Frontend Development (Next.js)

1. **Code Changes**: Hot-reload automatically watches `src/` directory

2. **API Configuration**: Use environment variable for API endpoint:
   ```typescript
   const API_URL = process.env.NEXT_PUBLIC_API_URL; // http://localhost:8001/api
   ```

3. **Page Development**:
   - Add pages in `frontend/src/app/`
   - Components in `frontend/src/components/`
   - API calls should use `NEXT_PUBLIC_API_URL`

4. **Dependencies**:
   ```bash
   docker compose -f docker-compose.dev.yml exec frontend npm install <package>
   ```

### Debugging with Xdebug

1. Configure your IDE to listen on port 9003
2. Set IDE key to `DOCKER` (or update `XDEBUG_IDE_KEY` in `.env`)
3. Set breakpoints in your PHP code
4. The backend container is configured with `host.docker.internal:host-gateway`

## Troubleshooting

### Services Won't Start

```bash
# Check service status and health
docker compose -f docker-compose.dev.yml ps

# View logs for errors
docker compose -f docker-compose.dev.yml logs

# Check specific service
docker compose -f docker-compose.dev.yml logs backend
```

### Complete Rebuild

```bash
# Stop and remove everything
docker compose -f docker-compose.dev.yml down -v

# Rebuild from scratch
docker compose -f docker-compose.dev.yml up -d --build

# Re-initialize Laravel
docker compose -f docker-compose.dev.yml exec backend php artisan key:generate
docker compose -f docker-compose.dev.yml exec backend php artisan migrate
```

### Database Connection Issues

**Symptoms**: `SQLSTATE[HY000] [2002] Connection refused`

**Solutions**:
1. Verify MariaDB is healthy:
   ```bash
   docker compose -f docker-compose.dev.yml ps mariadb
   ```

2. Check `backend/.env` uses correct hostname:
   ```
   DB_HOST=mariadb  # NOT 127.0.0.1
   ```

3. Wait for health check to pass (can take 10-30 seconds on first start)

4. Verify credentials match in `backend/.env`:
   ```
   DB_DATABASE=your_database
   DB_USERNAME=your_user
   DB_PASSWORD=your_password
   ```

### Frontend Can't Connect to Backend

**Symptoms**: Network errors, CORS issues

**Solutions**:
1. Verify backend is accessible:
   ```bash
   curl http://localhost:8001/api
   ```

2. Check `frontend/.env` or `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8001/api
   ```

3. Ensure Nginx is running:
   ```bash
   docker compose -f docker-compose.dev.yml ps nginx
   ```

4. Check CORS configuration in `backend/config/cors.php`

### Permission Issues

**Symptoms**: Cannot write to logs, storage, cache

**Solutions**:
1. Verify your UID/GID in `.env` matches your host:
   ```bash
   id -u  # Should match UID in .env
   id -g  # Should match GID in .env
   ```

2. Fix permissions on host:
   ```bash
   sudo chown -R $USER:$USER backend/storage backend/bootstrap/cache
   chmod -R 775 backend/storage backend/bootstrap/cache
   ```

3. Rebuild backend with correct UID/GID:
   ```bash
   docker compose -f docker-compose.dev.yml up -d --build backend
   ```

### Xdebug Not Working

**Solutions**:
1. Verify Xdebug is enabled in `.env`:
   ```
   XDEBUG_ENABLED=true
   ```

2. Check Xdebug status:
   ```bash
   docker compose -f docker-compose.dev.yml exec backend php -v
   ```

3. Verify IDE is listening on port 9003

4. Check `host.docker.internal` is reachable from container:
   ```bash
   docker compose -f docker-compose.dev.yml exec backend ping -c 1 host.docker.internal
   ```

### Port Already in Use

**Symptoms**: `bind: address already in use`

**Solutions**:
1. Check what's using the port:
   ```bash
   sudo lsof -i :3000  # or :8001, :3306, etc.
   ```

2. Change port in `.env`:
   ```
   FRONTEND_PORT=3001
   NGINX_APP_PORT=8002
   ```

3. Stop conflicting service or use different ports

### Clear All Docker Resources

⚠️ **Warning**: This will remove ALL Docker containers, images, and volumes

```bash
# Stop this project
docker compose -f docker-compose.dev.yml down -v

# Prune everything (use with caution)
docker system prune -a --volumes
```

## Quick Reference

### Environment Files
- `.env` - Docker Compose configuration (ports, UID/GID)
- `backend/.env` - Laravel configuration (database, cache, app settings)
- `frontend/.env` - Next.js configuration (API URL)

### Container Names
- `shopping-list-frontend` - Next.js development server
- `shopping-list-backend` - PHP-FPM with Xdebug
- `shopping-list-nginx` - HTTP server for Laravel API
- `shopping-list-mariadb` - Database server
- `shopping-list-redis` - Cache server

### Default Ports
- `3000` - Frontend (Next.js)
- `8001` - Backend API (Nginx)
- `9000` - PHP-FPM (internal)
- `3306` - MariaDB
- `6379` - Redis

### Key Directories
- `frontend/src/` - Next.js source code
- `backend/app/` - Laravel application code
- `backend/routes/api.php` - API route definitions
- `backend/database/migrations/` - Database migrations
- `backend/storage/logs/` - Application logs

### Network
- Name: `shopping_network`
- Type: bridge
- Internal hostnames: `frontend`, `backend`, `nginx`, `mariadb`, `redis`

### Persistent Volumes
- `mariadb_data` - Database files
- `redis_data` - Cache data