.PHONY: updev
updev:
	docker-compose -f docker-compose.dev.yml up -d --build

.PHONY: ddev
ddev:
	docker-compose -f docker-compose.dev.yml down

