#!/bin/bash

# AI Workshop Switzerland - VPS Environment Setup Script
# This script sets up the VPS environment for hosting the application

set -e  # Exit on any error

echo "🚀 Setting up VPS environment for AI Workshop Switzerland..."

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

# Configuration
VPS_HOST="${1:-your-vps-host.com}"
VPS_USER="${2:-root}"
VPS_PATH="${3:-/var/www/aiworkshop.ch}"
NGINX_SITE="${4:-aiworkshop.ch}"

# Validate VPS configuration
if [ "$VPS_HOST" = "your-vps-host.com" ]; then
    print_error "Please provide your VPS hostname/IP as the first argument:"
    print_error "Usage: ./setup-vps.sh your-vps-host.com [username] [path] [nginx-site]"
    print_error "Example: ./setup-vps.sh 192.168.1.100 root /var/www/aiworkshop.ch aiworkshop.ch"
    exit 1
fi

print_status "VPS setup configuration:"
print_status "  VPS Host: $VPS_HOST"
print_status "  VPS User: $VPS_USER"
print_status "  VPS Path: $VPS_PATH"
print_status "  Nginx Site: $NGINX_SITE"

# Test SSH connection
print_status "Testing SSH connection to $VPS_USER@$VPS_HOST..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes "$VPS_USER@$VPS_HOST" exit 2>/dev/null; then
    print_error "Cannot connect to $VPS_USER@$VPS_HOST"
    print_error "Please ensure SSH key is set up for passwordless access"
    exit 1
fi
print_success "SSH connection successful"

# Update system packages
print_status "Updating system packages..."
ssh "$VPS_USER@$VPS_HOST" "
    sudo apt update && sudo apt upgrade -y
"

# Install required packages
print_status "Installing required packages..."
ssh "$VPS_USER@$VPS_HOST" "
    sudo apt install -y nginx rsync curl wget unzip
"

# Create web directory
print_status "Creating web directory..."
ssh "$VPS_USER@$VPS_HOST" "
    sudo mkdir -p '$VPS_PATH'
    sudo chown -R www-data:www-data '$VPS_PATH'
    sudo chmod -R 755 '$VPS_PATH'
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
    
    # Remove default site if it exists
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test Nginx configuration
    sudo nginx -t
    
    # Start and enable Nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    sudo systemctl reload nginx
"

print_success "Nginx configuration created and started!"

# Install Certbot for SSL (optional)
print_status "Installing Certbot for SSL certificates..."
ssh "$VPS_USER@$VPS_HOST" "
    sudo apt install -y certbot python3-certbot-nginx
"

# Create a simple test page
print_status "Creating test page..."
ssh "$VPS_USER@$VPS_HOST" "
    sudo tee '$VPS_PATH/index.html' > /dev/null << 'EOF'
<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>AI Workshop Switzerland - VPS Ready</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .success { color: #28a745; }
        .info { color: #17a2b8; }
    </style>
</head>
<body>
    <h1 class=\"success\">✅ VPS Environment Ready!</h1>
    <p class=\"info\">AI Workshop Switzerland VPS is configured and ready for deployment.</p>
    <p>Next step: Run the deployment script to upload your application.</p>
</body>
</html>
EOF
    sudo chown www-data:www-data '$VPS_PATH/index.html'
"

# Test the setup
print_status "Testing VPS setup..."
if curl -s -o /dev/null -w "%{http_code}" "http://$VPS_HOST" | grep -q "200"; then
    print_success "VPS setup test successful! Nginx is serving content."
else
    print_warning "VPS setup test failed. Please check:"
    print_warning "1. Nginx is running: sudo systemctl status nginx"
    print_warning "2. Nginx configuration: sudo nginx -t"
    print_warning "3. Firewall settings: sudo ufw status"
fi

print_success "VPS environment setup completed successfully!"
print_status ""
print_status "Your VPS is now ready for deployment:"
print_status "✅ Nginx installed and configured"
print_status "✅ Web directory created: $VPS_PATH"
print_status "✅ SSL certificate tools installed (Certbot)"
print_status "✅ Test page deployed"
print_status ""
print_status "Next steps:"
print_status "1. Deploy your application:"
print_status "   ./deploy-vps.sh $VPS_HOST $VPS_USER $VPS_PATH $NGINX_SITE"
print_status ""
print_status "2. Set up SSL certificate (recommended):"
print_status "   ssh $VPS_USER@$VPS_HOST 'sudo certbot --nginx -d $NGINX_SITE -d www.$NGINX_SITE'"
print_status ""
print_status "3. Monitor your deployment:"
print_status "   ssh $VPS_USER@$VPS_HOST 'sudo tail -f /var/log/nginx/access.log'"
print_status "   ssh $VPS_USER@$VPS_HOST 'sudo tail -f /var/log/nginx/error.log'"
