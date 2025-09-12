# Brevo Email Integration Setup

This guide explains how to set up Brevo email integration for the AI Workshop website.

## 1. Get Your Brevo API Key

1. Sign up for a Brevo account at [brevo.com](https://www.brevo.com)
2. Go to your account settings and generate an API key
3. Copy the API key for use in your environment variables

## 2. Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Brevo API Configuration
VITE_BREVO_API_KEY=your_brevo_api_key_here
VITE_ADMIN_EMAIL=admin@aiworkshop.ch

# Other configuration
VITE_APP_URL=https://aiworkshop.ch
```

## 3. Email Templates

The system includes pre-built email templates for:
- Contact form confirmations
- Workshop booking confirmations
- Brochure request confirmations
- Discovery call confirmations
- Admin notifications

## 4. Usage

The email service is automatically integrated into your existing form submissions. When users submit forms, they will receive confirmation emails and you'll receive admin notifications.

## 5. Customization

You can customize email templates by editing the `EMAIL_TEMPLATES` object in `src/utils/brevoEmail.ts`.

## 6. Testing

To test the email functionality:
1. Set up your environment variables
2. Submit a contact form
3. Check that confirmation emails are sent
4. Verify admin notifications are received

## 7. Production Deployment

Make sure to:
1. Set the environment variables in your production environment
2. Verify your Brevo account has sufficient credits
3. Test email delivery in production
4. Monitor email delivery rates and bounce rates

## 8. Troubleshooting

Common issues:
- **API Key not working**: Verify the API key is correct and has proper permissions
- **Emails not sending**: Check Brevo account credits and API limits
- **Template errors**: Verify template variables are properly formatted
- **CORS issues**: Ensure your domain is whitelisted in Brevo settings
