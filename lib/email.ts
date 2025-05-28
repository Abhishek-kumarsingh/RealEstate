import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify email configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('Email server is ready to take our messages');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}

// Email templates
export const emailTemplates = {
  inquiryReceived: (data: {
    agentName: string;
    userName: string;
    userEmail: string;
    propertyTitle: string;
    message: string;
    propertyUrl: string;
  }) => ({
    subject: `New Inquiry for ${data.propertyTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Property Inquiry</h2>
        <p>Hello ${data.agentName},</p>
        <p>You have received a new inquiry for your property:</p>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">${data.propertyTitle}</h3>
          <p><strong>From:</strong> ${data.userName} (${data.userEmail})</p>
          <p><strong>Message:</strong></p>
          <p style="background: white; padding: 15px; border-radius: 4px;">${data.message}</p>
        </div>

        <p>
          <a href="${data.propertyUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Property
          </a>
        </p>

        <p>Please respond to this inquiry promptly to maintain good customer service.</p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          This email was sent from RealEstate Pro platform.
          <a href="${process.env.NEXTAUTH_URL}/dashboard">Login to your dashboard</a> to manage inquiries.
        </p>
      </div>
    `,
  }),

  inquiryResponse: (data: {
    userName: string;
    agentName: string;
    propertyTitle: string;
    response: string;
    propertyUrl: string;
  }) => ({
    subject: `Response to Your Inquiry - ${data.propertyTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Inquiry Response</h2>
        <p>Hello ${data.userName},</p>
        <p>${data.agentName} has responded to your inquiry about:</p>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">${data.propertyTitle}</h3>
          <p><strong>Agent Response:</strong></p>
          <p style="background: white; padding: 15px; border-radius: 4px;">${data.response}</p>
        </div>

        <p>
          <a href="${data.propertyUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Property
          </a>
        </p>

        <p>If you have any additional questions, feel free to contact the agent directly.</p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          This email was sent from RealEstate Pro platform.
        </p>
      </div>
    `,
  }),

  propertyStatusUpdate: (data: {
    userName: string;
    propertyTitle: string;
    status: string;
    reason?: string;
    dashboardUrl: string;
  }) => ({
    subject: `Property Status Update - ${data.propertyTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${data.status === 'APPROVED' ? '#059669' : '#dc2626'};">
          Property ${data.status}
        </h2>
        <p>Hello ${data.userName},</p>
        <p>Your property listing has been updated:</p>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">${data.propertyTitle}</h3>
          <p><strong>Status:</strong> <span style="color: ${data.status === 'APPROVED' ? '#059669' : '#dc2626'};">${data.status}</span></p>
          ${data.reason ? `<p><strong>Note:</strong> ${data.reason}</p>` : ''}
        </div>

        <p>
          <a href="${data.dashboardUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Dashboard
          </a>
        </p>

        ${data.status === 'APPROVED'
          ? '<p>Congratulations! Your property is now live and visible to potential buyers.</p>'
          : '<p>Please review the feedback and make necessary changes before resubmitting.</p>'
        }

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          This email was sent from RealEstate Pro platform.
        </p>
      </div>
    `,
  }),

  agentVerification: (data: {
    agentName: string;
    status: 'APPROVED' | 'REJECTED';
    reason?: string;
    dashboardUrl: string;
  }) => ({
    subject: `Agent Verification ${data.status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${data.status === 'APPROVED' ? '#059669' : '#dc2626'};">
          Agent Verification ${data.status}
        </h2>
        <p>Hello ${data.agentName},</p>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Status:</strong> <span style="color: ${data.status === 'APPROVED' ? '#059669' : '#dc2626'};">${data.status}</span></p>
          ${data.reason ? `<p><strong>Note:</strong> ${data.reason}</p>` : ''}
        </div>

        ${data.status === 'APPROVED'
          ? `
            <p>Congratulations! Your agent verification has been approved. You can now:</p>
            <ul>
              <li>List properties directly without admin approval</li>
              <li>Access advanced agent features</li>
              <li>Receive priority support</li>
            </ul>
          `
          : `
            <p>Unfortunately, your agent verification was not approved at this time. Please review the feedback and resubmit your application with the required documentation.</p>
          `
        }

        <p>
          <a href="${data.dashboardUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Access Dashboard
          </a>
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          This email was sent from RealEstate Pro platform.
        </p>
      </div>
    `,
  }),
};

// Send email function
export async function sendEmail(to: string, template: any) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('Email credentials not configured, skipping email send');
      return { success: false, error: 'Email not configured' };
    }

    const mailOptions = {
      from: `"RealEstate Pro" <${process.env.SMTP_USER}>`,
      to,
      subject: template.subject,
      html: template.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Utility functions for common email scenarios
export async function sendInquiryNotification(data: {
  agentEmail: string;
  agentName: string;
  userName: string;
  userEmail: string;
  propertyTitle: string;
  message: string;
  propertyUrl: string;
}) {
  const template = emailTemplates.inquiryReceived(data);
  return await sendEmail(data.agentEmail, template);
}

export async function sendInquiryResponse(data: {
  userEmail: string;
  userName: string;
  agentName: string;
  propertyTitle: string;
  response: string;
  propertyUrl: string;
}) {
  const template = emailTemplates.inquiryResponse(data);
  return await sendEmail(data.userEmail, template);
}

export async function sendPropertyStatusUpdate(data: {
  userEmail: string;
  userName: string;
  propertyTitle: string;
  status: string;
  reason?: string;
  dashboardUrl: string;
}) {
  const template = emailTemplates.propertyStatusUpdate(data);
  return await sendEmail(data.userEmail, template);
}

export async function sendAgentVerificationUpdate(data: {
  agentEmail: string;
  agentName: string;
  status: 'APPROVED' | 'REJECTED';
  reason?: string;
  dashboardUrl: string;
}) {
  const template = emailTemplates.agentVerification(data);
  return await sendEmail(data.agentEmail, template);
}
