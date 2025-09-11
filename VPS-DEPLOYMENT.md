# AI Workshop Switzerland - VPS Deployment Guide

This guide provides step-by-step instructions for deploying the AI Workshop Switzerland application to your VPS.

## 🚀 Quick Start

### One-Command Deployment
```bash
# First-time setup (run once)
./setup-vps.sh your-vps-host.com root /var/www/aiworkshop.ch aiworkshop.ch

# Deploy your application
./deploy-vps.sh your-vps-host.com root /var/www/aiworkshop.ch aiworkshop.ch
```

## 📋 Prerequisites

### 1. VPS Requirements
- **Operating System**: Ubuntu 20.04+ or Debian 10+ (recommended)
- **RAM**: Minimum 1GB (2GB+ recommended)
- **Storage**: Minimum 10GB free space
- **Network**: Public IP address with port 80/443 open

### 2. Domain Setup
- Domain name pointing to your VPS IP
- DNS propagation completed
- Example: `aiworkshop.ch` → `192.168.1.100`

### 3. SSH Access
- Passwordless SSH key authentication
- Root or sudo access

## 🔧 Setup Process

### Step 1: SSH Key Setup
```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Copy public key to VPS
ssh-copy-id root@your-vps-host.com

# Test connection
ssh root@your-vps-host.com
```

### Step 2: VPS Environment Setup
```bash
# Run the setup script (one-time setup)
./setup-vps.sh your-vps-host.com root /var/www/aiworkshop.ch aiworkshop.ch
```

This script will:
- ✅ Update system packages
- ✅ Install Nginx web server
- ✅ Install Certbot for SSL certificates
- ✅ Create web directory with proper permissions
- ✅ Configure Nginx for SPA routing
- ✅ Set up security headers
- ✅ Enable gzip compression
- ✅ Create test page

### Step 3: Deploy Application
```bash
# Deploy your application
./deploy-vps.sh your-vps-host.com root /var/www/aiworkshop.ch aiworkshop.ch
```

This script will:
- ✅ Build the application
- ✅ Fix HTML issues (base64 modulepreload, crossorigin)
- ✅ Create backup of existing deployment
- ✅ Upload files via rsync
- ✅ Set proper file permissions
- ✅ Update Nginx configuration
- ✅ Test deployment

## 🔒 SSL Certificate Setup

After successful deployment, set up SSL:

```bash
# SSH into your VPS
ssh root@your-vps-host.com

# Get SSL certificate
sudo certbot --nginx -d aiworkshop.ch -d www.aiworkshop.ch

# Test auto-renewal
sudo certbot renew --dry-run
```

## 📊 Monitoring

### Check Application Status
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx configuration
sudo nginx -t

# View access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### Check File Permissions
```bash
# Check web directory permissions
ls -la /var/www/aiworkshop.ch/

# Fix permissions if needed
sudo chown -R www-data:www-data /var/www/aiworkshop.ch
sudo chmod -R 755 /var/www/aiworkshop.ch
```

## 🔄 Updates and Maintenance

### Deploy Updates
```bash
# Simple update (files only)
./deploy-simple.sh your-vps-host.com root /var/www/aiworkshop.ch

# Full update (with Nginx config)
./deploy-vps.sh your-vps-host.com root /var/www/aiworkshop.ch aiworkshop.ch
```

### Rollback Deployment
```bash
# List available backups
ssh root@your-vps-host.com "ls /var/www/aiworkshop.ch.backup.*"

# Restore from backup
ssh root@your-vps-host.com "
    sudo rm -rf /var/www/aiworkshop.ch
    sudo mv /var/www/aiworkshop.ch.backup.20240101_120000 /var/www/aiworkshop.ch
    sudo systemctl reload nginx
"
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. SSH Connection Failed
```bash
# Check SSH key
ssh-add -l

# Test connection with verbose output
ssh -v root@your-vps-host.com

# Copy SSH key again
ssh-copy-id root@your-vps-host.com
```

#### 2. Nginx Not Starting
```bash
# Check Nginx configuration
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx

# View Nginx error logs
sudo journalctl -u nginx -f
```

#### 3. Files Not Found (404)
```bash
# Check file permissions
ls -la /var/www/aiworkshop.ch/

# Fix permissions
sudo chown -R www-data:www-data /var/www/aiworkshop.ch
sudo chmod -R 755 /var/www/aiworkshop.ch

# Check Nginx configuration
sudo nginx -t
```

#### 4. SPA Routing Not Working
Ensure Nginx has the correct `try_files` directive:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

#### 5. SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Check auto-renewal
sudo systemctl status certbot.timer
```

### Performance Optimization

#### 1. Enable HTTP/2
Add to Nginx configuration:
```nginx
listen 443 ssl http2;
```

#### 2. Optimize Caching
The deployment script already includes optimized caching headers.

#### 3. Enable Brotli Compression
```bash
# Install Brotli module
sudo apt install nginx-module-brotli

# Add to Nginx configuration
load_module modules/ngx_http_brotli_filter_module.so;
load_module modules/ngx_http_brotli_static_module.so;
```

## 📁 File Structure

After deployment, your VPS will have:
```
/var/www/aiworkshop.ch/
├── index.html
├── assets/
│   ├── *.js
│   ├── *.css
│   └── *.png
├── @optimized/
│   └── *.webp
├── fonts/
│   └── sigum/
├── manifest.json
├── robots.txt
├── sitemap.xml
└── sw.js
```

## 🔐 Security Considerations

### 1. Firewall Setup
```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH, HTTP, and HTTPS
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# Check status
sudo ufw status
```

### 2. Regular Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Nginx
sudo apt install nginx
```

### 3. Monitor Logs
```bash
# Set up log rotation
sudo logrotate -f /etc/logrotate.d/nginx

# Monitor for suspicious activity
sudo tail -f /var/log/nginx/access.log | grep -E "(404|500|403)"
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify file permissions and ownership
4. Test Nginx configuration: `sudo nginx -t`
5. Check system resources: `htop` or `free -h`

## 🎯 Next Steps

After successful deployment:

1. ✅ Set up SSL certificate
2. ✅ Configure domain DNS
3. ✅ Test all application features
4. ✅ Set up monitoring and backups
5. ✅ Configure automatic updates
6. ✅ Set up log rotation
7. ✅ Configure firewall rules

Your AI Workshop Switzerland application should now be live and accessible via your domain!
