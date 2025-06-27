import express from 'express';
import mongoose from 'mongoose';
import NewsletterSubscription from '../models/NewsletterSubscription.js';
import emailService from '../services/emailService.js';
import { validateNewsletterSubscription, validateEmail } from '../validators/newsletter.js';

const router = express.Router();

// Test endpoint to verify newsletter API is working
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Newsletter API is working',
    timestamp: new Date().toISOString(),
    database: isDatabaseConnected() ? 'connected' : 'disconnected'
  });
});

// Test Gmail newsletter service
router.post('/test-gmail', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }
    
    // Import Gmail service dynamically
    const { default: gmailNewsletterService } = await import('../services/gmailNewsletterService.js');
    
    const result = await gmailNewsletterService.sendTestEmail(email);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Test email sent successfully via Gmail!',
        data: result
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error
      });
    }
    
  } catch (error) {
    console.error('❌ Gmail test error:', error);
    res.status(500).json({
      success: false,
      message: 'Gmail newsletter service test failed',
      error: error.message
    });
  }
});

// Helper function to check database connectivity
const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Middleware to check database connection for routes that need it
const requireDatabase = (req, res, next) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      success: false,
      message: 'Database not available. Please try again later.',
      error: 'DATABASE_UNAVAILABLE'
    });
  }
  next();
};

// Subscribe to newsletter
router.post('/subscribe', requireDatabase, async (req, res) => {
  try {
    // Validate input
    const { error, value } = validateNewsletterSubscription(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
      });
    }

    const { email, name, source, preferences } = value;

    // Check if email already exists
    const existingSubscription = await NewsletterSubscription.findOne({ email });
    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res.status(409).json({
          success: false,
          message: 'This email is already subscribed to our newsletter.'
        });
      } else {
        // Reactivate subscription
        existingSubscription.isActive = true;
        existingSubscription.subscribedAt = new Date();
        existingSubscription.unsubscribedAt = null;
        existingSubscription.name = name || existingSubscription.name;
        existingSubscription.source = source;
        existingSubscription.preferences = preferences || existingSubscription.preferences;
        
        await existingSubscription.save();

        // Send welcome email
        try {
          const emailResult = await emailService.sendWelcomeEmail(email, name);
        } catch (emailError) {
          console.error('❌ Welcome email failed:', emailError);
          // Don't fail the subscription if email fails
        }

        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
          data: {
            email: existingSubscription.email,
            name: existingSubscription.name,
            subscribedAt: existingSubscription.subscribedAt
          }
        });
      }
    }

    // Create new subscription
    const subscription = new NewsletterSubscription({
      email,
      name: name || null,
      source: source || 'website',
      preferences: preferences || {
        frequency: 'monthly',
        topics: ['updates', 'success_stories']
      },
      metadata: {
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        referrer: req.get('Referer')
      }
    });

    await subscription.save();

    // Send welcome email
    try {
      const emailResult = await emailService.sendWelcomeEmail(email, name);

      res.status(201).json({
        success: true,
        message: 'Thank you for subscribing! Check your email for a welcome message.',
        data: {
          email: subscription.email,
          name: subscription.name,
          subscribedAt: subscription.subscribedAt
        },
        emailInfo: {
          sent: true,
          provider: emailResult.provider,
          previewUrl: emailResult.previewUrl
        }
      });
    } catch (emailError) {
      console.error('❌ Welcome email failed:', emailError);
      
      res.status(201).json({
        success: true,
        message: 'Thank you for subscribing! Welcome email will be sent shortly.',
        data: {
          email: subscription.email,
          name: subscription.name,
          subscribedAt: subscription.subscribedAt
        },
        emailInfo: {
          sent: false,
          error: 'Email service temporarily unavailable'
        }
      });
    }

  } catch (error) {
    console.error('❌ Newsletter subscription error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This email is already subscribed to our newsletter.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to process subscription. Please try again later.'
    });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { error, value } = validateEmail(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    const { email } = value;

    const subscription = await NewsletterSubscription.findOne({ email });
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Email address not found in our subscriber list.'
      });
    }

    if (!subscription.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This email is already unsubscribed.'
      });
    }

    await subscription.unsubscribe();

    res.status(200).json({
      success: true,
      message: 'You have been successfully unsubscribed from our newsletter.'
    });

  } catch (error) {
    console.error('❌ Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process unsubscribe request. Please try again later.'
    });
  }
});

// Get subscription status
router.get('/status/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const subscription = await NewsletterSubscription.findOne({ email });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Email address not found in our subscriber list.',
        data: { subscribed: false }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        email: subscription.email,
        name: subscription.name,
        subscribed: subscription.isActive,
        subscribedAt: subscription.subscribedAt,
        subscriptionStatus: subscription.subscriptionStatus,
        preferences: subscription.preferences
      }
    });

  } catch (error) {
    console.error('❌ Status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check subscription status.'
    });
  }
});

// Get newsletter statistics (admin endpoint)
router.get('/stats', async (req, res) => {
  try {
    const totalSubscriptions = await NewsletterSubscription.countDocuments();
    const activeSubscriptions = await NewsletterSubscription.countDocuments({ isActive: true });
    const recentSubscriptions = await NewsletterSubscription.countDocuments({
      subscribedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    });

    const subscriptionsBySource = await NewsletterSubscription.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalSubscriptions,
        active: activeSubscriptions,
        inactive: totalSubscriptions - activeSubscriptions,
        recent: recentSubscriptions,
        bySource: subscriptionsBySource,
        emailProvider: emailService.getProviderInfo()
      }
    });

  } catch (error) {
    console.error('❌ Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch newsletter statistics.'
    });
  }
});

// Health check for email service
router.get('/email/health', async (req, res) => {
  try {
    const providerInfo = emailService.getProviderInfo();
    
    res.status(200).json({
      success: true,
      data: {
        emailService: providerInfo,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Email health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Email service health check failed.'
    });
  }
});

// General health check for entire service
router.get('/health', async (req, res) => {
  try {
    const dbConnected = isDatabaseConnected();
    const providerInfo = emailService.getProviderInfo();
    
    res.status(200).json({
      success: true,
      data: {
        status: 'operational',
        database: {
          connected: dbConnected,
          status: dbConnected ? 'connected' : 'disconnected'
        },
        emailService: providerInfo,
        server: {
          uptime: process.uptime(),
          environment: process.env.NODE_ENV || 'development',
          nodeVersion: process.version
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Health check failed.',
      error: error.message
    });
  }
});

export default router;
