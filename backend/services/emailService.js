import nodemailer from 'nodemailer';
import gmailNewsletterService from './gmailNewsletterService.js';

class EmailService {
  constructor() {
    this.transporter = null;
    this.currentProvider = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    // Primary: Use Gmail service for production
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
      try {
        await this.initializeGmail();
        return;
      } catch (error) {
        console.warn('⚠️ Gmail initialization failed:', error.message);
      }
    }

    // Fallback: Use test account for development
    await this.initializeTestAccount();
  }
  async initializeResend() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 587,
      secure: false,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    });

    await this.transporter.verify();
    this.currentProvider = 'Resend';
    console.log('✅ Email service initialized with Resend');
  }

  async initializeEthereal() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
      },
    });

    await this.transporter.verify();
    this.currentProvider = 'Ethereal Email';
    console.log('✅ Email service initialized with Ethereal Email');
  }

  async initializeGmail() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await this.transporter.verify();
    this.currentProvider = 'Gmail SMTP';
    console.log('✅ Email service initialized with Gmail SMTP');
  }

  async initializeTestAccount() {
    // Create test account for development
    const testAccount = await nodemailer.createTestAccount();
    
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    this.currentProvider = 'Test Account';
    console.log('✅ Email service initialized with test account');
    console.log('📧 Test credentials:', {
      user: testAccount.user,
      pass: testAccount.pass,
    });
  }

  async sendWelcomeEmail(email, name = 'Supporter') {
    try {
      // Use Gmail newsletter service for welcome emails
      const result = await gmailNewsletterService.sendWelcomeEmail(email, name);
      return result;
    } catch (error) {
      console.error('❌ Failed to send welcome email via Gmail service:', error);
      
      // Fallback to original email service
      if (!this.transporter) {
        throw new Error('Email service not initialized');
      }

      const htmlContent = this.generateWelcomeEmailHTML(name);
      const textContent = this.generateWelcomeEmailText(name);

      const mailOptions = {
        from: {
          name: process.env.FROM_NAME || 'EduHope India Newsletter',
          address: process.env.FROM_EMAIL || 'newsletter@eduhopeindia.org',
        },
        to: email,
        subject: 'Welcome to EduHope India Newsletter! 🎉',
        html: htmlContent,
        text: textContent,
        replyTo: process.env.REPLY_TO_EMAIL || 'info@eduhopeindia.org',
      };

      try {
        const info = await this.transporter.sendMail(mailOptions);
        
        // Log preview URL for test accounts
        if (this.currentProvider === 'Test Account' || this.currentProvider === 'Ethereal Email') {
          const previewUrl = nodemailer.getTestMessageUrl(info);
          console.log('📧 Preview URL:', previewUrl);
        }

        return {
          success: true,
          messageId: info.messageId,
          provider: this.currentProvider,
          previewUrl: nodemailer.getTestMessageUrl(info) || null,
        };
      } catch (fallbackError) {
        console.error('❌ Failed to send welcome email:', fallbackError);
        throw fallbackError;
      }
    }
  }

  async sendDonationConfirmationEmail(donationData) {
    try {
      // Use Gmail newsletter service for donation confirmations
      const result = await gmailNewsletterService.sendDonationConfirmationEmail(donationData);
      return result;
    } catch (error) {
      console.error('❌ Failed to send donation confirmation via Gmail service:', error);
      throw error;
    }
  }

  generateWelcomeEmailHTML(name) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to EduHope India</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
          }
          .welcome-title {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .highlight-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 25px;
            border-radius: 10px;
            margin: 25px 0;
            color: white;
          }
          .highlight-box h3 {
            margin: 0 0 15px 0;
            font-size: 18px;
          }
          .highlight-box ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .highlight-box li {
            margin-bottom: 10px;
            padding-left: 25px;
            position: relative;
          }
          .highlight-box li::before {
            content: '🌟';
            position: absolute;
            left: 0;
            top: 0;
          }
          .cta-section {
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 10px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
          }
          .social-links {
            text-align: center;
            margin: 20px 0;
          }
          .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">❤️ EduHope India</div>
            <h1 class="welcome-title">Welcome to our community! 🎉</h1>
          </div>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for subscribing to our newsletter! We're thrilled to have you join our community of supporters who are making a real difference in the lives of homeless children across India.</p>
          
          <div class="highlight-box">
            <h3>📬 You'll receive regular updates about:</h3>
            <ul>
              <li>Our latest initiatives and success stories</li>
              <li>Ways to get involved and make a difference</li>
              <li>Impact reports and project updates</li>
              <li>Volunteer opportunities in your area</li>
              <li>Fundraising campaigns and events</li>
            </ul>
          </div>
          
          <p>Every story we share represents hope, progress, and the power of community support. Together, we're not just providing education – we're transforming lives and building a brighter future for India's most vulnerable children.</p>
          
          <div class="cta-section">
            <h3>Ready to make an impact?</h3>
            <p>Explore ways you can contribute to our mission:</p>
            <a href="https://eduhopeindia.org/donate" class="cta-button">Make a Donation</a>
            <a href="https://eduhopeindia.org/volunteer" class="cta-button">Volunteer With Us</a>
          </div>
          
          <p>If you have any questions or would like to learn more about our work, please don't hesitate to reply to this email. We love hearing from our supporters!</p>
          
          <div class="social-links">
            <a href="https://facebook.com/eduhopeindia">Facebook</a> |
            <a href="https://twitter.com/eduhopeindia">Twitter</a> |
            <a href="https://instagram.com/eduhopeindia">Instagram</a> |
            <a href="https://linkedin.com/company/eduhopeindia">LinkedIn</a>
          </div>
          
          <div class="footer">
            <p><strong>With gratitude,</strong><br>
            The EduHope India Team</p>
            
            <p style="margin-top: 20px; font-size: 12px;">
              📧 <a href="mailto:info@eduhopeindia.org">info@eduhopeindia.org</a> | 
              📞 +91 93364 66060<br>
              🏢 EduHope India, New Delhi, India
            </p>
            
            <p style="margin-top: 15px; font-size: 11px; color: #9ca3af;">
              You're receiving this email because you subscribed to our newsletter. 
              <a href="{{unsubscribe_url}}" style="color: #667eea;">Unsubscribe</a> | 
              <a href="{{preferences_url}}" style="color: #667eea;">Update Preferences</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateWelcomeEmailText(name) {
    return `
Welcome to EduHope India! 🎉

Dear ${name},

Thank you for subscribing to our newsletter! We're thrilled to have you join our community of supporters who are making a real difference in the lives of homeless children across India.

You'll receive regular updates about:
🌟 Our latest initiatives and success stories
🌟 Ways to get involved and make a difference
🌟 Impact reports and project updates
🌟 Volunteer opportunities in your area
🌟 Fundraising campaigns and events

Every story we share represents hope, progress, and the power of community support. Together, we're not just providing education – we're transforming lives and building a brighter future for India's most vulnerable children.

Ready to make an impact?
- Make a Donation: https://eduhopeindia.org/donate
- Volunteer With Us: https://eduhopeindia.org/volunteer

If you have any questions or would like to learn more about our work, please don't hesitate to reply to this email. We love hearing from our supporters!

Connect with us:
Facebook: https://facebook.com/eduhopeindia
Twitter: https://twitter.com/eduhopeindia
Instagram: https://instagram.com/eduhopeindia
LinkedIn: https://linkedin.com/company/eduhopeindia

With gratitude,
The EduHope India Team

Contact: info@eduhopeindia.org | +91 93364 66060
EduHope India, New Delhi, India

You're receiving this email because you subscribed to our newsletter.
    `;
  }

  async sendEmail(options) {
    if (!this.transporter) {
      throw new Error('Email service not initialized');
    }

    try {
      const info = await this.transporter.sendMail(options);
      return {
        success: true,
        messageId: info.messageId,
        provider: this.currentProvider,
        previewUrl: nodemailer.getTestMessageUrl(info) || null,
      };
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      throw error;
    }
  }

  async sendDonationConfirmationEmail(donationDetails) {
    if (!this.transporter) {
      throw new Error('Email service not initialized');
    }

    const htmlContent = this.generateDonationEmailHTML(donationDetails);
    const textContent = this.generateDonationEmailText(donationDetails);

    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || 'EduHope India',
        address: process.env.FROM_EMAIL || 'donations@eduhopeindia.org',
      },
      to: donationDetails.donorEmail,
      subject: `Thank you for your donation! Receipt: ${donationDetails.receipt}`,
      html: htmlContent,
      text: textContent,
      replyTo: process.env.REPLY_TO_EMAIL || 'info@eduhopeindia.org',
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      
      // Log preview URL for test accounts
      if (this.currentProvider === 'Test Account' || this.currentProvider === 'Ethereal Email') {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('📧 Donation Email Preview URL:', previewUrl);
      }

      return {
        success: true,
        messageId: info.messageId,
        provider: this.currentProvider,
        previewUrl: nodemailer.getTestMessageUrl(info) || null,
      };
    } catch (error) {
      console.error('❌ Failed to send donation confirmation email:', error);
      throw error;
    }
  }

  generateDonationEmailHTML(donationDetails) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Donation Receipt - EduHope India</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
          }
          .receipt-title {
            font-size: 24px;
            color: #059669;
            margin-bottom: 10px;
          }
          .receipt-box {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            padding: 25px;
            border-radius: 10px;
            margin: 25px 0;
            color: white;
          }
          .receipt-box h3 {
            margin: 0 0 15px 0;
            font-size: 18px;
          }
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
          }
          .detail-item {
            background-color: #f9fafb;
            padding: 15px;
            border-radius: 8px;
          }
          .detail-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          .detail-value {
            font-weight: 600;
            color: #1f2937;
          }
          .impact-section {
            background-color: #eff6ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #3b82f6;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">❤️ EduHope India</div>
            <h1 class="receipt-title">Donation Receipt</h1>
            <p>Thank you for your generous contribution!</p>
          </div>
          
          <div class="receipt-box">
            <h3>💚 Your donation has been successfully processed</h3>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">
              Amount: ₹${donationDetails.amount.toLocaleString('en-IN')}<br>
              Receipt Number: ${donationDetails.receipt}<br>
              Date: ${new Date(donationDetails.paidAt).toLocaleDateString('en-IN')}
            </p>
          </div>
          
          <div class="details-grid">
            <div class="detail-item">
              <div class="detail-label">Donor Name</div>
              <div class="detail-value">${donationDetails.donorName}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Order ID</div>
              <div class="detail-value">${donationDetails.orderId}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Payment Method</div>
              <div class="detail-value">${donationDetails.paymentMethod || 'Online'}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Certificate Number</div>
              <div class="detail-value">${donationDetails.certificateNumber}</div>
            </div>
          </div>
          
          <div class="impact-section">
            <h3 style="margin-top: 0; color: #1e40af;">Your Impact</h3>
            <p>Your contribution of ₹${donationDetails.amount.toLocaleString('en-IN')} will help us:</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              ${donationDetails.amount >= 5000 ? '<li>Provide educational materials for 10+ children for a month</li>' : ''}
              ${donationDetails.amount >= 2500 ? '<li>Support nutritious meals for homeless children</li>' : ''}
              ${donationDetails.amount >= 1000 ? '<li>Fund basic learning supplies and books</li>' : ''}
              <li>Contribute to shelter and safety programs</li>
              <li>Support our ongoing outreach initiatives</li>
            </ul>
          </div>
          
          <p><strong>Important Notes:</strong></p>
          <ul>
            <li>This receipt is valid for tax exemption purposes under Section 80G</li>
            <li>Please retain this receipt for your records</li>
            <li>Certificate will be emailed within 7 business days</li>
          </ul>
          
          <div class="footer">
            <p><strong>Thank you for supporting our mission!</strong><br>
            The EduHope India Team</p>
            
            <p style="margin-top: 20px; font-size: 12px;">
              📧 <a href="mailto:info@eduhopeindia.org">info@eduhopeindia.org</a> | 
              📞 +91 93364 66060<br>
              🏢 EduHope India, New Delhi, India
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateDonationEmailText(donationDetails) {
    return `
DONATION RECEIPT - EduHope India

Dear ${donationDetails.donorName},

Thank you for your generous donation! Your contribution will make a real difference in the lives of homeless children across India.

DONATION DETAILS:
Amount: ₹${donationDetails.amount.toLocaleString('en-IN')}
Receipt Number: ${donationDetails.receipt}
Order ID: ${donationDetails.orderId}
Certificate Number: ${donationDetails.certificateNumber}
Date: ${new Date(donationDetails.paidAt).toLocaleDateString('en-IN')}
Payment Method: ${donationDetails.paymentMethod || 'Online'}

YOUR IMPACT:
Your contribution of ₹${donationDetails.amount.toLocaleString('en-IN')} will help us:
${donationDetails.amount >= 5000 ? '• Provide educational materials for 10+ children for a month\n' : ''}${donationDetails.amount >= 2500 ? '• Support nutritious meals for homeless children\n' : ''}${donationDetails.amount >= 1000 ? '• Fund basic learning supplies and books\n' : ''}• Contribute to shelter and safety programs
• Support our ongoing outreach initiatives

IMPORTANT NOTES:
• This receipt is valid for tax exemption purposes under Section 80G
• Please retain this receipt for your records
• Certificate will be emailed within 7 business days

Thank you for supporting our mission!

With gratitude,
The EduHope India Team

Contact: info@eduhopeindia.org | +91 93364 66060
EduHope India, New Delhi, India
    `;
  }

  getProviderInfo() {
    return {
      provider: this.currentProvider,
      isConnected: !!this.transporter,
    };
  }
}

// Create singleton instance
const emailService = new EmailService();

export default emailService;
