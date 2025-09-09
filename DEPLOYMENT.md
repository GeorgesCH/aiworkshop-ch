# AI Workshop Switzerland - VPS Deployment Guide

## Quick Deployment

### Option 1: Simple Deployment
```bash
# Build and deploy in one command
npm run deploy [VPS_HOST] [VPS_USER]

# Example:
npm run deploy your-vps-host.com root
```

### Option 2: Full Deployment with Nginx Configuration
```bash
# Build and deploy with full Nginx setup
npm run deploy:full
```

## Manual Deployment Steps

### 1. Build the Application
```bash
npm run build
```

### 2. Deploy to VPS
```bash
# Simple deployment
./deploy-simple.sh your-vps-host.com root

# Or full deployment with Nginx config
./deploy.sh
```

## VPS Requirements

- **Web Server**: Nginx (recommended) or Apache
- **Directory**: `/var/www/aiworkshop.ch/` (files deployed to root, not dist/)
- **Permissions**: `www-data:www-data` with `755` permissions
- **SSL**: Recommended (Let's Encrypt)

## Configuration

### Update Deployment Scripts
Edit the deployment scripts to match your VPS:

**deploy-simple.sh**:
```bash
VPS_HOST="your-vps-host.com"  # Your VPS hostname/IP
VPS_USER="root"               # Your VPS username
```

**deploy.sh**:
```bash
VPS_HOST="your-vps-host.com"  # Your VPS hostname/IP
VPS_USER="root"               # Your VPS username
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
