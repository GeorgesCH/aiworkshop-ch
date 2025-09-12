# 📧 Email Service Setup

Your AI Workshop application now has a fully functional email service using Brevo!

## 🚀 Quick Start

### Option 1: Start Both Servers (Recommended)
```bash
npm run dev:full
```
This will start both the frontend (port 5174) and email server (port 3001).

### Option 2: Start Servers Separately
```bash
# Terminal 1: Start email server
npm run email:server

# Terminal 2: Start frontend
npm run dev
```

## 📧 Email Features

Your application now sends professional emails for:

- ✅ **Contact Form Confirmations** - Users receive confirmation when they submit contact forms
- ✅ **Workshop Booking Confirmations** - Detailed booking confirmations with all details
- ✅ **Brochure Download Confirmations** - Confirmation when users request brochures
- ✅ **Discovery Call Confirmations** - Scheduling confirmations for discovery calls
- ✅ **Admin Notifications** - You receive notifications for all form submissions

## 🎨 Email Templates

All emails are professionally designed with:
- AI Workshop branding
- Responsive design
- Clear call-to-actions
- Professional styling
- Both HTML and text versions

## 🔧 Configuration

### Email Server Configuration
- **Port**: 3001
- **Brevo API**: Configured with your API key
- **From Email**: hello@aiworkshop.ch
- **Admin Email**: hello@aiworkshop.ch

### Environment Variables
The email server uses these environment variables (already configured):
```
BREVO_API_KEY=your-brevo-api-key-here
FROM_EMAIL=hello@aiworkshop.ch
FROM_NAME=AI Workshop
ADMIN_EMAIL=hello@aiworkshop.ch
```

## 🧪 Testing

### Test Email Server
```bash
curl -X POST http://localhost:3001/api/send-contact-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "your-email@example.com",
    "recipientName": "Your Name",
    "message": "Test message from AI Workshop"
  }'
```

### Test in Browser
1. Go to http://localhost:5174
2. Submit a contact form
3. Check your email for the confirmation

## 📊 Monitoring

### Email Server Health
```bash
curl http://localhost:3001/health
```

### Server Logs
The email server logs all email sending attempts and errors to the console.

## 🚀 Production Deployment

For production, you'll need to:

1. **Deploy the email server** to a hosting service (Vercel, Railway, Heroku, etc.)
2. **Update the EMAIL_SERVER_URL** in `src/utils/firebaseApi.ts` to point to your production server
3. **Set up environment variables** on your hosting platform
4. **Configure CORS** to allow your production domain

### Example Production Configuration
```javascript
// In src/utils/firebaseApi.ts
const EMAIL_SERVER_URL = 'https://your-email-server.vercel.app/api';
```

## 🔒 Security

- ✅ API key is stored securely on the server
- ✅ CORS is configured for your domains only
- ✅ Input validation on all endpoints
- ✅ Error handling prevents information leakage

## 📝 Email Templates Customization

To customize email templates, edit the `EMAIL_TEMPLATES` object in `server/server.js`.

## 🆘 Troubleshooting

### Email Server Not Starting
- Check if port 3001 is available
- Verify Brevo API key is correct
- Check server logs for errors

### Emails Not Sending
- Verify Brevo account has sufficient credits
- Check Brevo API key permissions
- Review server logs for specific errors

### CORS Issues
- Update `ALLOWED_ORIGINS` in server `.env` file
- Restart the email server after changes

## 📞 Support

If you need help with the email service:
1. Check the server logs
2. Test the health endpoint
3. Verify your Brevo account status
4. Check your email spam folder

---

🎉 **Your email service is now fully functional!** Users will receive professional email confirmations for all form submissions.
