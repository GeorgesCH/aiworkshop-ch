#!/bin/bash

# Firebase Deployment Script for AI Workshop
echo "🚀 Starting Firebase deployment for AI Workshop..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please login to Firebase:"
    firebase login
fi

# Set the project
echo "📋 Setting Firebase project to aiworkshop-1b365..."
firebase use aiworkshop-1b365

# Install dependencies
echo "📦 Installing dependencies..."
cd functions && npm install && cd ..

# Build the frontend
echo "🏗️ Building frontend..."
npm run build

# Set Brevo API key (if not already set)
echo "🔑 Setting Brevo API key..."
firebase functions:config:set brevo.api_key="your-brevo-api-key-here"

# Deploy Cloud Functions
echo "☁️ Deploying Cloud Functions..."
firebase deploy --only functions

# Deploy Firestore rules and indexes
echo "🔥 Deploying Firestore rules and indexes..."
firebase deploy --only firestore

# Deploy hosting
echo "🌐 Deploying hosting..."
firebase deploy --only hosting

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your site is now live at: https://aiworkshop-1b365.web.app"
echo "📧 Email notifications will be sent to: xdgeorges@gmail.com"
echo ""
echo "🧪 Test your deployment:"
echo "1. Visit your site and submit a contact form"
echo "2. Check your email for admin notifications"
echo "3. Check the user's email for confirmations"
echo ""
echo "📊 Monitor your deployment:"
echo "- Firebase Console: https://console.firebase.google.com/project/aiworkshop-1b365"
echo "- Function logs: firebase functions:log"
echo "- Hosting status: firebase hosting:channel:list"
