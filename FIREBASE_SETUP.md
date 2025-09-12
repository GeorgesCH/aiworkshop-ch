# Firebase Setup Guide

This project has been migrated from Supabase to Firebase. Follow these steps to complete the setup:

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "aiworkshop-ch")
4. Enable Google Analytics (optional)
5. Create project

## 2. Enable Firebase Services

### Firestore Database
1. Go to Firestore Database in Firebase Console
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)

### Authentication
1. Go to Authentication in Firebase Console
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider

### Hosting (Optional)
1. Go to Hosting in Firebase Console
2. Click "Get started"
3. Follow the setup instructions

## 3. Get Configuration Values

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web app
4. Register your app with a nickname
5. Copy the configuration object

## 4. Environment Variables

Create a `.env` file in your project root with these variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Development settings
VITE_USE_FIREBASE_EMULATORS=false
```

## 5. Firestore Security Rules

Update your Firestore security rules to allow form submissions:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anonymous users to create documents in form collections
    match /contactSubmissions/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    
    match /workshopBookings/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    
    match /brochureRequests/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    
    match /exerciseResponses/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    
    match /emailSubscribers/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    
    match /pageAnalytics/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    
    match /developmentEstimates/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    
    match /discoveryCalls/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    
    // Admin access (authenticated users)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 6. Data Migration (Optional)

If you have existing data in Supabase, you can migrate it:

1. Export data from Supabase
2. Transform the data structure (PostgreSQL → Firestore)
3. Import to Firestore using Firebase Admin SDK or console

## 7. Testing

1. Run the development server: `npm run dev`
2. Test form submissions
3. Check Firebase Console to verify data is being saved
4. Use the FirebaseTest component to verify connection

## 8. Deployment

The project is configured to deploy to Firebase Hosting:

```bash
# Build and deploy
npm run deploy:firebase:full

# Or just deploy hosting
npm run deploy:firebase
```

## Migration Notes

### Key Changes Made:
- Replaced Supabase client with Firebase SDK
- Converted PostgreSQL schema to Firestore collections
- Updated all form components to use Firebase API
- Replaced Supabase Auth with Firebase Auth
- Updated error handling for Firebase errors
- Converted database queries to Firestore operations

### Database Structure:
- `contactSubmissions` - Contact form submissions
- `workshopBookings` - Workshop booking requests
- `brochureRequests` - Brochure download requests
- `exerciseResponses` - Exercise/assessment responses
- `emailSubscribers` - Email newsletter subscribers
- `pageAnalytics` - Page view analytics
- `developmentEstimates` - Development project estimates
- `discoveryCalls` - Discovery call requests

### Authentication:
- Firebase Auth replaces Supabase Auth
- Same user interface and functionality
- Email/password authentication
- Password reset functionality

## Troubleshooting

### Common Issues:
1. **Permission denied**: Check Firestore security rules
2. **Missing environment variables**: Verify .env file
3. **Connection issues**: Check Firebase project configuration
4. **Build errors**: Ensure all imports are updated

### Support:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
