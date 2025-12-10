#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCKER_HUB_USER="${DOCKER_HUB_USER:-yakoubouldbouchiba}"
REGISTRY="${DOCKER_HUB_USER}"
BUILD_LOCAL="${BUILD_LOCAL:-false}"
PUSH_IMAGES="${PUSH_IMAGES:-false}"
BUILD_TIMEOUT="${BUILD_TIMEOUT:-1800}"
BUILD_FILTER=""

# Get the directory where this script is located and navigate to the repo root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT" || exit 1

# Get git branch name for tag (replace slashes with hyphens for Docker tag compatibility)
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
TAG="${GIT_BRANCH:-latest}"
# Docker tags can't have slashes, replace with hyphens
TAG=$(echo "$TAG" | sed 's/\//-/g')

# Function to print section headers
print_header() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo ""
}

# Function to print success messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error messages
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print warning messages
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Function to build a Docker image
build_image() {
    local name=$1
    local dockerfile_path=$2
    local image_base_name=$3

    print_header "Building $name"
    
    # Determine full image name
    local full_image_name=""
    if [ "$BUILD_LOCAL" = "true" ]; then
        full_image_name="${image_base_name}:${TAG}"
    else
        full_image_name="${REGISTRY}/${image_base_name}:${TAG}"
    fi

    echo "Building: ${full_image_name}"
    echo "From: ${dockerfile_path}"
    echo ""

    # Build with docker buildx and --load to avoid unpacking hang
    docker buildx build --load \
        -t "${full_image_name}" \
        "${dockerfile_path}" \
        2>&1

    if [ $? -eq 0 ]; then
        print_success "$name built successfully"
        return 0
    else
        print_error "$name build failed"
        return 1
    fi
}

# Function to push image to registry
push_image() {
    local image_name=$1
    
    if [ "$PUSH_IMAGES" != "true" ]; then
        print_warning "Skipping push (set PUSH_IMAGES=true to enable)"
        return 0
    fi

    echo "Pushing: ${image_name}"
    docker push "${image_name}"
    
    if [ $? -eq 0 ]; then
        print_success "Pushed ${image_name} successfully"
        return 0
    else
        print_error "Failed to push ${image_name}"
        return 1
    fi
}

# Main execution
main() {
    print_header "Docker Image Builder"
    
    echo "Configuration:"
    echo "  Git Branch: ${GIT_BRANCH}"
    echo "  Image Tag: ${TAG}"
    echo "  Registry: ${REGISTRY}"
    echo "  Build Local: ${BUILD_LOCAL}"
    echo "  Push Images: ${PUSH_IMAGES}"
    echo "  Timeout: ${BUILD_TIMEOUT}s"
    echo ""

    local failed_builds=()
    local successful_builds=()

    # Build Backend
    if [ -z "$BUILD_FILTER" ] || [[ "$BUILD_FILTER" == "backend" ]]; then
        if build_image "backend" "./backend" "baladia-api"; then
            successful_builds+=("backend")
        else
            failed_builds+=("backend")
        fi
    fi

    # Build Admin Portal
    if [ -z "$BUILD_FILTER" ] || [[ "$BUILD_FILTER" == "admin" ]]; then
        if build_image "admin" "./admin-portal" "baladia-admin"; then
            successful_builds+=("admin")
        else
            failed_builds+=("admin")
        fi
    fi

    # Build Website
    if [ -z "$BUILD_FILTER" ] || [[ "$BUILD_FILTER" == "site" ]]; then
        if build_image "site" "./my-site" "baladia-site"; then
            successful_builds+=("site")
        else
            failed_builds+=("site")
        fi
    fi

    # Build Nginx
    if [ -z "$BUILD_FILTER" ] || [[ "$BUILD_FILTER" == "nginx" ]]; then
        if build_image "nginx" "./nginx" "baladia-nginx"; then
            successful_builds+=("nginx")
        else
            failed_builds+=("nginx")
        fi
    fi

    # Summary
    print_header "Build Summary"
    
    if [ ${#successful_builds[@]} -gt 0 ]; then
        echo -e "${GREEN}Successfully built:${NC}"
        for build in "${successful_builds[@]}"; do
            echo -e "  ${GREEN}✓${NC} $build"
        done
    fi

    if [ ${#failed_builds[@]} -gt 0 ]; then
        echo -e "${RED}Failed builds:${NC}"
        for build in "${failed_builds[@]}"; do
            echo -e "  ${RED}✗${NC} $build"
        done
        echo ""
        print_error "Build process completed with errors"
        exit 1
    fi

    echo ""
    print_success "All images built successfully!"
    exit 0
}

# Show usage
usage() {
    cat << EOF
Docker Image Builder Script

Usage: ./build.images.sh [options]

Options:
    --local             Build images locally (no registry prefix)
    --push              Push images to registry after building
    --timeout SEC       Set build timeout in seconds (default: 1800)
    --only SERVICE      Build only a specific service (backend, admin, site, nginx)
    --help              Show this help message

Environment Variables:
    DOCKER_HUB_USER     Docker Hub username (default: yakoubouldbouchiba)
    BUILD_LOCAL         Build locally (default: false)
    PUSH_IMAGES         Push to registry (default: false)
    BUILD_TIMEOUT       Build timeout in seconds (default: 1800)

Examples:
    # Build all images locally
    ./build.images.sh --local

    # Build only backend service locally
    ./build.images.sh --local --only backend

    # Build and push to registry
    ./build.images.sh --push

    # Build with custom timeout
    ./build.images.sh --timeout 2400

EOF
}

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --local)
            BUILD_LOCAL="true"
            shift
            ;;
        --push)
            PUSH_IMAGES="true"
            shift
            ;;
        --timeout)
            BUILD_TIMEOUT="$2"
            shift 2
            ;;
        --only)
            BUILD_FILTER="$2"
            shift 2
            ;;
        --help)
            usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# Run main function
main
