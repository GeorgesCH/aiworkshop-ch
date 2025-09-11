# AI Workshop Switzerland - VPS Deployment Guide

## Quick Deployment

### Option 1: Complete VPS Setup and Deployment
```bash
# First-time setup (run once)
./setup-vps.sh your-vps-host.com root /var/www/aiworkshop.ch aiworkshop.ch

# Deploy your application
./deploy-vps.sh your-vps-host.com root /var/www/aiworkshop.ch aiworkshop.ch
```

### Option 2: Simple Deployment (files only)
```bash
# Quick deployment without Nginx configuration
./deploy-simple.sh your-vps-host.com root /var/www/aiworkshop.ch
```

### Option 3: Using NPM Scripts
```bash
# Full VPS deployment with Nginx setup
npm run deploy:vps your-vps-host.com root /var/www/aiworkshop.ch aiworkshop.ch

# Simple file deployment
npm run deploy:vps:simple your-vps-host.com root /var/www/aiworkshop.ch
```

## Manual Deployment Steps

### 1. First-Time VPS Setup
```bash
# Set up VPS environment (run once)
./setup-vps.sh your-vps-host.com root /var/www/aiworkshop.ch aiworkshop.ch
```

### 2. Build and Deploy Application
```bash
# Build the application
npm run build

# Deploy to VPS
./deploy-vps.sh your-vps-host.com root /var/www/aiworkshop.ch aiworkshop.ch
```

## VPS Requirements

- **Operating System**: Ubuntu 20.04+ or Debian 10+ (recommended)
- **Web Server**: Nginx (automatically installed by setup script)
- **Directory**: `/var/www/aiworkshop.ch/` (configurable)
- **Permissions**: `www-data:www-data` with `755` permissions
- **SSL**: Let's Encrypt (Certbot automatically installed)
- **SSH Access**: Passwordless SSH key authentication required

## Prerequisites

### 1. SSH Key Setup
Ensure you have passwordless SSH access to your VPS:
```bash
# Generate SSH key if you don't have one
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Copy your public key to the VPS
ssh-copy-id root@your-vps-host.com

# Test passwordless access
ssh root@your-vps-host.com
```

### 2. Domain Configuration
- Point your domain to your VPS IP address
- Ensure DNS propagation is complete
- Have your domain ready (e.g., `aiworkshop.ch`)

## Configuration

The deployment scripts accept parameters for flexibility:

**setup-vps.sh**:
```bash
./setup-vps.sh [VPS_HOST] [VPS_USER] [VPS_PATH] [NGINX_SITE]
# Example: ./setup-vps.sh 192.168.1.100 root /var/www/aiworkshop.ch aiworkshop.ch
```

**deploy-vps.sh**:
```bash
./deploy-vps.sh [VPS_HOST] [VPS_USER] [VPS_PATH] [NGINX_SITE]
# Example: ./deploy-vps.sh 192.168.1.100 root /var/www/aiworkshop.ch aiworkshop.ch
```

**deploy-simple.sh**:
```bash
./deploy-simple.sh [VPS_HOST] [VPS_USER] [VPS_PATH]
# Example: ./deploy-simple.sh 192.168.1.100 root /var/www/aiworkshop.ch
```

### Nginx Configuration
The full deployment script automatically creates this Nginx configuration:

```nginx
server {
    listen 80;
    server_name aiworkshop.ch www.aiworkshop.ch;
    root /var/www/aiworkshop.ch;
    index index.html;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|otf|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Post-Deployment

### 1. SSL Certificate (Recommended)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d aiworkshop.ch -d www.aiworkshop.ch
```

### 2. Test Your Deployment
- Visit `http://aiworkshop.ch` (or your domain)
- Check all pages load correctly
- Test form submissions
- Verify Supabase integration works

### 3. Monitor
- Check Nginx logs: `sudo tail -f /var/log/nginx/access.log`
- Check error logs: `sudo tail -f /var/log/nginx/error.log`

## Troubleshooting

### Common Issues

1. **Files not found (404)**
   - Check file permissions: `sudo chown -R www-data:www-data /var/www/aiworkshop.ch`
   - Verify Nginx configuration: `sudo nginx -t`

2. **SPA routing not working**
   - Ensure Nginx has the `try_files` directive for SPA routing

3. **Supabase connection issues**
   - Verify environment variables are set correctly
   - Check Supabase project is active

### Rollback
If you need to rollback:
```bash
# The deployment script creates backups
ssh your-vps-host.com "ls /var/www/aiworkshop.ch.backup.*"
# Restore from backup
ssh your-vps-host.com "sudo rm -rf /var/www/aiworkshop.ch && sudo mv /var/www/aiworkshop.ch.backup.TIMESTAMP /var/www/aiworkshop.ch"
```

## Environment Variables

Make sure your VPS has the correct Supabase environment variables:
- `VITE_SUPABASE_URL=https://gcvkdrfuwuceyxmgtdps.supabase.co`
- `VITE_SUPABASE_ANON_KEY=your_anon_key`

These are already configured in your `.env` file and will be included in the build.
