.PHONY: updev
updev:
	docker-compose -f docker-compose.dev.yml up -d --build

.PHONY: ddev
ddev:
	docker-compose -f docker-compose.dev.yml down

.PHONY: dbash
dbash:
	docker compose -f docker-compose.dev.yml exec backend bash

.PHONY: validate-env
validate-env:
	@./scripts/validate-env.sh

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  updev        - Start development environment"
	@echo "  ddev         - Stop development environment"
	@echo "  dbash        - Open bash in backend container"
	@echo "  validate-env - Validate environment variable configuration"
	@echo "  help         - Show this help message"