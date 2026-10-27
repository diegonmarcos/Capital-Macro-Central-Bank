#!/bin/bash
# Build script for Central Bank Modeling System (SCSS version)
# Usage: ./build_scss.sh [dev|watch|build]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Check if sass is installed
if ! npm list sass &>/dev/null; then
    echo "Installing sass..."
    npm install --save-dev sass
fi

case "${1:-build}" in
    dev)
        echo "Starting development server (SCSS)..."
        npx vite --config vite.config.scss.ts
        ;;
    watch)
        echo "Starting development server with watch mode (SCSS)..."
        npx vite --config vite.config.scss.ts
        ;;
    build)
        echo "Building production bundle (SCSS)..."
        npx tsc --noEmit
        npx vite build --config vite.config.scss.ts
        echo "Build complete! Output in dist_scss/"
        echo "Single-file HTML generated."
        ;;
    *)
        echo "Usage: $0 [dev|watch|build]"
        echo "  dev    - Start development server"
        echo "  watch  - Start development server (alias for dev)"
        echo "  build  - Build production bundle (default)"
        exit 1
        ;;
esac
