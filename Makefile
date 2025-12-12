
# Makefile for Delineate Hackathon Challenge

# Variables
COMPOSE_FILE := docker/compose.dev.yml
PROJECT_NAME := delineate

.PHONY: help up down restart logs ps clean test initiate-download check-download start-download

help:
	@echo "Available commands:"
	@echo "  make up       - Start all services (detached mode)"
	@echo "  make down     - Stop and remove containers"
	@echo "  make restart  - Restart all services"
	@echo "  make logs     - View logs from all services"
	@echo "  make ps       - List running containers"
	@echo "  make clean    - Stop containers and remove volumes"
	@echo "  make test     - Run tests (if applicable)"

up:
	docker compose -f $(COMPOSE_FILE) up -d --build --remove-orphans

down:
	docker compose -f $(COMPOSE_FILE) down

restart: down up

logs:
	docker compose -f $(COMPOSE_FILE) logs -f

ps:
	docker compose -f $(COMPOSE_FILE) ps

clean:
	docker compose -f $(COMPOSE_FILE) down -v

# Utility commands for testing endpoints
initiate-download:
	curl -X POST http://localhost:3000/v1/download/initiate \
		-H "Content-Type: application/json" \
		-d '{"file_ids": [10001, 10002]}'

check-download:
	curl -X POST http://localhost:3000/v1/download/check \
		-H "Content-Type: application/json" \
		-d '{"file_id": 10001}'

start-download:
	curl -X POST http://localhost:3000/v1/download/start \
		-H "Content-Type: application/json" \
		-d '{"file_id": 10001}'
