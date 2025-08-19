import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  // Basic donation information
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayPaymentId: {
    type: String,
    unique: true,
    sparse: true // Allows null values but unique when not null
  },
  razorpaySignature: {
    type: String
  },
  
  // Donor information
  donorName: {
    type: String,
    required: true,
    trim: true
  },
  donorEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  donorPhone: {
    type: String,
    trim: true
  },
  
  // Payment details
  amount: {
    type: Number,
    required: true,
    min: [100, 'Minimum donation amount is ₹100']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['created', 'attempted', 'paid', 'failed', 'refunded'],
    default: 'created'
  },
  paymentMethod: {
    type: String // Will be populated after payment
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  paidAt: {
    type: Date
  },
  
  // Additional metadata
  notes: {
    type: Map,
    of: String,
    default: {}
  },
  receipt: {
    type: String
  },
  
  // Certificate information (for future use)
  certificateNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  certificateUrl: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
donationSchema.index({ donorEmail: 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ createdAt: -1 });
donationSchema.index({ razorpayOrderId: 1 });
donationSchema.index({ razorpayPaymentId: 1 });

// Virtual for formatted amount with commas
donationSchema.virtual('formattedAmount').get(function() {
  return `₹${this.amount.toLocaleString('en-IN')}`;
});

// Method to generate receipt number with format (EDU20250818XXXX (EDU + date + random 4 digits))
donationSchema.methods.generateReceipt = function() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `EDU${date}${random}`;
};

// Static method to get donation statistics
donationSchema.statics.getDonationStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);
  
  const totalDonations = await this.countDocuments();
  const totalAmount = await this.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  
  return {
    total: totalDonations,
    totalAmount: totalAmount[0]?.total || 0,
    byStatus: stats,
    recentDonations: await this.find({ status: 'paid' })
      .sort({ paidAt: -1 })
      .limit(5)
      .select('donorName amount paidAt')
  };
};

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;
