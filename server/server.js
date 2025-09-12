import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as brevo from '@getbrevo/brevo';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Initialize Brevo API client
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// Email templates
const EMAIL_TEMPLATES = {
  CONTACT_CONFIRMATION: {
    subject: 'Thank you for contacting AI Workshop',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">AI Workshop</h1>
          <p style="color: #6b7280; margin: 5px 0;">Expert Corporate AI Training & Workshops</p>
        </div>
        
        <h2 style="color: #1f2937;">Thank you for your message!</h2>
        <p>Hi {{name}},</p>
        <p>We've received your message and will get back to you within 24 hours.</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
          <h3 style="margin-top: 0; color: #374151;">Your message:</h3>
          <p style="margin-bottom: 0; white-space: pre-wrap;">{{message}}</p>
        </div>
        
        <p>If you have any urgent questions, feel free to call us or reply to this email.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            Best regards,<br>
            The AI Workshop Team<br>
            <a href="mailto:hello@aiworkshop.ch" style="color: #2563eb;">hello@aiworkshop.ch</a>
          </p>
        </div>
      </div>
    `,
    textContent: `Hi {{name}},\n\nThank you for your message. We've received it and will get back to you within 24 hours.\n\nYour message: {{message}}\n\nBest regards,\nThe AI Workshop Team\nhello@aiworkshop.ch`
  },
  
  WORKSHOP_BOOKING_CONFIRMATION: {
    subject: 'Workshop Booking Confirmation - AI Workshop',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">AI Workshop</h1>
          <p style="color: #6b7280; margin: 5px 0;">Expert Corporate AI Training & Workshops</p>
        </div>
        
        <h2 style="color: #059669;">Workshop Booking Confirmed!</h2>
        <p>Hi {{firstName}},</p>
        <p>Thank you for booking a workshop with us. Here are your booking details:</p>
        
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
          <h3 style="margin-top: 0; color: #374151;">Booking Details:</h3>
          <p><strong>Workshop Type:</strong> {{workshopType}}</p>
          <p><strong>Preferred Date:</strong> {{preferredDate}}</p>
          <p><strong>Preferred Time:</strong> {{preferredTime}}</p>
          <p><strong>Participants:</strong> {{numberOfParticipants}}</p>
          <p><strong>Location:</strong> {{locationPreference}}</p>
        </div>
        
        <p>We'll contact you soon to finalize the details and send you the workshop materials.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            Best regards,<br>
            The AI Workshop Team<br>
            <a href="mailto:hello@aiworkshop.ch" style="color: #2563eb;">hello@aiworkshop.ch</a>
          </p>
        </div>
      </div>
    `,
    textContent: `Hi {{firstName}},\n\nThank you for booking a workshop with us.\n\nWorkshop Type: {{workshopType}}\nPreferred Date: {{preferredDate}}\nPreferred Time: {{preferredTime}}\nParticipants: {{numberOfParticipants}}\nLocation: {{locationPreference}}\n\nWe'll contact you soon to finalize the details.\n\nBest regards,\nThe AI Workshop Team\nhello@aiworkshop.ch`
  },
  
  BROCHURE_SENT: {
    subject: 'Your AI Workshop Brochure is Ready!',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">AI Workshop</h1>
          <p style="color: #6b7280; margin: 5px 0;">Expert Corporate AI Training & Workshops</p>
        </div>
        
        <h2 style="color: #7c3aed;">Your Brochure is Ready!</h2>
        <p>Hi {{firstName}},</p>
        <p>Thank you for your interest in our AI workshops. Please find your personalized brochure attached.</p>
        
        <div style="background-color: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
          <h3 style="margin-top: 0; color: #374151;">What's Next?</h3>
          <p>If you have any questions about our services or would like to schedule a discovery call, please don't hesitate to contact us.</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            Best regards,<br>
            The AI Workshop Team<br>
            <a href="mailto:hello@aiworkshop.ch" style="color: #2563eb;">hello@aiworkshop.ch</a>
          </p>
        </div>
      </div>
    `,
    textContent: `Hi {{firstName}},\n\nThank you for your interest in our AI workshops. Please find your personalized brochure attached.\n\nIf you have any questions, please don't hesitate to contact us.\n\nBest regards,\nThe AI Workshop Team\nhello@aiworkshop.ch`
  },
  
  DISCOVERY_CALL_CONFIRMATION: {
    subject: 'Discovery Call Scheduled - AI Workshop',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">AI Workshop</h1>
          <p style="color: #6b7280; margin: 5px 0;">Expert Corporate AI Training & Workshops</p>
        </div>
        
        <h2 style="color: #dc2626;">Discovery Call Scheduled!</h2>
        <p>Hi {{firstName}},</p>
        <p>Thank you for requesting a discovery call. Here are your call details:</p>
        
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="margin-top: 0; color: #374151;">Call Details:</h3>
          <p><strong>Preferred Date:</strong> {{preferredDate}}</p>
          <p><strong>Preferred Time:</strong> {{preferredTime}}</p>
          <p><strong>Duration:</strong> {{callDuration}} minutes</p>
          <p><strong>Type:</strong> {{callType}}</p>
        </div>
        
        <p>We'll contact you soon to confirm the exact time and send you the meeting link.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            Best regards,<br>
            The AI Workshop Team<br>
            <a href="mailto:hello@aiworkshop.ch" style="color: #2563eb;">hello@aiworkshop.ch</a>
          </p>
        </div>
      </div>
    `,
    textContent: `Hi {{firstName}},\n\nThank you for requesting a discovery call.\n\nPreferred Date: {{preferredDate}}\nPreferred Time: {{preferredTime}}\nDuration: {{callDuration}} minutes\nType: {{callType}}\n\nWe'll contact you soon to confirm the exact time.\n\nBest regards,\nThe AI Workshop Team\nhello@aiworkshop.ch`
  }
};

// Helper function to replace template variables
function replaceTemplateVariables(template, variables) {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value || ''));
  });
  return result;
}

// Main email sending function
async function sendEmail(emailData) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    // Set recipients
    sendSmtpEmail.to = emailData.to.map(recipient => ({
      email: recipient.email,
      name: recipient.name || recipient.email
    }));
    
    // Set sender
    sendSmtpEmail.sender = {
      email: emailData.sender.email,
      name: emailData.sender.name || emailData.sender.email
    };
    
    // Set reply-to if provided
    if (emailData.replyTo) {
      sendSmtpEmail.replyTo = {
        email: emailData.replyTo.email,
        name: emailData.replyTo.name || emailData.replyTo.email
      };
    }
    
    // Set subject and content
    sendSmtpEmail.subject = emailData.subject || 'Message from AI Workshop';
    sendSmtpEmail.htmlContent = emailData.htmlContent || '';
    sendSmtpEmail.textContent = emailData.textContent || '';
    
    // Send email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    return {
      success: true,
      messageId: response.messageId
    };
    
  } catch (error) {
    console.error('Brevo email error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send email'
    };
  }
}

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test admin email endpoint
app.post('/api/test-admin-email', async (req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'xdgeorges@gmail.com';
    
    const result = await sendEmail({
      to: [{ email: adminEmail, name: 'AI Workshop Admin' }],
      subject: '[AI Workshop] Test Admin Email',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Test Admin Email</h2>
          <p>This is a test email to verify admin notifications are working.</p>
          <p>If you receive this, the admin notification system is functional!</p>
        </div>
      `,
      textContent: 'Test Admin Email - This is a test email to verify admin notifications are working.',
      sender: {
        email: process.env.FROM_EMAIL || 'hello@aiworkshop.ch',
        name: 'AI Workshop System'
      }
    });
    
    res.json(result);
  } catch (error) {
    console.error('Test admin email error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Send contact confirmation email
app.post('/api/send-contact-confirmation', async (req, res) => {
  try {
    const { recipientEmail, recipientName, message } = req.body;
    
    if (!recipientEmail || !recipientName || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: recipientEmail, recipientName, message' 
      });
    }
    
    const template = EMAIL_TEMPLATES.CONTACT_CONFIRMATION;
    const htmlContent = replaceTemplateVariables(template.htmlContent, { name: recipientName, message });
    const textContent = replaceTemplateVariables(template.textContent, { name: recipientName, message });
    
    const result = await sendEmail({
      to: [{ email: recipientEmail, name: recipientName }],
      subject: template.subject,
      htmlContent,
      textContent,
      sender: {
        email: process.env.FROM_EMAIL || 'hello@aiworkshop.ch',
        name: process.env.FROM_NAME || 'AI Workshop'
      }
    });
    
    res.json(result);
  } catch (error) {
    console.error('Contact confirmation error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Send workshop booking confirmation
app.post('/api/send-workshop-confirmation', async (req, res) => {
  try {
    const { recipientEmail, recipientName, bookingData } = req.body;
    
    if (!recipientEmail || !recipientName || !bookingData) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: recipientEmail, recipientName, bookingData' 
      });
    }
    
    const template = EMAIL_TEMPLATES.WORKSHOP_BOOKING_CONFIRMATION;
    const variables = {
      firstName: recipientName,
      ...bookingData
    };
    
    const htmlContent = replaceTemplateVariables(template.htmlContent, variables);
    const textContent = replaceTemplateVariables(template.textContent, variables);
    
    const result = await sendEmail({
      to: [{ email: recipientEmail, name: recipientName }],
      subject: template.subject,
      htmlContent,
      textContent,
      sender: {
        email: process.env.FROM_EMAIL || 'hello@aiworkshop.ch',
        name: process.env.FROM_NAME || 'AI Workshop'
      }
    });
    
    res.json(result);
  } catch (error) {
    console.error('Workshop confirmation error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Send brochure confirmation
app.post('/api/send-brochure-confirmation', async (req, res) => {
  try {
    const { recipientEmail, recipientName } = req.body;
    
    if (!recipientEmail || !recipientName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: recipientEmail, recipientName' 
      });
    }
    
    const template = EMAIL_TEMPLATES.BROCHURE_SENT;
    const htmlContent = replaceTemplateVariables(template.htmlContent, { firstName: recipientName });
    const textContent = replaceTemplateVariables(template.textContent, { firstName: recipientName });
    
    const result = await sendEmail({
      to: [{ email: recipientEmail, name: recipientName }],
      subject: template.subject,
      htmlContent,
      textContent,
      sender: {
        email: process.env.FROM_EMAIL || 'hello@aiworkshop.ch',
        name: process.env.FROM_NAME || 'AI Workshop'
      }
    });
    
    res.json(result);
  } catch (error) {
    console.error('Brochure confirmation error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Send discovery call confirmation
app.post('/api/send-discovery-call-confirmation', async (req, res) => {
  try {
    const { recipientEmail, recipientName, callData } = req.body;
    
    if (!recipientEmail || !recipientName || !callData) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: recipientEmail, recipientName, callData' 
      });
    }
    
    const template = EMAIL_TEMPLATES.DISCOVERY_CALL_CONFIRMATION;
    const variables = {
      firstName: recipientName,
      ...callData
    };
    
    const htmlContent = replaceTemplateVariables(template.htmlContent, variables);
    const textContent = replaceTemplateVariables(template.textContent, variables);
    
    const result = await sendEmail({
      to: [{ email: recipientEmail, name: recipientName }],
      subject: template.subject,
      htmlContent,
      textContent,
      sender: {
        email: process.env.FROM_EMAIL || 'hello@aiworkshop.ch',
        name: process.env.FROM_NAME || 'AI Workshop'
      }
    });
    
    res.json(result);
  } catch (error) {
    console.error('Discovery call confirmation error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Send admin notification
app.post('/api/send-admin-notification', async (req, res) => {
  try {
    const { subject, message, formData } = req.body;
    
    if (!subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: subject, message' 
      });
    }
    
    const adminEmail = process.env.ADMIN_EMAIL || 'xdgeorges@gmail.com';
    
    // Create a simpler HTML content to avoid potential issues
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">New Form Submission - AI Workshop</h2>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
        ${formData ? `<p><strong>Form Data:</strong></p><pre>${JSON.stringify(formData, null, 2)}</pre>` : ''}
        <p><em>This is an automated notification from the AI Workshop website.</em></p>
      </div>
    `;
    
    const textContent = `New Form Submission - AI Workshop\n\nSubject: ${subject}\nMessage: ${message}\n${formData ? `Form Data: ${JSON.stringify(formData, null, 2)}` : ''}\n\nThis is an automated notification from the AI Workshop website.`;
    
    const result = await sendEmail({
      to: [{ email: adminEmail, name: 'AI Workshop Admin' }],
      subject: `[AI Workshop] ${subject}`,
      htmlContent,
      textContent,
      sender: {
        email: process.env.FROM_EMAIL || 'hello@aiworkshop.ch',
        name: 'AI Workshop System'
      }
    });
    
    res.json(result);
  } catch (error) {
    console.error('Admin notification error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Email server running on port ${PORT}`);
  console.log(`📧 Brevo API configured: ${process.env.BREVO_API_KEY ? 'Yes' : 'No'}`);
  console.log(`📬 From email: ${process.env.FROM_EMAIL || 'hello@aiworkshop.ch'}`);
  console.log(`🌐 CORS origins: ${process.env.ALLOWED_ORIGINS || 'http://localhost:5174'}`);
});
