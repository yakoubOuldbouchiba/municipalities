#!/bin/bash

# Baladia Docker Quick Start Guide
# This script helps you pull and run the Baladia project from Docker Hub

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║          Baladia Project - Docker Quick Start              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Pulling Docker images from Docker Hub...${NC}"
echo ""

# Pull images
docker pull yakoubouldbouchiba/baladia-api:latest
docker pull yakoubouldbouchiba/baladia-admin:latest
docker pull yakoubouldbouchiba/baladia-site:latest
docker pull yakoubouldbouchiba/baladia-nginx:latest

echo ""
echo -e "${GREEN}✓ All images pulled successfully!${NC}"
echo ""

# Display image information
echo -e "${YELLOW}Built Images:${NC}"
echo ""
docker images | grep "yakoubouldbouchiba/baladia"
echo ""

echo -e "${BLUE}Starting Baladia services with Docker Compose...${NC}"
echo ""

# Start with docker-compose (if docker-compose.yml exists)
if [ -f "docker-compose.yml" ]; then
    docker compose up -d
    echo ""
    echo -e "${GREEN}✓ All services started!${NC}"
    echo ""
    echo -e "${YELLOW}Access your application:${NC}"
    echo "  • Public Website: http://localhost/"
    echo "  • Admin Portal:   http://localhost/admin"
    echo "  • API Backend:    http://localhost/api"
    echo "  • MySQL:          localhost:3306"
    echo "  • Redis:          localhost:6379"
    echo "  • phpMyAdmin:     http://localhost:8080"
    echo "  • Redis Commander: http://localhost:8001"
    echo "  • Prometheus:     http://localhost:9090"
    echo "  • Grafana:        http://localhost:3001"
    echo ""
    echo -e "${YELLOW}View logs:${NC}"
    echo "  docker compose logs -f baladia-api"
    echo "  docker compose logs -f baladia-admin"
    echo "  docker compose logs -f baladia-site"
    echo ""
else
    echo -e "${YELLOW}docker-compose.yml not found in current directory${NC}"
    echo "Please run this script from the project root directory"
fi
