#!/bin/bash

# AI Workshop Switzerland - Complete Fix Deployment Script
# This script addresses all the MIME type, routing, and module loading issues

set -e  # Exit on any error

echo "🚀 Starting AI Workshop Switzerland complete fix deployment..."

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Clean everything
print_status "Cleaning all caches and build artifacts..."
rm -rf dist/
rm -rf node_modules/.vite/
rm -rf node_modules/.cache/
rm -rf .vercel/

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Generate sitemap
print_status "Generating sitemap..."
npm run sitemap

# Build the project
print_status "Building project with all fixes..."
npm run build

# Post-build fixes
print_status "Applying post-build fixes..."

# Fix the base64 modulepreload issue in the generated HTML
if [ -f "dist/index.html" ]; then
    # Remove base64 modulepreload links
    sed -i '' 's|<link rel="modulepreload" href="data:application/octet-stream;base64,[^"]*">||g' dist/index.html
    print_success "Removed base64 modulepreload from HTML"
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

if [ ! -d "dist/fonts/sigum" ]; then
    print_error "dist/fonts/sigum directory not found!"
    exit 1
fi

if [ ! -f "dist/fonts/sigum/Sigum.woff2" ]; then
    print_error "Sigum.woff2 font not found!"
    exit 1
fi

# Check if JavaScript files exist
if [ ! -d "dist/js" ]; then
    print_error "dist/js directory not found!"
    exit 1
fi

if [ ! -d "dist/assets" ]; then
    print_error "dist/assets directory not found!"
    exit 1
fi

print_success "All critical files verified!"

# Check file sizes
print_status "Checking build sizes..."
du -sh dist/
du -sh dist/js/
du -sh dist/assets/
du -sh dist/css/

# Deploy to Vercel
print_status "Deploying to Vercel with all fixes..."
vercel --prod

print_success "Deployment completed successfully!"
print_status "Your site should now be live with all fixes applied:"
print_status "✅ Fixed MIME types for JavaScript modules"
print_status "✅ Fixed font loading issues"
print_status "✅ Fixed service worker and manifest loading"
print_status "✅ Fixed React compatibility issues"
print_status "✅ Removed problematic base64 modulepreload"
print_status "✅ Updated Vercel routing configuration"

echo ""
print_status "If you still see errors, try:"
print_status "1. Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)"
print_status "2. Clear browser cache"
print_status "3. Check browser console for any remaining issues"
print_status "4. Wait a few minutes for CDN propagation"
