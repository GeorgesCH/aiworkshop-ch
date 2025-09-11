#!/bin/bash

# AI Workshop Switzerland - Simple VPS Deployment Script
# Quick deployment without Nginx configuration

set -e  # Exit on any error

echo "🚀 Starting simple VPS deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
VPS_HOST="${1:-your-vps-host.com}"
VPS_USER="${2:-root}"
VPS_PATH="${3:-/var/www/aiworkshop.ch}"

# Validate VPS configuration
if [ "$VPS_HOST" = "your-vps-host.com" ]; then
    print_error "Please provide your VPS hostname/IP as the first argument:"
    print_error "Usage: ./deploy-simple.sh your-vps-host.com [username] [path]"
    print_error "Example: ./deploy-simple.sh 192.168.1.100 root /var/www/aiworkshop.ch"
    exit 1
fi

print_status "Deployment configuration:"
print_status "  VPS Host: $VPS_HOST"
print_status "  VPS User: $VPS_USER"
print_status "  VPS Path: $VPS_PATH"

# Test SSH connection
print_status "Testing SSH connection..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes "$VPS_USER@$VPS_HOST" exit 2>/dev/null; then
    print_error "Cannot connect to $VPS_USER@$VPS_HOST"
    print_error "Please ensure SSH key is set up for passwordless access"
    exit 1
fi
print_success "SSH connection successful"

# Build the project
print_status "Building project..."
npm run build

# Post-build fixes
if [ -f "dist/index.html" ]; then
    sed -i '' 's|<link rel="modulepreload" href="data:application/octet-stream;base64,[^"]*">||g' dist/index.html
    sed -i '' 's|<link rel="modulepreload" href="data:[^"]*">||g' dist/index.html
    sed -i '' 's|crossorigin>|crossorigin="anonymous">|g' dist/index.html
fi

# Create backup on VPS
print_status "Creating backup..."
ssh "$VPS_USER@$VPS_HOST" "
    if [ -d '$VPS_PATH' ]; then
        sudo cp -r '$VPS_PATH' '$VPS_PATH.backup.$(date +%Y%m%d_%H%M%S)'
    fi
    sudo mkdir -p '$VPS_PATH'
    sudo chown -R $VPS_USER:$VPS_USER '$VPS_PATH'
"

# Deploy files
print_status "Deploying files..."
rsync -avz --delete dist/ "$VPS_USER@$VPS_HOST:$VPS_PATH/"

# Set permissions
print_status "Setting permissions..."
ssh "$VPS_USER@$VPS_HOST" "
    sudo chown -R www-data:www-data '$VPS_PATH'
    sudo chmod -R 755 '$VPS_PATH'
"

print_success "Simple deployment completed!"
print_status "Files deployed to: $VPS_PATH"
print_status "Make sure your web server is configured to serve from this directory"
