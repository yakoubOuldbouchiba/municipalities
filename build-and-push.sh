#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Docker Hub username
DOCKER_HUB_USER="yakoubouldbouchiba"
REGISTRY="${DOCKER_HUB_USER}"

# Image names and tags
BACKEND_IMAGE="${REGISTRY}/baladia-api:latest"
ADMIN_IMAGE="${REGISTRY}/baladia-admin:latest"
SITE_IMAGE="${REGISTRY}/baladia-site:latest"
NGINX_IMAGE="${REGISTRY}/baladia-nginx:latest"

echo -e "${YELLOW}Starting Docker build and push process...${NC}"
echo ""

# Build Backend
echo -e "${YELLOW}Building Backend API...${NC}"
docker build -t ${BACKEND_IMAGE} ./backend
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend built successfully${NC}"
else
    echo -e "${RED}✗ Backend build failed${NC}"
    exit 1
fi

# Build Admin Portal
echo -e "${YELLOW}Building Admin Portal...${NC}"
docker build -t ${ADMIN_IMAGE} ./admin-portal
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Admin Portal built successfully${NC}"
else
    echo -e "${RED}✗ Admin Portal build failed${NC}"
    exit 1
fi

# Build Website
echo -e "${YELLOW}Building Website...${NC}"
docker build -t ${SITE_IMAGE} ./my-site
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Website built successfully${NC}"
else
    echo -e "${RED}✗ Website build failed${NC}"
    exit 1
fi

# Build Nginx
echo -e "${YELLOW}Building Nginx Reverse Proxy...${NC}"
docker build -t ${NGINX_IMAGE} ./nginx
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Nginx built successfully${NC}"
else
    echo -e "${RED}✗ Nginx build failed${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}All images built successfully!${NC}"
echo ""

# Check if user wants to push
read -p "Do you want to push images to Docker Hub? (yes/no) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Logging in to Docker Hub...${NC}"
    docker login -u ${DOCKER_HUB_USER}
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Docker Hub login failed${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${YELLOW}Pushing images to Docker Hub...${NC}"
    
    # Push Backend
    echo -e "${YELLOW}Pushing Backend API...${NC}"
    docker push ${BACKEND_IMAGE}
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Backend pushed successfully${NC}"
    else
        echo -e "${RED}✗ Backend push failed${NC}"
    fi
    
    # Push Admin
    echo -e "${YELLOW}Pushing Admin Portal...${NC}"
    docker push ${ADMIN_IMAGE}
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Admin Portal pushed successfully${NC}"
    else
        echo -e "${RED}✗ Admin Portal push failed${NC}"
    fi
    
    # Push Website
    echo -e "${YELLOW}Pushing Website...${NC}"
    docker push ${SITE_IMAGE}
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Website pushed successfully${NC}"
    else
        echo -e "${RED}✗ Website push failed${NC}"
    fi
    
    # Push Nginx
    echo -e "${YELLOW}Pushing Nginx...${NC}"
    docker push ${NGINX_IMAGE}
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Nginx pushed successfully${NC}"
    else
        echo -e "${RED}✗ Nginx push failed${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}All images pushed successfully!${NC}"
    echo ""
    echo -e "${YELLOW}Image URLs:${NC}"
    echo "  Backend:  https://hub.docker.com/r/${DOCKER_HUB_USER}/baladia-api"
    echo "  Admin:    https://hub.docker.com/r/${DOCKER_HUB_USER}/baladia-admin"
    echo "  Website:  https://hub.docker.com/r/${DOCKER_HUB_USER}/baladia-site"
    echo "  Nginx:    https://hub.docker.com/r/${DOCKER_HUB_USER}/baladia-nginx"
else
    echo -e "${YELLOW}Skipping Docker Hub push${NC}"
    echo ""
    echo -e "${YELLOW}To push images later, run:${NC}"
    echo "  docker push ${BACKEND_IMAGE}"
    echo "  docker push ${ADMIN_IMAGE}"
    echo "  docker push ${SITE_IMAGE}"
    echo "  docker push ${NGINX_IMAGE}"
fi
