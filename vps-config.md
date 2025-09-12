# VPS Deployment Configuration

## Key Deployment Notes

### Build Order (CRITICAL)
Always follow this exact sequence for proper deployment:
```bash
npm run build      # Build the application
npm run prerender  # Generate static HTML for all language routes
npm run sitemap    # Generate sitemap with hreflang alternates
```

### Prerendered Pages
- **Location**: `public/{lang}/.../index.html` files are ready for crawlers
- **SEO Features**: Each page includes correct title, meta description, canonical per language, full hreflang cluster, and OG/Twitter tags
- **Languages**: All language variants are prerendered with proper meta tags

### Redirects
- **Canonical 301 redirects**: Configure at Nginx/Apache level (e.g., www → non-www)
- **Client-side redirects**: Removed from JavaScript for better SEO
- **Implementation**: Use server-level redirects for canonical URLs

### Sitemap & Robots
- **Sitemap**: `public/sitemap.xml` lists every language URL with hreflang alternates
- **Robots**: `public/robots.txt` allows all languages and points to sitemap

### VPS Deployment Structure
The deployment creates a single web root containing:
- **Built assets**: All optimized JS, CSS, images from `build/` directory
- **Prerendered pages**: Language-specific HTML files in `{lang}/{route}/index.html`
- **SEO files**: `sitemap.xml` and `robots.txt` at web root
- **Result**: Single `/var/www/aiworkshop` directory with everything needed

## Nginx Configuration

Create `/etc/nginx/sites-available/aiworkshop-ch`:

```nginx
# HTTP to HTTPS redirect with canonical www → non-www
server {
    listen 80;
    server_name aiworkshop.ch www.aiworkshop.ch;
    
    # 301 redirect www → non-www
    if ($host = www.aiworkshop.ch) {
        return 301 https://aiworkshop.ch$request_uri;
    }
    
    # Enforce HTTPS (if certbot/SSL runs on a separate server block, skip this)
    return 301 https://aiworkshop.ch$request_uri;
}

# Main site (non-WWW canonical)
server {
    listen 443 ssl http2;
    server_name aiworkshop.ch;
    
    # SSL config here (certs, protocols, ciphers)
    ssl_certificate /etc/letsencrypt/live/aiworkshop.ch/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aiworkshop.ch/privkey.pem;
    
    root /var/www/aiworkshop;
    index index.html;
    
    # Gzip/brotli can be enabled as needed
    gzip on;
    
    # Cache static assets aggressively
    location ~* ^/(assets|@optimized|fonts|favicon|sw.js|manifest.json) {
        access_log off;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        try_files $uri =404;
    }
    
    # Serve prerendered localized pages if they exist
    # e.g., /en/generative-ai/ -> /var/www/aiworkshop/en/generative-ai/index.html
    location ~* ^/(en|fr|de|it)(/.*)?$ {
        try_files $uri $uri/ $uri/index.html /index.html;
    }
    
    # Sitemap and robots
    location = /sitemap.xml { try_files /sitemap.xml =404; }
    location = /robots.txt { try_files /robots.txt =404; }
    
    # Fallback SPA route (English)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers (optional but recommended)
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Permissions-Policy "interest-cohort=()";
}
```

## Apache Configuration

### VirtualHost Configuration

Create a VirtualHost configuration in `/etc/apache2/sites-available/aiworkshop-ch.conf`:

```apache
# HTTP to HTTPS redirect
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    Redirect permanent / https://your-domain.com/
</VirtualHost>

# WWW to non-WWW redirect (canonical)
<VirtualHost *:443>
    ServerName www.your-domain.com
    DocumentRoot /var/www/aiworkshop
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /path/to/your/certificate.crt
    SSLCertificateKeyFile /path/to/your/private.key
    
    # Canonical redirect: www to non-www
    Redirect permanent / https://your-domain.com/
</VirtualHost>

# Main site (non-WWW canonical)
<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /var/www/aiworkshop
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /path/to/your/certificate.crt
    SSLCertificateKeyFile /path/to/your/private.key
    
    # Include .htaccess rules
    AllowOverride All
    
    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "no-referrer-when-downgrade"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
</VirtualHost>
```

### .htaccess Configuration

Create `.htaccess` in your deployment directory:

```apache
RewriteEngine On

# Canonical redirects (if not handled by VirtualHost)
# RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
# RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# Handle SPA routing
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Handle language-specific routes (prerendered pages)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(en|de|fr|it)/(.*)$ /$1/index.html [L]

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE font/woff
    AddOutputFilterByType DEFLATE font/woff2
    AddOutputFilterByType DEFLATE font/ttf
    AddOutputFilterByType DEFLATE font/otf
</IfModule>

# Cache Control
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/avif "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType font/ttf "access plus 1 year"
    ExpiresByType font/otf "access plus 1 year"
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "no-referrer-when-downgrade"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
</IfModule>
```

## Deployment Steps

### Automated Deployment (Recommended)

1. **Run the complete release pipeline:**
   ```bash
   npm run release  # Builds, prerenders, generates sitemap, and deploys
   ```

### Manual Deployment

1. **Follow the critical build order:**
   ```bash
   npm run build      # Build the application
   npm run prerender  # Generate static HTML for all language routes  
   npm run sitemap    # Generate sitemap with hreflang alternates
   ```

2. **Deploy to VPS:**
   ```bash
   ./deploy-vps.sh
   ```

### Manual Upload (Alternative)

1. **Upload to your VPS:**
   ```bash
   scp aiworkshop-ch-deploy.tar.gz user@your-vps-ip:/tmp/
   ```

2. **On your VPS, extract and set up:**
   ```bash
   cd /var/www
   sudo mkdir -p aiworkshop
   sudo chown -R www-data:www-data aiworkshop
   cd aiworkshop
   sudo tar -xzf /tmp/aiworkshop-ch-deploy.tar.gz
   ```

4. **Configure Nginx (if using):**
   ```bash
   sudo ln -s /etc/nginx/sites-available/aiworkshop-ch /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **Set up SSL certificate:**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

6. (Optional) **Enable Brotli compression** if available on your distro:
   ```nginx
   brotli on;
   brotli_comp_level 5;
   brotli_types text/plain text/css application/javascript application/json image/svg+xml;
   ```

## Performance Optimization

- Enable HTTP/2 in Nginx
- Use a CDN for static assets
- Set up monitoring with tools like UptimeRobot
- Configure log rotation
- Set up automated backups

## Optional Enhancements

### Build Pipeline Automation
Add a single npm script that runs the complete sequence:
```bash
npm run release  # build → prerender → sitemap → deploy
```

### Rsync-based Deploy Script
For faster, incremental deployments:
```bash
npm run deploy:rsync  # Uses rsync for efficient file synchronization
```

### Full Localization
Extend prerender meta to pull from existing language meta maps:
- Localized titles and descriptions in static HTML
- Currently uses English as authoritative fallback
- Can be enhanced to use language-specific meta data

### Apache Configuration
If using Apache instead of Nginx:
- VirtualHost configuration provided above
- .htaccess rules for SPA routing and language handling
- Equivalent security headers and compression settings

## Monitoring

Consider setting up:
- SSL certificate monitoring
- Uptime monitoring
- Performance monitoring
- Error logging
- SEO monitoring for prerendered pages
