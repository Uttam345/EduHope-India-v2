import nodemailer from 'nodemailer';

class GmailNewsletterService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
  }

  async initializeTransporter() {
    if (this.initialized) {
      return;
    }

    try {
      // Validate Gmail credentials
      if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        throw new Error('Gmail credentials not found in environment variables');
      }

      // Create Gmail transporter
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify the connection
      await this.transporter.verify();
      this.initialized = true;
      console.log('✅ Gmail Newsletter Service initialized successfully');

    } catch (error) {
      console.error('❌ Gmail Newsletter Service initialization failed:', error.message);
      throw error;
    }
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initializeTransporter();
    }
  }

  // Send welcome email to new subscribers
  async sendWelcomeEmail(email, name = null) {
    try {
      await this.ensureInitialized();
      
      const displayName = name || email.split('@')[0];
      
      const mailOptions = {
        from: {
          name: process.env.FROM_NAME || 'EduHope India',
          address: process.env.FROM_EMAIL || process.env.GMAIL_USER
        },
        to: email,
        subject: '🎉 Welcome to EduHope India Newsletter!',
        html: this.generateWelcomeEmailTemplate(displayName),
        text: this.generateWelcomeEmailText(displayName)
      };

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: result.messageId,
        email: email,
        provider: 'Gmail'
      };

    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      return {
        success: false,
        error: error.message,
        email: email
      };
    }
  }

  // Send donation confirmation email
  async sendDonationConfirmationEmail(donationData) {
    try {
      await this.ensureInitialized();
      
      const {
        donorName,
        donorEmail,
        amount,
        receipt,
        orderId,
        certificateNumber,
        paidAt,
        paymentMethod
      } = donationData;

      const mailOptions = {
        from: {
          name: process.env.FROM_NAME || 'EduHope India',
          address: process.env.FROM_EMAIL || process.env.GMAIL_USER
        },
        to: donorEmail,
        subject: `✅ Donation Confirmation - Receipt #${receipt}`,
        html: this.generateDonationConfirmationTemplate(donationData),
        text: this.generateDonationConfirmationText(donationData)
      };

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: result.messageId,
        email: donorEmail,
        provider: 'Gmail'
      };

    } catch (error) {
      console.error('❌ Failed to send donation confirmation email:', error);
      return {
        success: false,
        error: error.message,
        email: donationData.donorEmail
      };
    }
  }

  // Send newsletter to subscribers
  async sendNewsletter(subscribers, subject, content) {
    try {
      await this.ensureInitialized();
      
      const results = [];
      
      // Send emails in batches to avoid rate limits
      const batchSize = 10;
      for (let i = 0; i < subscribers.length; i += batchSize) {
        const batch = subscribers.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (subscriber) => {
          try {
            const mailOptions = {
              from: {
                name: process.env.FROM_NAME || 'EduHope India',
                address: process.env.FROM_EMAIL || process.env.GMAIL_USER
              },
              to: subscriber.email,
              subject: subject,
              html: this.generateNewsletterTemplate(subscriber.name || 'Friend', content),
              text: this.generateNewsletterText(subscriber.name || 'Friend', content)
            };

            const result = await this.transporter.sendMail(mailOptions);
            return {
              email: subscriber.email,
              success: true,
              messageId: result.messageId
            };
          } catch (error) {
            console.error(`❌ Failed to send newsletter to ${subscriber.email}:`, error.message);
            return {
              email: subscriber.email,
              success: false,
              error: error.message
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);

        // Add delay between batches to respect Gmail limits
        if (i + batchSize < subscribers.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      return {
        success: true,
        total: subscribers.length,
        successful,
        failed,
        results
      };

    } catch (error) {
      console.error('❌ Failed to send newsletter:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate welcome email HTML template
  generateWelcomeEmailTemplate(name) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to EduHope India</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { color: #667eea; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome to EduHope India!</h1>
                <p>Thank you for joining our mission to educate homeless children</p>
            </div>
            <div class="content">
                <h2>Hello ${name}!</h2>
                <p>We're thrilled to have you as part of the <span class="highlight">EduHope India</span> community. Your subscription helps us keep you updated on our progress in providing education and support to homeless children across India.</p>
                
                <h3>What to expect:</h3>
                <ul>
                    <li>📚 Monthly updates on our educational programs</li>
                    <li>💝 Success stories from children we've helped</li>
                    <li>🎯 Impact reports showing how donations are used</li>
                    <li>🤝 Volunteer opportunities and events</li>
                </ul>

                <p>Together, we can make a difference in the lives of children who need our help the most.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://eduhopeindia.org" class="button">Visit Our Website</a>
                </div>

                <p>With gratitude,<br><strong>The EduHope India Team</strong></p>
            </div>
            <div class="footer">
                <p>You're receiving this email because you subscribed to our newsletter.<br>
                If you no longer wish to receive these emails, you can <a href="#">unsubscribe here</a>.</p>
            </div>
        </div>
    </body>
    </html>`;
  }

  // Generate welcome email text version
  generateWelcomeEmailText(name) {
    return `
🎉 Welcome to EduHope India Newsletter!

Hello ${name}!

Thank you for joining our mission to educate homeless children across India. We're thrilled to have you as part of the EduHope India community.

What to expect:
- Monthly updates on our educational programs
- Success stories from children we've helped
- Impact reports showing how donations are used
- Volunteer opportunities and events

Together, we can make a difference in the lives of children who need our help the most.

Visit our website: https://eduhopeindia.org

With gratitude,
The EduHope India Team

---
You're receiving this email because you subscribed to our newsletter.
If you no longer wish to receive these emails, you can unsubscribe by replying to this email.
    `;
  }

  // Generate donation confirmation email template
  generateDonationConfirmationTemplate(donationData) {
    const { donorName, amount, receipt, orderId, certificateNumber, paidAt, paymentMethod } = donationData;
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Donation Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .donation-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .amount { font-size: 24px; color: #10b981; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Donation Successful!</h1>
                <p>Thank you for your generous contribution</p>
            </div>
            <div class="content">
                <h2>Dear ${donorName},</h2>
                <p>We have successfully received your donation. Your generosity will directly impact the lives of homeless children across India.</p>
                
                <div class="donation-details">
                    <h3>Donation Details:</h3>
                    <p><strong>Amount:</strong> <span class="amount">₹${amount.toLocaleString('en-IN')}</span></p>
                    <p><strong>Receipt Number:</strong> ${receipt}</p>
                    <p><strong>Order ID:</strong> ${orderId}</p>
                    <p><strong>Certificate Number:</strong> ${certificateNumber}</p>
                    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                    <p><strong>Date:</strong> ${new Date(paidAt).toLocaleString('en-IN')}</p>
                </div>

                <h3>Your Impact:</h3>
                <p>Your donation of ₹${amount.toLocaleString('en-IN')} will help us:</p>
                <ul>
                    <li>Provide educational materials and books</li>
                    <li>Support nutritious meals for children</li>
                    <li>Fund shelter and safety programs</li>
                    <li>Organize skill development workshops</li>
                </ul>

                <p><strong>Tax Certificate:</strong> A tax-exemption certificate will be emailed to you within 7 business days.</p>

                <p>Thank you for believing in our mission and making a difference!</p>
                
                <p>With deep gratitude,<br><strong>The EduHope India Team</strong></p>
            </div>
        </div>
    </body>
    </html>`;
  }

  // Generate donation confirmation text version
  generateDonationConfirmationText(donationData) {
    const { donorName, amount, receipt, orderId, certificateNumber, paidAt, paymentMethod } = donationData;
    
    return `
✅ Donation Confirmation - EduHope India

Dear ${donorName},

Thank you for your generous donation! We have successfully received your contribution.

Donation Details:
- Amount: ₹${amount.toLocaleString('en-IN')}
- Receipt Number: ${receipt}
- Order ID: ${orderId}
- Certificate Number: ${certificateNumber}
- Payment Method: ${paymentMethod}
- Date: ${new Date(paidAt).toLocaleString('en-IN')}

Your Impact:
Your donation will help us provide educational materials, nutritious meals, shelter, and skill development programs for homeless children across India.

A tax-exemption certificate will be emailed to you within 7 business days.

Thank you for believing in our mission and making a difference!

With deep gratitude,
The EduHope India Team
    `;
  }

  // Generate newsletter template
  generateNewsletterTemplate(name, content) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EduHope India Newsletter</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📧 EduHope India Newsletter</h1>
                <p>Making a difference together</p>
            </div>
            <div class="content">
                <h2>Hello ${name}!</h2>
                ${content}
                <p>Thank you for being part of our mission!</p>
                <p>With gratitude,<br><strong>The EduHope India Team</strong></p>
            </div>
            <div class="footer">
                <p>You're receiving this email because you subscribed to our newsletter.<br>
                <a href="#">Unsubscribe</a> | <a href="#">Update Preferences</a></p>
            </div>
        </div>
    </body>
    </html>`;
  }

  // Generate newsletter text version
  generateNewsletterText(name, content) {
    return `
EduHope India Newsletter

Hello ${name}!

${content.replace(/<[^>]*>/g, '')}

Thank you for being part of our mission!

With gratitude,
The EduHope India Team

---
You're receiving this email because you subscribed to our newsletter.
Reply to this email to unsubscribe or update your preferences.
    `;
  }

  // Test email functionality
  async sendTestEmail(email) {
    try {
      await this.ensureInitialized();
      
      const mailOptions = {
        from: {
          name: process.env.FROM_NAME || 'EduHope India',
          address: process.env.FROM_EMAIL || process.env.GMAIL_USER
        },
        to: email,
        subject: '🧪 Gmail Newsletter Service Test',
        html: `
          <h2>✅ Gmail Newsletter Service Test</h2>
          <p>This is a test email to verify that the Gmail newsletter service is working correctly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>Service:</strong> Gmail SMTP</p>
          <p><strong>Status:</strong> Working perfectly!</p>
        `,
        text: `
Gmail Newsletter Service Test

This is a test email to verify that the Gmail newsletter service is working correctly.

Timestamp: ${new Date().toISOString()}
Service: Gmail SMTP
Status: Working perfectly!
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
        email: email,
        provider: 'Gmail'
      };

    } catch (error) {
      console.error('❌ Failed to send test email:', error);
      return {
        success: false,
        error: error.message,
        email: email
      };
    }
  }
}

export default new GmailNewsletterService();
