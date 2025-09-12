// Brevo email service - disabled for browser environment
// This service is designed to run in a server environment only
// For now, we'll disable email functionality in the browser
let brevo: any = null;
let apiInstance: any = null;

// Note: Email functionality is disabled in browser environment
// To enable email sending, implement a server-side API endpoint
// that handles email sending using Brevo or another email service

// Email templates and configurations
export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailData {
  to: EmailRecipient[];
  templateId?: number;
  subject?: string;
  htmlContent?: string;
  textContent?: string;
  params?: Record<string, any>;
  replyTo?: EmailRecipient;
  sender: EmailRecipient;
}

// Common email templates
export const EMAIL_TEMPLATES = {
  CONTACT_CONFIRMATION: {
    subject: 'Thank you for contacting AI Workshop',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thank you for your message!</h2>
        <p>Hi {{name}},</p>
        <p>We've received your message and will get back to you within 24 hours.</p>
        <p><strong>Your message:</strong></p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
          {{message}}
        </div>
        <p>Best regards,<br>The AI Workshop Team</p>
      </div>
    `,
    textContent: `Hi {{name}},\n\nThank you for your message. We've received it and will get back to you within 24 hours.\n\nYour message: {{message}}\n\nBest regards,\nThe AI Workshop Team`
  },
  
  WORKSHOP_BOOKING_CONFIRMATION: {
    subject: 'Workshop Booking Confirmation - AI Workshop',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Workshop Booking Confirmed!</h2>
        <p>Hi {{firstName}},</p>
        <p>Thank you for booking a workshop with us. Here are your booking details:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Workshop Type:</strong> {{workshopType}}</p>
          <p><strong>Preferred Date:</strong> {{preferredDate}}</p>
          <p><strong>Preferred Time:</strong> {{preferredTime}}</p>
          <p><strong>Participants:</strong> {{numberOfParticipants}}</p>
          <p><strong>Location:</strong> {{locationPreference}}</p>
        </div>
        <p>We'll contact you soon to finalize the details and send you the workshop materials.</p>
        <p>Best regards,<br>The AI Workshop Team</p>
      </div>
    `,
    textContent: `Hi {{firstName}},\n\nThank you for booking a workshop with us.\n\nWorkshop Type: {{workshopType}}\nPreferred Date: {{preferredDate}}\nPreferred Time: {{preferredTime}}\nParticipants: {{numberOfParticipants}}\nLocation: {{locationPreference}}\n\nWe'll contact you soon to finalize the details.\n\nBest regards,\nThe AI Workshop Team`
  },
  
  BROCHURE_SENT: {
    subject: 'Your AI Workshop Brochure is Ready!',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Your Brochure is Ready!</h2>
        <p>Hi {{firstName}},</p>
        <p>Thank you for your interest in our AI workshops. Please find your personalized brochure attached.</p>
        <p>If you have any questions about our services or would like to schedule a discovery call, please don't hesitate to contact us.</p>
        <p>Best regards,<br>The AI Workshop Team</p>
      </div>
    `,
    textContent: `Hi {{firstName}},\n\nThank you for your interest in our AI workshops. Please find your personalized brochure attached.\n\nIf you have any questions, please don't hesitate to contact us.\n\nBest regards,\nThe AI Workshop Team`
  },
  
  DISCOVERY_CALL_CONFIRMATION: {
    subject: 'Discovery Call Scheduled - AI Workshop',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Discovery Call Scheduled!</h2>
        <p>Hi {{firstName}},</p>
        <p>Thank you for requesting a discovery call. Here are your call details:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Preferred Date:</strong> {{preferredDate}}</p>
          <p><strong>Preferred Time:</strong> {{preferredTime}}</p>
          <p><strong>Duration:</strong> {{callDuration}} minutes</p>
          <p><strong>Type:</strong> {{callType}}</p>
        </div>
        <p>We'll contact you soon to confirm the exact time and send you the meeting link.</p>
        <p>Best regards,<br>The AI Workshop Team</p>
      </div>
    `,
    textContent: `Hi {{firstName}},\n\nThank you for requesting a discovery call.\n\nPreferred Date: {{preferredDate}}\nPreferred Time: {{preferredTime}}\nDuration: {{callDuration}} minutes\nType: {{callType}}\n\nWe'll contact you soon to confirm the exact time.\n\nBest regards,\nThe AI Workshop Team`
  }
};

// Main email sending function
export async function sendEmail(emailData: EmailData): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    // Check if Brevo is available
    if (!brevo || !apiInstance) {
      console.warn('Brevo email service not available - email not sent');
      return {
        success: false,
        error: 'Email service not available in browser environment'
      };
    }

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
    if (emailData.templateId) {
      sendSmtpEmail.templateId = emailData.templateId;
      if (emailData.params) {
        sendSmtpEmail.params = emailData.params;
      }
    } else {
      sendSmtpEmail.subject = emailData.subject || 'Message from AI Workshop';
      sendSmtpEmail.htmlContent = emailData.htmlContent || '';
      sendSmtpEmail.textContent = emailData.textContent || '';
    }
    
    // Send email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    return {
      success: true,
      messageId: response.messageId
    };
    
  } catch (error: any) {
    console.error('Brevo email error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send email'
    };
  }
}

// Helper function to replace template variables
export function replaceTemplateVariables(template: string, variables: Record<string, any>): string {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value || ''));
  });
  return result;
}

// Specific email functions for different use cases
export async function sendContactConfirmation(
  recipientEmail: string, 
  recipientName: string, 
  message: string
): Promise<{ success: boolean; error?: string }> {
  const template = EMAIL_TEMPLATES.CONTACT_CONFIRMATION;
  const htmlContent = replaceTemplateVariables(template.htmlContent, { name: recipientName, message });
  const textContent = replaceTemplateVariables(template.textContent || '', { name: recipientName, message });
  
  return await sendEmail({
    to: [{ email: recipientEmail, name: recipientName }],
    subject: template.subject,
    htmlContent,
    textContent,
    sender: {
      email: 'noreply@aiworkshop.ch',
      name: 'AI Workshop'
    }
  });
}

export async function sendWorkshopBookingConfirmation(
  recipientEmail: string,
  recipientName: string,
  bookingData: {
    workshopType: string;
    preferredDate?: string;
    preferredTime?: string;
    numberOfParticipants?: number;
    locationPreference?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const template = EMAIL_TEMPLATES.WORKSHOP_BOOKING_CONFIRMATION;
  const variables = {
    firstName: recipientName,
    ...bookingData
  };
  
  const htmlContent = replaceTemplateVariables(template.htmlContent, variables);
  const textContent = replaceTemplateVariables(template.textContent || '', variables);
  
  return await sendEmail({
    to: [{ email: recipientEmail, name: recipientName }],
    subject: template.subject,
    htmlContent,
    textContent,
    sender: {
      email: 'noreply@aiworkshop.ch',
      name: 'AI Workshop'
    }
  });
}

export async function sendBrochureConfirmation(
  recipientEmail: string,
  recipientName: string
): Promise<{ success: boolean; error?: string }> {
  const template = EMAIL_TEMPLATES.BROCHURE_SENT;
  const htmlContent = replaceTemplateVariables(template.htmlContent, { firstName: recipientName });
  const textContent = replaceTemplateVariables(template.textContent || '', { firstName: recipientName });
  
  return await sendEmail({
    to: [{ email: recipientEmail, name: recipientName }],
    subject: template.subject,
    htmlContent,
    textContent,
    sender: {
      email: 'noreply@aiworkshop.ch',
      name: 'AI Workshop'
    }
  });
}

export async function sendDiscoveryCallConfirmation(
  recipientEmail: string,
  recipientName: string,
  callData: {
    preferredDate?: string;
    preferredTime?: string;
    callDuration?: string;
    callType?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const template = EMAIL_TEMPLATES.DISCOVERY_CALL_CONFIRMATION;
  const variables = {
    firstName: recipientName,
    ...callData
  };
  
  const htmlContent = replaceTemplateVariables(template.htmlContent, variables);
  const textContent = replaceTemplateVariables(template.textContent || '', variables);
  
  return await sendEmail({
    to: [{ email: recipientEmail, name: recipientName }],
    subject: template.subject,
    htmlContent,
    textContent,
    sender: {
      email: 'noreply@aiworkshop.ch',
      name: 'AI Workshop'
    }
  });
}

// Admin notification function
export async function sendAdminNotification(
  subject: string,
  message: string,
  formData?: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  const adminEmail = process.env.VITE_ADMIN_EMAIL || 'admin@aiworkshop.ch';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">New Form Submission</h2>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
        ${message}
      </div>
      ${formData ? `
        <p><strong>Form Data:</strong></p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <pre style="white-space: pre-wrap; font-family: monospace;">${JSON.stringify(formData, null, 2)}</pre>
        </div>
      ` : ''}
      <p><em>This is an automated notification from the AI Workshop website.</em></p>
    </div>
  `;
  
  return await sendEmail({
    to: [{ email: adminEmail, name: 'AI Workshop Admin' }],
    subject: `[AI Workshop] ${subject}`,
    htmlContent,
    sender: {
      email: 'noreply@aiworkshop.ch',
      name: 'AI Workshop System'
    }
  });
}
