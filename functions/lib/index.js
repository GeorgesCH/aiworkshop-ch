"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAdminNotification = exports.sendDiscoveryCallConfirmation = exports.sendBrochureConfirmation = exports.sendWorkshopBookingConfirmation = exports.sendContactConfirmation = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const brevo = __importStar(require("@getbrevo/brevo"));
// Initialize Firebase Admin
admin.initializeApp();
// Initialize Brevo API client
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, functions.config().brevo.api_key);
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
        // Set subject and content
        sendSmtpEmail.subject = emailData.subject;
        sendSmtpEmail.htmlContent = emailData.htmlContent;
        sendSmtpEmail.textContent = emailData.textContent;
        // Send email
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        return {
            success: true,
            messageId: response.messageId || 'sent'
        };
    }
    catch (error) {
        console.error('Brevo email error:', error);
        return {
            success: false,
            error: error.message || 'Failed to send email'
        };
    }
}
// Cloud Functions for email sending
exports.sendContactConfirmation = functions.https.onCall(async (data, context) => {
    try {
        const { recipientEmail, recipientName, message } = data;
        if (!recipientEmail || !recipientName || !message) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
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
                email: 'hello@aiworkshop.ch',
                name: 'AI Workshop'
            }
        });
        return result;
    }
    catch (error) {
        console.error('Contact confirmation error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
exports.sendWorkshopBookingConfirmation = functions.https.onCall(async (data, context) => {
    try {
        const { recipientEmail, recipientName, bookingData } = data;
        if (!recipientEmail || !recipientName || !bookingData) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
        }
        const template = EMAIL_TEMPLATES.WORKSHOP_BOOKING_CONFIRMATION;
        const variables = Object.assign({ firstName: recipientName }, bookingData);
        const htmlContent = replaceTemplateVariables(template.htmlContent, variables);
        const textContent = replaceTemplateVariables(template.textContent, variables);
        const result = await sendEmail({
            to: [{ email: recipientEmail, name: recipientName }],
            subject: template.subject,
            htmlContent,
            textContent,
            sender: {
                email: 'hello@aiworkshop.ch',
                name: 'AI Workshop'
            }
        });
        return result;
    }
    catch (error) {
        console.error('Workshop confirmation error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
exports.sendBrochureConfirmation = functions.https.onCall(async (data, context) => {
    try {
        const { recipientEmail, recipientName } = data;
        if (!recipientEmail || !recipientName) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
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
                email: 'hello@aiworkshop.ch',
                name: 'AI Workshop'
            }
        });
        return result;
    }
    catch (error) {
        console.error('Brochure confirmation error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
exports.sendDiscoveryCallConfirmation = functions.https.onCall(async (data, context) => {
    try {
        const { recipientEmail, recipientName, callData } = data;
        if (!recipientEmail || !recipientName || !callData) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
        }
        const template = EMAIL_TEMPLATES.DISCOVERY_CALL_CONFIRMATION;
        const variables = Object.assign({ firstName: recipientName }, callData);
        const htmlContent = replaceTemplateVariables(template.htmlContent, variables);
        const textContent = replaceTemplateVariables(template.textContent, variables);
        const result = await sendEmail({
            to: [{ email: recipientEmail, name: recipientName }],
            subject: template.subject,
            htmlContent,
            textContent,
            sender: {
                email: 'hello@aiworkshop.ch',
                name: 'AI Workshop'
            }
        });
        return result;
    }
    catch (error) {
        console.error('Discovery call confirmation error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
exports.sendAdminNotification = functions.https.onCall(async (data, context) => {
    try {
        const { subject, message, formData } = data;
        if (!subject || !message) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
        }
        const adminEmail = 'xdgeorges@gmail.com';
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
                email: 'hello@aiworkshop.ch',
                name: 'AI Workshop System'
            }
        });
        return result;
    }
    catch (error) {
        console.error('Admin notification error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
//# sourceMappingURL=index.js.map