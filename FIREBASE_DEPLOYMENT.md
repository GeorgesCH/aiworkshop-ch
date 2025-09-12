# 🚀 Firebase Deployment Guide

This guide will help you deploy your AI Workshop application to Firebase with email functionality.

## 📋 Prerequisites

1. **Firebase CLI installed**: `npm install -g firebase-tools`
2. **Firebase project created**: `aiworkshop-1b365`
3. **Brevo API key**: Already configured
4. **Node.js 18+**: For Cloud Functions

## 🔧 Setup Steps

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Set your Firebase project
```bash
firebase use aiworkshop-1b365
```

### 4. Install Cloud Functions dependencies
```bash
cd functions
npm install
```

### 5. Set up Brevo API key for Cloud Functions
```bash
firebase functions:config:set brevo.api_key="your-brevo-api-key-here"
```

### 6. Build the frontend
```bash
cd ..
npm run build
```

### 7. Deploy everything to Firebase
```bash
# Deploy Cloud Functions first
firebase deploy --only functions

# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy the frontend
firebase deploy --only hosting
```

## 🎯 Alternative: Deploy Everything at Once
```bash
firebase deploy
```

## 📧 Email Configuration

Your email service is now configured with:
- **From Email**: hello@aiworkshop.ch
- **Admin Notifications**: xdgeorges@gmail.com
- **Brevo API**: Configured and ready
- **All Email Types**: Contact, Workshop, Brochure, Discovery Call

## 🧪 Testing After Deployment

1. **Visit your deployed site**: `https://aiworkshop-1b365.web.app`
2. **Submit a contact form**
3. **Check your email** (xdgeorges@gmail.com) for admin notifications
4. **Check user email** for confirmation emails

## 🔍 Monitoring

### View Function Logs
```bash
firebase functions:log
```

### View Function Status
```bash
firebase functions:list
```

### Test Functions Locally
```bash
firebase emulators:start
```

## 🚨 Troubleshooting

### Functions Not Deploying
- Check Node.js version: `node --version` (should be 18+)
- Verify Firebase CLI: `firebase --version`
- Check project ID: `firebase projects:list`

### Email Not Working
- Verify Brevo API key: `firebase functions:config:get`
- Check function logs: `firebase functions:log`
- Test Brevo account credits

### Frontend Not Loading
- Check build output: `npm run build`
- Verify hosting deployment: `firebase hosting:channel:list`
- Check browser console for errors

## 📊 Production URLs

After deployment, your application will be available at:
- **Main Site**: `https://aiworkshop-1b365.web.app`
- **Custom Domain**: Configure in Firebase Hosting settings
- **Functions**: `https://us-central1-aiworkshop-1b365.cloudfunctions.net/`

## 🔒 Security

- ✅ Brevo API key is securely stored in Firebase Functions config
- ✅ CORS is configured for your domain
- ✅ Firestore security rules are deployed
- ✅ Admin notifications go to your email

## 📈 Scaling

Firebase automatically scales:
- **Hosting**: Global CDN
- **Functions**: Auto-scaling based on demand
- **Firestore**: Handles millions of documents
- **Email**: Brevo handles high volume

## 🎉 Success!

Your AI Workshop application is now fully deployed with:
- ✅ Professional email notifications
- ✅ Admin notifications to xdgeorges@gmail.com
- ✅ Firebase hosting with global CDN
- ✅ Serverless email functions
- ✅ Secure database with Firestore
- ✅ User authentication

---

**Need help?** Check the Firebase Console: https://console.firebase.google.com/project/aiworkshop-1b365
