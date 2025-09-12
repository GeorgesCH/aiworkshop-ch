#!/bin/bash

# AI Workshop Switzerland - VPS Configuration Template
# Copy this file to vps-config.sh and update with your VPS details

# VPS Connection Details
export VPS_HOST="128.65.199.142"            # Your VPS IP address
export VPS_USER="ubuntu"                    # SSH username
export VPS_PATH="/var/www/aiworkshop.ch"    # Web root directory

# SSH Key Path for authentication
export SSH_KEY_PATH="~/.ssh/gcloud-key2"    # Path to your SSH private key

# Domain Configuration
export DOMAIN_NAME="aiworkshop.ch"          # Your domain name
export WWW_DOMAIN="www.aiworkshop.ch"       # WWW subdomain

# Optional: SSL Configuration
export SSL_EMAIL="your-email@domain.com"    # Email for SSL certificate

# Usage Examples:
# 
# 1. For IP address:
#    VPS_HOST="192.168.1.100"
#    VPS_USER="root"
#
# 2. For domain name:
#    VPS_HOST="yourdomain.com"
#    VPS_USER="ubuntu"
#
# 3. For custom path:
#    VPS_PATH="/home/ubuntu/websites/aiworkshop-ch"

echo "VPS Configuration loaded:"
echo "  Host: $VPS_HOST"
echo "  User: $VPS_USER"
echo "  Path: $VPS_PATH"
echo "  Domain: $DOMAIN_NAME"
