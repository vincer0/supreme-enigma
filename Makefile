.PHONY: up-dev
up:
	docker-compose -f docker-compose.dev.yml up -d --build

.PHONY: up-prod
up-prod:
	docker-compose -f docker-compose.prod.yml up -d --build

