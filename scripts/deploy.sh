#!/bin/bash
set -e

echo "Starting deployment..."

# Navigate to project directory (optional, if script is run from outside)
# cd /path/to/project

# Check for .env file
if [ ! -f .env ]; then
  echo "Warning: .env file not found. Ensure environment variables are set."
fi

# Pull the latest images defined in compose.prod.yml
echo "Pulling latest images..."
docker compose -f docker/compose.prod.yml pull

# Start services in detached mode
echo "Starting services..."
docker compose -f docker/compose.prod.yml up -d --remove-orphans

# Clean up unused images to save space
echo "Pruning unused images..."
docker image prune -f

echo "Deployment completed successfully!"
