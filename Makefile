COMPOSE := docker compose -f docker-compose.prod.yml

.PHONY: build up deploy down restart logs status

build:
	$(COMPOSE) build

up:
	$(COMPOSE) up -d

deploy:
	$(COMPOSE) up -d --build --remove-orphans

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart

logs:
	$(COMPOSE) logs -f --tail=100

status:
	$(COMPOSE) ps
