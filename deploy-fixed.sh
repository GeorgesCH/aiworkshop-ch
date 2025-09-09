#!/bin/bash

# 🚀 Fixed Deployment Script for AI Workshop Switzerland (React/Vite)
# This script deploys with corrected Nginx configuration

set -e  # Exit on any error

echo "🚀 Starting fixed deployment for AI Workshop Switzerland (React/Vite)..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

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

# VPS Configuration (from your existing setup)
VPS_HOST="128.65.199.142"
VPS_USER="ubuntu"
VPS_PATH="/var/www/aiworkshop.ch"
SSH_KEY="~/.ssh/gcloud-key2"

# Clear all caches and build with optimizations
print_status "Clearing all caches and building with optimizations..."
rm -rf dist
rm -rf node_modules/.cache
rm -rf node_modules/.vite
rm -rf .vite
rm -rf .turbo

# Run optimized build
print_status "Running optimized Vite build..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    print_error "Vite build failed - dist directory not found"
    exit 1
fi

print_success "Vite build successful"

# Get the current git commit hash for reference (if available)
if git rev-parse --git-dir > /dev/null 2>&1; then
    COMMIT_HASH=$(git rev-parse --short HEAD)
    print_status "Deploying commit: $COMMIT_HASH"
else
    COMMIT_HASH="no-git-$(date +%Y%m%d_%H%M%S)"
    print_status "No git repository found, using timestamp: $COMMIT_HASH"
fi

# Create build timestamp for cache busting
BUILD_TIMESTAMP=$(date +%s)
print_status "Build timestamp: $BUILD_TIMESTAMP"

# Connect to VPS and deploy with optimizations
print_status "Deploying to VPS with performance optimizations..."

# Create backup of current deployment
print_status "Creating backup of current deployment..."
ssh -i $SSH_KEY $VPS_USER@$VPS_HOST "
    if [ -d '$VPS_PATH' ]; then
        sudo cp -r $VPS_PATH ${VPS_PATH}.backup.\$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
        echo 'Backup created'
    else
        echo 'No existing deployment found'
    fi
"

# First, change ownership to ubuntu user for upload
print_status "Preparing VPS directory for upload..."
ssh -i $SSH_KEY $VPS_USER@$VPS_HOST "
    sudo chown -R ubuntu:ubuntu $VPS_PATH
    sudo rm -rf $VPS_PATH/.next
"

# Copy built files to VPS (deploy to root, not dist/)
print_status "Uploading optimized build files..."
rsync -avz --delete -e "ssh -i $SSH_KEY" \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='*.log' \
    --exclude='.env*' \
    dist/ $VPS_USER@$VPS_HOST:$VPS_PATH/

# Deploy and optimize on VPS
ssh -i $SSH_KEY $VPS_USER@$VPS_HOST "
    cd $VPS_PATH
    
    # Set proper permissions
    echo '[INFO] Setting proper permissions...'
    sudo chown -R www-data:www-data .
    sudo chmod -R 755 .
    sudo find . -type f -name '*.html' -exec chmod 644 {} \;
    sudo find . -type f -name '*.css' -exec chmod 644 {} \;
    sudo find . -type f -name '*.js' -exec chmod 644 {} \;
    sudo find . -type f -name '*.json' -exec chmod 644 {} \;
    sudo find . -type f -name '*.xml' -exec chmod 644 {} \;
    sudo find . -type f -name '*.txt' -exec chmod 644 {} \;
    sudo find . -type f -name '*.ico' -exec chmod 644 {} \;
    sudo find . -type f -name '*.png' -exec chmod 644 {} \;
    sudo find . -type f -name '*.jpg' -exec chmod 644 {} \;
    sudo find . -type f -name '*.jpeg' -exec chmod 644 {} \;
    sudo find . -type f -name '*.webp' -exec chmod 644 {} \;
    sudo find . -type f -name '*.svg' -exec chmod 644 {} \;
    sudo find . -type f -name '*.woff*' -exec chmod 644 {} \;
    sudo find . -type f -name '*.ttf' -exec chmod 644 {} \;
    sudo find . -type f -name '*.otf' -exec chmod 644 {} \;
    
    # Clear all caches and force browser cache invalidation
    echo '[INFO] Clearing all caches and forcing browser cache invalidation...'
    sudo rm -rf /var/cache/nginx/*
    sudo rm -rf /var/lib/nginx/cache/*
    sudo rm -rf /tmp/nginx_cache/*
    
    # Create cache-busting timestamp file
    echo '$BUILD_TIMESTAMP' | sudo tee .build-timestamp > /dev/null
    echo '$COMMIT_HASH' | sudo tee .build-commit > /dev/null
"

# Create Nginx configuration file locally and upload it
print_status "Creating Nginx configuration..."
cat > nginx-aiworkshop.conf << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name aiworkshop.ch www.aiworkshop.ch;
    
    root /var/www/aiworkshop.ch;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip compression with aggressive settings
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        application/xml
        image/svg+xml
        font/woff
        font/woff2
        application/font-woff
        application/font-woff2;
    
    # Cache static assets aggressively
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|otf|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        access_log off;
        etag on;
    }
    
    # Cache HTML files for shorter period
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public";
        add_header Vary "Accept-Encoding";
    }
    
    # Handle SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
        
        # Add cache-busting headers for HTML
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
    
    # Security: deny access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Security: deny access to backup files
    location ~ ~$ {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Security: deny access to build files
    location ~ \.(env|log|backup)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Performance: enable sendfile
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    
    # Performance: buffer settings
    client_body_buffer_size 128k;
    client_max_body_size 10m;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 4k;
    output_buffers 1 32k;
    postpone_output 1460;
}
EOF

# Upload Nginx configuration
print_status "Uploading Nginx configuration..."
scp -i $SSH_KEY nginx-aiworkshop.conf $VPS_USER@$VPS_HOST:/tmp/

# Configure Nginx on VPS
ssh -i $SSH_KEY $VPS_USER@$VPS_HOST "
    # Move Nginx configuration to proper location
    sudo mv /tmp/nginx-aiworkshop.conf /etc/nginx/sites-available/aiworkshop.ch
    
    # Enable the site
    sudo ln -sf /etc/nginx/sites-available/aiworkshop.ch /etc/nginx/sites-enabled/
    
    # Remove default site if it exists
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test Nginx configuration
    echo '[INFO] Testing Nginx configuration...'
    sudo nginx -t
    
    # Reload Nginx with optimizations
    echo '[INFO] Reloading Nginx with performance optimizations...'
    sudo systemctl reload nginx
    
    # Enable Nginx on boot
    sudo systemctl enable nginx
    
    echo '[SUCCESS] VPS optimization complete!'
"

# Clean up local Nginx config file
rm -f nginx-aiworkshop.conf

# Test deployment
print_status "Testing deployment..."
sleep 3
if curl -s -o /dev/null -w "%{http_code}" http://$VPS_HOST | grep -q "200"; then
    print_success "Deployment successful! Site is responding."
else
    print_warning "Site may not be responding yet. Please check manually."
fi

print_success "🎉 Fixed deployment complete!"
echo ""
echo "📊 Deployment Summary:"
echo "  ✅ Vite build optimized with code splitting"
echo "  ✅ Files deployed to VPS root directory"
echo "  ✅ Nginx configured with performance optimizations"
echo "  ✅ Gzip compression enabled"
echo "  ✅ Aggressive static asset caching"
echo "  ✅ Cache-busting headers implemented"
echo "  ✅ Security headers configured"
echo "  ✅ SPA routing configured"
echo "  ✅ All caches cleared and invalidated"
echo ""
echo "🌍 Your optimized site is live at: https://aiworkshop.ch"
echo "📝 Deployed commit: $COMMIT_HASH"
echo "⏰ Build timestamp: $BUILD_TIMESTAMP"
echo ""
echo "🔍 Next Steps:"
echo "  1. Test performance: curl -I http://$VPS_HOST"
echo "  2. Check Nginx logs: ssh -i $SSH_KEY $VPS_USER@$VPS_HOST 'sudo tail -f /var/log/nginx/access.log'"
echo "  3. Monitor errors: ssh -i $SSH_KEY $VPS_USER@$VPS_HOST 'sudo tail -f /var/log/nginx/error.log'"
echo "  4. Test SSL: sudo certbot --nginx -d aiworkshop.ch -d www.aiworkshop.ch"
echo ""
echo "🇨🇭 Swiss hosting benefits maintained for local SEO!"
echo "⚡ Performance optimizations: Code splitting, Gzip, Aggressive caching, Cache-busting"
