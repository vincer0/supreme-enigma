# Shopping List Application

A full-stack shopping list application built with Laravel (backend) and Next.js (frontend), containerized with Docker and ready for Kubernetes deployment.

## 🏗️ Project Structure

This is a monorepo containing:

- **`backend/`** - Laravel API
- **`frontend/`** - Next.js web application  
- **`k8s/`** - Kubernetes deployment manifests
- **`scripts/`** - Utility scripts

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Make (optional, but recommended)

### Setup

1. **Copy environment files:**
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. **Generate Laravel app key:**
   ```bash
   # Will be done automatically on first run, or manually:
   docker compose -f docker-compose.dev.yml exec backend php artisan key:generate
   ```

3. **Validate environment configuration:**
   ```bash
   make validate-env
   ```

4. **Start the development environment:**
   ```bash
   make updev
   # or
   docker compose -f docker-compose.dev.yml up -d --build
   ```

5. **Run migrations:**
   ```bash
   docker compose -f docker-compose.dev.yml exec backend php artisan migrate
   ```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8001/api
- **Database:** localhost:3307 (user: `shapp`, password: `password`)

## 📖 Documentation

### Environment Variables
- **[ENV_STRATEGY.md](ENV_STRATEGY.md)** - Decision rationale: why separate env files?
- **[ENV_GUIDE.md](ENV_GUIDE.md)** - Complete environment variables reference
- **[ENV_DIAGRAM.md](ENV_DIAGRAM.md)** - Visual architecture diagrams

### Docker & Deployment
- **[DOCKER_SETUP.md](DOCKER_SETUP.md)** - Docker configuration details
- **[AGENTS.md](AGENTS.md)** - Development agents/tools

## 🛠️ Available Commands

```bash
make updev        # Start development environment
make ddev         # Stop development environment
make dbash        # Open bash in backend container
make validate-env # Validate environment configuration
make help         # Show all available commands
```

## 🏛️ Architecture

### Development (Docker Compose)

```
Frontend (Next.js)    →  Nginx  →  Backend (Laravel + PHP-FPM)
     :3000                :8001            :9000
                                              ↓
                                         MariaDB :3306
                                         Redis :6379
```

### Key Design Decisions

1. **Environment Variables**: Multi-layered approach
   - Root `.env`: Docker Compose orchestration (port mappings)
   - Service `.env` files: Application configuration (portable)
   - See [ENV_STRATEGY.md](ENV_STRATEGY.md) for details

2. **Internal Networking**: Services use Docker service names
   - Backend connects to `mariadb:3306` (not `localhost:3307`)
   - Frontend connects to `http://nginx/api` (not `http://localhost:8001`)

3. **Port Mappings**: Host ports != Container ports (by design)
   - Host: `localhost:3307` → Container: `mariadb:3306`
   - Host: `localhost:8001` → Container: `nginx:80`

## 🧪 Development

### Backend (Laravel)

```bash
# Access backend container
make dbash

# Run migrations
php artisan migrate

# Run tests
php artisan test

# Clear cache
php artisan cache:clear
```

### Frontend (Next.js)

```bash
# Access frontend container
docker compose -f docker-compose.dev.yml exec frontend sh

# Install dependencies
npm install

# Run tests
npm test
```

### Database

```bash
# Connect to database from host
mysql -h 127.0.0.1 -P 3307 -u shapp -p
# Password: password

# From within backend container
php artisan db
```

## 📦 Production Deployment

### Kubernetes

```bash
# Apply manifests
kubectl apply -f k8s/

# Check status
kubectl get pods
kubectl get services
```

See individual K8s manifests in `k8s/` directory for configuration details.

## 🔒 Security

- Never commit actual `.env` files (only `.env.example`)
- Rotate `AUTH_SECRET` and `APP_KEY` for each environment
- Use secrets management in production (K8s Secrets, Vault, etc.)
- See [ENV_GUIDE.md](ENV_GUIDE.md) for security best practices

## 🐛 Troubleshooting

### Port Already in Use

Edit root `.env` and change conflicting ports:
```dotenv
FRONTEND_PORT=3001  # Changed from 3000
NGINX_APP_PORT=8002 # Changed from 8001
DB_PORT=3308        # Changed from 3307
```

### Database Connection Refused

1. Ensure backend `.env` uses Docker service name:
   ```dotenv
   DB_HOST=mariadb  # NOT localhost or 127.0.0.1
   DB_PORT=3306     # Internal port, NOT 3307
   ```

2. Run validation:
   ```bash
   make validate-env
   ```

### Container Won't Start

```bash
# Check logs
docker compose -f docker-compose.dev.yml logs backend
docker compose -f docker-compose.dev.yml logs frontend

# Rebuild from scratch
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up --build
```

## 📚 Tech Stack

- **Backend**: Laravel 11, PHP 8.3, MariaDB 11.7, Redis
- **Frontend**: Next.js 15, React 19, TypeScript
- **Infrastructure**: Docker, Docker Compose, Kubernetes
- **Development**: Xdebug, Hot Module Replacement

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run validation: `make validate-env`
4. Test in Docker environment
5. Submit a pull request

## 📄 License

[Your license here]

## 🔗 Related Documentation

- [Environment Variables Strategy](ENV_STRATEGY.md)
- [Environment Variables Guide](ENV_GUIDE.md)
- [Architecture Diagrams](ENV_DIAGRAM.md)
- [Docker Setup](DOCKER_SETUP.md)
