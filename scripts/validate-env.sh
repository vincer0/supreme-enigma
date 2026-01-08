#!/bin/bash
# Validates environment variable consistency across the monorepo

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Validating environment variables..."
echo ""

# Check if .env files exist
if [ ! -f .env ]; then
    echo -e "${RED}❌ Root .env file not found${NC}"
    exit 1
fi

if [ ! -f backend/.env ]; then
    echo -e "${RED}❌ Backend .env file not found${NC}"
    exit 1
fi

if [ ! -f frontend/.env ]; then
    echo -e "${RED}❌ Frontend .env file not found${NC}"
    exit 1
fi

# Load root .env (carefully avoiding readonly variables)
export $(grep -v '^#' .env | grep -v '^$' | grep -v '^UID=' | grep -v '^GID=' | xargs)

# Validate port definitions
echo "📋 Checking port definitions..."
errors=0

check_var() {
    local var_name=$1
    local var_value=${!var_name}
    
    if [ -z "$var_value" ]; then
        echo -e "${RED}❌ $var_name is not set in root .env${NC}"
        ((errors++))
    else
        echo -e "${GREEN}✓${NC} $var_name = $var_value"
    fi
}

# Check required root env vars
check_var "FRONTEND_PORT"
check_var "NGINX_APP_PORT"
check_var "FPM_APP_PORT"
check_var "DB_PORT"
check_var "REDIS_PORT"

echo ""
echo "🔗 Checking cross-references..."

# Check backend .env for internal Docker networking
if grep -q "DB_HOST=127.0.0.1" backend/.env; then
    echo -e "${RED}❌ backend/.env uses DB_HOST=127.0.0.1 instead of Docker service name 'mariadb'${NC}"
    ((errors++))
elif grep -q "DB_HOST=mariadb" backend/.env; then
    echo -e "${GREEN}✓${NC} backend/.env correctly uses Docker service name for DB_HOST"
else
    echo -e "${YELLOW}⚠${NC}  Could not verify DB_HOST in backend/.env"
fi

if grep -q "REDIS_HOST=127.0.0.1" backend/.env; then
    echo -e "${RED}❌ backend/.env uses REDIS_HOST=127.0.0.1 instead of Docker service name 'redis'${NC}"
    ((errors++))
elif grep -q "REDIS_HOST=redis" backend/.env; then
    echo -e "${GREEN}✓${NC} backend/.env correctly uses Docker service name for REDIS_HOST"
else
    echo -e "${YELLOW}⚠${NC}  Could not verify REDIS_HOST in backend/.env"
fi

# Check if backend .env has internal port mappings
if grep -q "DB_PORT=3306" backend/.env; then
    echo -e "${GREEN}✓${NC} backend/.env uses internal Docker port 3306 for database"
else
    echo -e "${YELLOW}⚠${NC}  backend/.env might not be using internal Docker port 3306"
fi

if grep -q "REDIS_PORT=6379" backend/.env; then
    echo -e "${GREEN}✓${NC} backend/.env uses internal Docker port 6379 for Redis"
else
    echo -e "${YELLOW}⚠${NC}  backend/.env might not be using internal Docker port 6379"
fi

echo ""
echo "📊 Summary:"
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✅ All environment variable validations passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $errors error(s) in environment configuration${NC}"
    exit 1
fi
