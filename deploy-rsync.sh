#!/bin/bash

# AI Workshop Switzerland - Rsync-based VPS Deployment Script
# This script uses rsync for efficient, incremental deployments

set -e

echo "🚀 Starting rsync-based VPS deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - VPS Details
VPS_HOST="128.65.199.142"         # Your VPS IP address
VPS_USER="ubuntu"                 # SSH username
VPS_PATH="/var/www/aiworkshop" # Web root directory
SSH_KEY="~/.ssh/gcloud-key2"      # SSH key path
PROJECT_NAME="aiworkshop-ch"

# Rsync options
RSYNC_OPTIONS="-avz --delete --progress"

echo -e "${BLUE}📦 Building project for production...${NC}"
npm run build

echo -e "${BLUE}🔍 Prerendering static HTML for all languages...${NC}"
npm run prerender

echo -e "${BLUE}🗺️  Generating sitemap with hreflang alternates...${NC}"
npm run sitemap

echo -e "${BLUE}📁 Creating deployment directory...${NC}"
rm -rf deploy
mkdir -p deploy

# Copy built assets from build/ to deploy/
echo -e "${BLUE}📦 Copying built assets...${NC}"
cp -r build/* deploy/

# Merge prerendered pages and sitemap from public/ into deploy/
echo -e "${BLUE}🔍 Merging prerendered pages and sitemap...${NC}"
if [ -d "public" ]; then
    # Copy language directories (en, de, fr, it) and their prerendered HTML
    for lang in en de fr it; do
        if [ -d "public/$lang" ]; then
            cp -r "public/$lang" deploy/
        fi
    done
    
    # Copy sitemap and robots.txt
    [ -f "public/sitemap.xml" ] && cp "public/sitemap.xml" deploy/
    [ -f "public/robots.txt" ] && cp "public/robots.txt" deploy/
fi

echo -e "${BLUE}📝 Creating deployment information...${NC}"
cat > deploy/deployment-info.txt << EOF
AI Workshop Switzerland - Rsync Deployment
=========================================
Build Date: $(date)
Git Commit: $(git rev-parse HEAD)
Git Branch: $(git branch --show-current)
Build Size: $(du -sh public | cut -f1)
Files Count: $(find public -type f | wc -l)
Deployment Method: rsync

Rsync Benefits:
- Incremental updates (only changed files)
- Faster deployment times
- Atomic updates with --delete
- Progress monitoring
EOF

echo -e "${BLUE}📤 Syncing to VPS using rsync...${NC}"
rsync $RSYNC_OPTIONS \
    -e "ssh -i $SSH_KEY" \
    deploy/ \
    $VPS_USER@$VPS_HOST:$VPS_PATH/

echo -e "${BLUE}🔧 Setting proper permissions on VPS...${NC}"
ssh -i $SSH_KEY $VPS_USER@$VPS_HOST "
    sudo chown -R www-data:www-data $VPS_PATH
    sudo chmod -R 755 $VPS_PATH
    echo 'Permissions updated successfully'
"

echo -e "${GREEN}✅ Rsync deployment completed successfully!${NC}"
echo -e "${YELLOW}📋 Deployment Summary:${NC}"
echo -e "  - Method: rsync (incremental)"
echo -e "  - Target: $VPS_USER@$VPS_HOST:$VPS_PATH"
echo -e "  - Build size: $(du -sh deploy | cut -f1)"
echo -e "  - Files deployed: $(find deploy -type f | wc -l)"
echo ""
echo -e "${GREEN}🎉 Your site has been updated efficiently!${NC}"

# Optional: Show rsync statistics
echo -e "${BLUE}📊 Rsync completed with optimized file transfer${NC}"
