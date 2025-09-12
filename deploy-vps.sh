#!/bin/bash

# AI Workshop Switzerland - Full VPS Deployment Script
# This script performs a complete deployment including build, upload, and server setup

set -e

echo "🚀 Starting full VPS deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - VPS Details
VPS_HOST="128.65.199.142"         # Your VPS IP address
VPS_USER="ubuntu"                 # SSH username
VPS_PATH="/var/www/aiworkshop.ch" # Web root directory
SSH_KEY="~/.ssh/gcloud-key2"      # SSH key path
PROJECT_NAME="aiworkshop-ch"

echo -e "${BLUE}📦 Building project for production...${NC}"
npm run build

echo -e "${BLUE}📁 Creating deployment directory...${NC}"
rm -rf deploy
mkdir -p deploy
cp -r build/* deploy/

echo -e "${BLUE}📝 Creating deployment information...${NC}"
cat > deploy/deployment-info.txt << EOF
AI Workshop Switzerland - Deployment Package
===========================================
Build Date: $(date)
Git Commit: $(git rev-parse HEAD)
Git Branch: $(git branch --show-current)
Build Size: $(du -sh build | cut -f1)
Files Count: $(find build -type f | wc -l)

Deployment Instructions:
1. Upload the contents of this directory to your VPS web root
2. Configure your web server (Nginx/Apache) to serve static files
3. Set up SSL certificate for HTTPS
4. Configure proper MIME types for .woff2, .woff, .ttf files
5. Set up gzip compression for better performance

Server Configuration:
- Document Root: Point to this directory
- Index File: index.html
- Fallback: All routes should serve index.html (SPA routing)
- Cache Headers: Set appropriate cache headers for assets

Required Nginx Configuration:
location / {
    try_files \$uri \$uri/ /index.html;
}

location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
EOF

echo -e "${BLUE}🗜️  Creating deployment archive...${NC}"
tar -czf ${PROJECT_NAME}-deploy.tar.gz -C deploy .

echo -e "${BLUE}📤 Uploading to VPS...${NC}"
scp -i $SSH_KEY ${PROJECT_NAME}-deploy.tar.gz $VPS_USER@$VPS_HOST:/tmp/

echo -e "${BLUE}📋 Extracting on VPS...${NC}"
ssh -i $SSH_KEY $VPS_USER@$VPS_HOST "
    sudo mkdir -p $VPS_PATH
    sudo chown -R $VPS_USER:$VPS_USER $VPS_PATH
    cd $VPS_PATH
    sudo tar -xzf /tmp/${PROJECT_NAME}-deploy.tar.gz
    sudo chown -R www-data:www-data $VPS_PATH
    sudo chmod -R 755 $VPS_PATH
    rm /tmp/${PROJECT_NAME}-deploy.tar.gz
"

echo -e "${GREEN}✅ Full deployment completed successfully!${NC}"
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo -e "  1. Configure your web server (Nginx/Apache)"
echo -e "  2. Set up SSL certificate"
echo -e "  3. Test your website"
echo ""
echo -e "${GREEN}🎉 Your site should now be live!${NC}"