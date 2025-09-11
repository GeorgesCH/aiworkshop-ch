#!/bin/bash

# AI Workshop Switzerland - Deployment Help Script
# Shows all available deployment options and usage examples

echo "🚀 AI Workshop Switzerland - Deployment Options"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${CYAN}$1${NC}"
}

print_command() {
    echo -e "${GREEN}$1${NC}"
}

print_description() {
    echo -e "${BLUE}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}$1${NC}"
}

print_header "📋 Available Deployment Scripts:"
echo ""

print_header "1. VPS Deployment (Recommended)"
print_description "Complete VPS setup and deployment with Nginx configuration"
print_command "  ./setup-vps.sh [VPS_HOST] [VPS_USER] [VPS_PATH] [NGINX_SITE]"
print_command "  ./deploy-vps.sh [VPS_HOST] [VPS_USER] [VPS_PATH] [NGINX_SITE]"
echo ""
print_command "  Example:"
print_command "    ./setup-vps.sh 192.168.1.100 root /var/www/aiworkshop.ch aiworkshop.ch"
print_command "    ./deploy-vps.sh 192.168.1.100 root /var/www/aiworkshop.ch aiworkshop.ch"
echo ""

print_header "2. Simple VPS Deployment"
print_description "Quick file deployment without Nginx configuration"
print_command "  ./deploy-simple.sh [VPS_HOST] [VPS_USER] [VPS_PATH]"
echo ""
print_command "  Example:"
print_command "    ./deploy-simple.sh 192.168.1.100 root /var/www/aiworkshop.ch"
echo ""

print_header "3. NPM Scripts"
print_description "Deploy using npm commands"
print_command "  npm run deploy:vps [VPS_HOST] [VPS_USER] [VPS_PATH] [NGINX_SITE]"
print_command "  npm run deploy:vps:simple [VPS_HOST] [VPS_USER] [VPS_PATH]"
echo ""

print_header "4. Vercel Deployment (Existing)"
print_description "Deploy to Vercel platform"
print_command "  ./deploy-complete-fix.sh"
print_command "  ./deploy-final-fix.sh"
print_command "  ./deploy-optimized.sh"
echo ""

print_header "📖 Prerequisites:"
echo ""
print_description "• SSH key authentication set up"
print_description "• VPS with Ubuntu/Debian"
print_description "• Domain pointing to VPS IP"
print_description "• Root or sudo access"
echo ""

print_header "🔧 Quick Setup Commands:"
echo ""
print_command "# Generate SSH key (if needed)"
print_command "ssh-keygen -t rsa -b 4096 -C \"your-email@example.com\""
echo ""
print_command "# Copy SSH key to VPS"
print_command "ssh-copy-id root@your-vps-host.com"
echo ""
print_command "# Test SSH connection"
print_command "ssh root@your-vps-host.com"
echo ""

print_header "🚀 Complete Deployment Workflow:"
echo ""
print_command "# Step 1: First-time VPS setup (run once)"
print_command "./setup-vps.sh your-vps-host.com root /var/www/aiworkshop.ch aiworkshop.ch"
echo ""
print_command "# Step 2: Deploy application"
print_command "./deploy-vps.sh your-vps-host.com root /var/www/aiworkshop.ch aiworkshop.ch"
echo ""
print_command "# Step 3: Set up SSL certificate"
print_command "ssh root@your-vps-host.com 'sudo certbot --nginx -d aiworkshop.ch -d www.aiworkshop.ch'"
echo ""

print_header "📊 Monitoring Commands:"
echo ""
print_command "# Check Nginx status"
print_command "ssh root@your-vps-host.com 'sudo systemctl status nginx'"
echo ""
print_command "# View access logs"
print_command "ssh root@your-vps-host.com 'sudo tail -f /var/log/nginx/access.log'"
echo ""
print_command "# View error logs"
print_command "ssh root@your-vps-host.com 'sudo tail -f /var/log/nginx/error.log'"
echo ""

print_header "🔄 Update Commands:"
echo ""
print_command "# Quick update (files only)"
print_command "./deploy-simple.sh your-vps-host.com root /var/www/aiworkshop.ch"
echo ""
print_command "# Full update (with Nginx config)"
print_command "./deploy-vps.sh your-vps-host.com root /var/www/aiworkshop.ch aiworkshop.ch"
echo ""

print_header "🛠️ Troubleshooting:"
echo ""
print_command "# Check file permissions"
print_command "ssh root@your-vps-host.com 'ls -la /var/www/aiworkshop.ch/'"
echo ""
print_command "# Fix permissions"
print_command "ssh root@your-vps-host.com 'sudo chown -R www-data:www-data /var/www/aiworkshop.ch'"
echo ""
print_command "# Test Nginx configuration"
print_command "ssh root@your-vps-host.com 'sudo nginx -t'"
echo ""

print_warning "📚 For detailed instructions, see:"
print_warning "  • VPS-DEPLOYMENT.md - Complete VPS deployment guide"
print_warning "  • DEPLOYMENT.md - General deployment documentation"
echo ""

print_header "✅ Ready to deploy!"
print_description "Choose the deployment method that best fits your needs."
print_description "For first-time VPS deployment, use the complete workflow above."
