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
VPS_PATH="/var/www/aiworkshop" # Web root directory
SSH_KEY="~/.ssh/gcloud-key2"      # SSH key path
PROJECT_NAME="aiworkshop-ch"

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
AI Workshop Switzerland - Deployment Package
===========================================
Build Date: $(date)
Git Commit: $(git rev-parse HEAD)
Git Branch: $(git branch --show-current)
Build Size: $(du -sh public | cut -f1)
Files Count: $(find public -type f | wc -l)

Deployment Instructions:
1. Upload the contents of this directory to your VPS web root
2. Configure your web server (Nginx/Apache) to serve static files
3. Set up SSL certificate for HTTPS
4. Configure canonical redirects (www → non-www)
5. Set up gzip compression for better performance

Server Configuration:
- Document Root: Point to this directory (/var/www/aiworkshop)
- Structure: Built assets + prerendered pages in single web root
- Index File: index.html (root) or {lang}/{route}/index.html (prerendered routes)
- Prerendered Pages: All language routes have static HTML files with SEO meta
- SEO Ready: Each page includes proper meta tags, hreflang, and canonical URLs
- Sitemap: sitemap.xml with hreflang alternates for all languages

Recommended Nginx Configuration:
# Cache static assets aggressively
location ~* ^/(assets|@optimized|fonts|favicon|sw.js|manifest.json) {
    access_log off;
    expires 30d;
    add_header Cache-Control "public, max-age=2592000, immutable";
    try_files \$uri =404;
}

# Serve prerendered localized pages if they exist
location ~* ^/(en|fr|de|it)(/.*)?$ {
    try_files \$uri \$uri/ \$uri/index.html /index.html;
}

# Sitemap and robots
location = /sitemap.xml { try_files /sitemap.xml =404; }
location = /robots.txt { try_files /robots.txt =404; }

# Fallback SPA route (English)
location / {
    try_files \$uri \$uri/ /index.html;
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
echo -e "${YELLOW}📋 Deployment Summary:${NC}"
echo -e "  ✓ Application built and optimized"
echo -e "  ✓ Static HTML prerendered for all languages"
echo -e "  ✓ Sitemap generated with hreflang alternates"
echo -e "  ✓ Files uploaded to VPS"
echo -e "  ✓ Permissions configured"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo -e "  1. Configure canonical redirects (www → non-www)"
echo -e "  2. Set up SSL certificate"
echo -e "  3. Test all language routes"
echo -e "  4. Verify sitemap.xml accessibility"
echo ""
echo -e "${GREEN}🎉 Your SEO-optimized multilingual site is now live!${NC}"