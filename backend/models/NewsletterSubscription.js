import mongoose from 'mongoose';

const newsletterSubscriptionSchema = new mongoose.Schema({  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  name: {
    type: String,
    trim: true,
    maxlength: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date,
    default: null
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    default: null
  },
  source: {
    type: String,
    enum: ['website', 'donation', 'event', 'referral', 'other'],
    default: 'website'
  },
  preferences: {
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly'],
      default: 'monthly'
    },
    topics: [{
      type: String,
      enum: ['updates', 'success_stories', 'events', 'fundraising', 'volunteer_opportunities']
    }]
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    referrer: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
newsletterSubscriptionSchema.index({ isActive: 1, subscribedAt: -1 });

// Virtual for subscription status
newsletterSubscriptionSchema.virtual('subscriptionStatus').get(function() {
  if (!this.isActive) return 'unsubscribed';
  if (!this.emailVerified) return 'pending_verification';
  return 'active';
});

// Pre-save middleware to handle email normalization
newsletterSubscriptionSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  next();
});

// Static method to find active subscribers
newsletterSubscriptionSchema.statics.findActive = function() {
  return this.find({ isActive: true, emailVerified: true });
};

// Instance method to unsubscribe
newsletterSubscriptionSchema.methods.unsubscribe = function() {
  this.isActive = false;
  this.unsubscribedAt = new Date();
  return this.save();
};

const NewsletterSubscription = mongoose.model('NewsletterSubscription', newsletterSubscriptionSchema);

export default NewsletterSubscription;
