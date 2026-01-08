# Environment Variables Checklist

Quick reference for managing environment variables in this monorepo.

## ✅ Initial Setup Checklist

- [ ] Copy `.env.example` to `.env` in root
- [ ] Copy `backend/.env.example` to `backend/.env`
- [ ] Copy `frontend/.env.example` to `frontend/.env`
- [ ] Update `UID` and `GID` in root `.env` (run `id -u` and `id -g`)
- [ ] Generate `AUTH_SECRET` in `frontend/.env`: `openssl rand -base64 32`
- [ ] Run `make validate-env` to verify configuration
- [ ] Start services: `make updev`
- [ ] Generate Laravel key: `docker compose -f docker-compose.dev.yml exec backend php artisan key:generate`

## 🎯 Quick Decision Tree

**Adding a new environment variable? Ask:**

```
Is it for port mappings or Docker orchestration?
│
├─ YES → Add to ROOT .env
│         Example: FRONTEND_PORT, NGINX_APP_PORT
│
└─ NO → Is it for Laravel/PHP?
        │
        ├─ YES → Add to backend/.env
        │         Example: DB_HOST, DB_PORT, APP_KEY
        │
        └─ NO → Is it for Next.js?
                │
                ├─ YES → Add to frontend/.env
                │         Example: NEXT_PUBLIC_API_URL, AUTH_SECRET
                │
                └─ NO → Is it for K8s deployment?
                        │
                        └─ YES → Add to k8s/ ConfigMap or Secret
```
