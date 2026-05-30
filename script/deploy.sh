#!/bin/bash
set -e

echo "Starting deployment..."

# Load environment variables if .env file exists
if [ -f .env ]; then
    echo "Loading environment variables from .env"
    export $(cat .env | grep -v '^#' | xargs)
fi

# Stop existing containers
echo "Stopping existing containers..."
sudo docker compose down || true

# Start containers
echo "Building and starting containers..."
sudo docker compose up -d --build

# Show running containers
echo "Deployment complete!"
echo ""
echo "Running containers:"
sudo docker compose ps

echo ""
echo "View logs with:"
echo "   sudo docker compose logs -f"
