#!/bin/bash

# AI Workshop Switzerland - VPS Deployment Script
# This script builds and deploys the application to your VPS

set -e  # Exit on any error

echo "🚀 Starting AI Workshop Switzerland VPS deployment..."

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

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration - Update these for your VPS
VPS_HOST="${1:-your-vps-host.com}"
VPS_USER="${2:-root}"
VPS_PATH="${3:-/var/www/aiworkshop.ch}"
NGINX_SITE="${4:-aiworkshop.ch}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Validate VPS configuration
if [ "$VPS_HOST" = "your-vps-host.com" ]; then
    print_error "Please provide your VPS hostname/IP as the first argument:"
    print_error "Usage: ./deploy-vps.sh your-vps-host.com [username] [path] [nginx-site]"
    print_error "Example: ./deploy-vps.sh 192.168.1.100 root /var/www/aiworkshop.ch aiworkshop.ch"
    exit 1
fi

print_status "Deployment configuration:"
print_status "  VPS Host: $VPS_HOST"
print_status "  VPS User: $VPS_USER"
print_status "  VPS Path: $VPS_PATH"
print_status "  Nginx Site: $NGINX_SITE"

# Test SSH connection
print_status "Testing SSH connection to $VPS_USER@$VPS_HOST..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes "$VPS_USER@$VPS_HOST" exit 2>/dev/null; then
    print_error "Cannot connect to $VPS_USER@$VPS_HOST"
    print_error "Please ensure:"
    print_error "1. SSH key is set up for passwordless access"
    print_error "2. VPS is accessible from your network"
    print_error "3. Username and hostname are correct"
    exit 1
fi
print_success "SSH connection successful"

# Clean everything
print_status "Cleaning all caches and build artifacts..."
rm -rf dist/
rm -rf node_modules/.vite/
rm -rf node_modules/.cache/

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Generate sitemap
print_status "Generating sitemap..."
npm run sitemap

# Build the project
print_status "Building project..."
npm run build

# Post-build fixes
print_status "Applying post-build fixes..."

# Fix the base64 modulepreload issue in the generated HTML
if [ -f "dist/index.html" ]; then
    # Remove base64 modulepreload links
    sed -i '' 's|<link rel="modulepreload" href="data:application/octet-stream;base64,[^"]*">||g' dist/index.html
    sed -i '' 's|<link rel="modulepreload" href="data:[^"]*">||g' dist/index.html
    # Fix font preload crossorigin attribute
    sed -i '' 's|crossorigin>|crossorigin="anonymous">|g' dist/index.html
    print_success "Fixed HTML issues"
fi

# Verify critical files exist
print_status "Verifying build output..."

# Check if critical files exist
if [ ! -f "dist/index.html" ]; then
    print_error "dist/index.html not found!"
    exit 1
fi

if [ ! -f "dist/manifest.json" ]; then
    print_error "dist/manifest.json not found!"
    exit 1
fi

if [ ! -f "dist/sw.js" ]; then
    print_error "dist/sw.js not found!"
    exit 1
fi

print_success "All critical files verified!"

# Check file sizes
print_status "Checking build sizes..."
du -sh dist/

# Create backup on VPS
print_status "Creating backup on VPS..."
ssh "$VPS_USER@$VPS_HOST" "
    if [ -d '$VPS_PATH' ]; then
        sudo cp -r '$VPS_PATH' '$VPS_PATH.backup.$(date +%Y%m%d_%H%M%S)'
        echo 'Backup created'
    else
        echo 'No existing deployment found'
    fi
"

# Create deployment directory on VPS
print_status "Creating deployment directory on VPS..."
ssh "$VPS_USER@$VPS_HOST" "
    sudo mkdir -p '$VPS_PATH'
    sudo chown -R $VPS_USER:$VPS_USER '$VPS_PATH'
"

# Deploy files to VPS
print_status "Deploying files to VPS..."
rsync -avz --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='src' \
    --exclude='scripts' \
    --exclude='*.sh' \
    --exclude='*.md' \
    --exclude='*.json' \
    --exclude='*.js' \
    --exclude='*.ts' \
    --exclude='*.toml' \
    --exclude='supabase' \
    --exclude='public' \
    dist/ "$VPS_USER@$VPS_HOST:$VPS_PATH/"

# Set proper permissions
print_status "Setting file permissions..."
ssh "$VPS_USER@$VPS_HOST" "
    sudo chown -R www-data:www-data '$VPS_PATH'
    sudo chmod -R 755 '$VPS_PATH'
    sudo find '$VPS_PATH' -type f -name '*.html' -exec chmod 644 {} \;
    sudo find '$VPS_PATH' -type f -name '*.css' -exec chmod 644 {} \;
    sudo find '$VPS_PATH' -type f -name '*.js' -exec chmod 644 {} \;
"

# Create Nginx configuration
print_status "Creating Nginx configuration..."
ssh "$VPS_USER@$VPS_HOST" "
    sudo tee /etc/nginx/sites-available/$NGINX_SITE > /dev/null << 'EOF'
server {
    listen 80;
    server_name $NGINX_SITE www.$NGINX_SITE;
    root $VPS_PATH;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options \"SAMEORIGIN\" always;
    add_header X-Content-Type-Options \"nosniff\" always;
    add_header X-XSS-Protection \"1; mode=block\" always;
    add_header Referrer-Policy \"no-referrer-when-downgrade\" always;
    add_header Permissions-Policy \"geolocation=(), microphone=(), camera=()\" always;
    
    # SPA routing - try files, then fallback to index.html
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|otf|webp|avif)$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
        access_log off;
    }
    
    # Cache HTML files for a short time
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control \"public, must-revalidate\";
    }
    
    # Cache manifest and service worker
    location ~* \.(json|xml)$ {
        expires 1d;
        add_header Cache-Control \"public, must-revalidate\";
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
EOF

    # Enable the site
    sudo ln -sf /etc/nginx/sites-available/$NGINX_SITE /etc/nginx/sites-enabled/
    
    # Test Nginx configuration
    sudo nginx -t
    
    # Reload Nginx
    sudo systemctl reload nginx
"

print_success "Nginx configuration created and reloaded!"

# Test deployment
print_status "Testing deployment..."
if curl -s -o /dev/null -w "%{http_code}" "http://$VPS_HOST" | grep -q "200"; then
    print_success "Deployment test successful! Site is responding."
else
    print_warning "Deployment test failed. Please check:"
    print_warning "1. Nginx is running: sudo systemctl status nginx"
    print_warning "2. Nginx configuration: sudo nginx -t"
    print_warning "3. File permissions: ls -la $VPS_PATH"
    print_warning "4. Nginx error logs: sudo tail -f /var/log/nginx/error.log"
fi

print_success "VPS deployment completed successfully!"
print_status "Your site should now be live at: http://$VPS_HOST"
print_status ""
print_status "Next steps:"
print_status "1. Set up SSL certificate (recommended):"
print_status "   sudo apt install certbot python3-certbot-nginx"
print_status "   sudo certbot --nginx -d $NGINX_SITE -d www.$NGINX_SITE"
print_status ""
print_status "2. Monitor your deployment:"
print_status "   sudo tail -f /var/log/nginx/access.log"
print_status "   sudo tail -f /var/log/nginx/error.log"
print_status ""
print_status "3. If you need to rollback:"
print_status "   ssh $VPS_USER@$VPS_HOST 'ls $VPS_PATH.backup.*'"
print_status "   ssh $VPS_USER@$VPS_HOST 'sudo rm -rf $VPS_PATH && sudo mv $VPS_PATH.backup.TIMESTAMP $VPS_PATH'"
