## 🏗️ Project Structure

This is a monorepo containing:

- **`backend/`** - Laravel API
- **`frontend/`** - Next.js web application  
- **`k8s/`** - Kubernetes deployment manifests
- **`scripts/`** - Utility scripts

### Prerequisites

- Docker & Docker Compose
- Make (optional, but recommended)

## 🏛️ Architecture

### Development (Docker Compose)

```
Frontend (Next.js)    →  Nginx  →  Backend (Laravel + PHP-FPM)
     :3000                :8001            :9000
                                              ↓
                                         MariaDB :3306
                                         Redis :6379
```

## 📦 Production Deployment

### Kubernetes

TBD
