import express from 'express';
import Joi from 'joi';
import rateLimit from 'express-rate-limit';
import Donation from '../models/Donation.js';
import razorpayService from '../services/razorpayService.js';
import emailService from '../services/emailService.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Test endpoint to verify API is working
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Donation API is working',
    timestamp: new Date().toISOString()
  });
});

// Rate limiter for payment operations
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 payment requests per windowMs
  message: {
    success: false,
    message: 'Too many payment attempts, please try again later'
  }
});

// Validation schemas
const createOrderSchema = Joi.object({
  amount: Joi.number().min(100).max(5000000).required(),
  donorName: Joi.string().min(2).max(100).required(),
  donorEmail: Joi.string().email().required(),
  donorPhone: Joi.alternatives().try(
    Joi.string().pattern(/^[6-9]\d{9}$/),
    Joi.string().allow(''),
    Joi.allow(null)
  ).optional(),
  notes: Joi.object().optional()
});

const verifyPaymentSchema = Joi.object({
  orderId: Joi.string().required(),
  razorpayOrderId: Joi.string().required(),
  razorpayPaymentId: Joi.string().required(),
  razorpaySignature: Joi.string().required()
});

// Create donation order
router.post('/create-order', paymentLimiter, async (req, res) => {
  try {
    // Check if body is empty or not properly parsed
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is empty or not properly formatted',
        details: 'Make sure to send JSON data with Content-Type: application/json'
      });
    }

    // Validate request body
    const { error, value } = createOrderSchema.validate(req.body);
    if (error) {
      console.error('❌ Validation Error:', error.details);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details[0].message,
        field: error.details[0].path[0],
        receivedValue: error.details[0].context?.value
      });
    }

    const { amount, donorName, donorEmail, donorPhone, notes } = value;

    // Log extracted values
    console.log('✅ Validated Data:', { amount, donorName, donorEmail, donorPhone });

    // Validate amount with Razorpay service
    if (!razorpayService.validateAmount(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount. Amount should be between ₹1 and ₹5,00,00,000'
      });
    }

    // Generate unique order ID and receipt
    const orderId = uuidv4();
    const receipt = razorpayService.generateReceipt(donorName);

    // Create Razorpay order
    const razorpayOrder = await razorpayService.createOrder(
      amount,
      receipt,
      { donorEmail, orderId, ...notes }
    );

    if (!razorpayOrder.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment order',
        error: razorpayOrder.error
      });
    }

    // Save donation record in database
    const donation = new Donation({
      orderId,
      razorpayOrderId: razorpayOrder.order.id,
      donorName,
      donorEmail,
      donorPhone,
      amount,
      receipt,
      notes: notes || {},
      status: 'created'
    });

    await donation.save();

    // Return order details to frontend
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: donation.orderId,
        razorpayOrderId: razorpayOrder.order.id,
        amount: amount,
        currency: 'INR',
        receipt: receipt,
        donorName: donorName,
        donorEmail: donorEmail,
        key: process.env.RAZORPAY_KEY_ID
      }
    });

  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating order',
      error: error.message
    });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = verifyPaymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details[0].message
      });
    }

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = value;

    // Find donation record
    const donation = await Donation.findOne({ orderId });
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation record not found'
      });
    }

    // Verify payment signature
    const isValidSignature = razorpayService.verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValidSignature) {
      // Update donation status to failed
      donation.status = 'failed';
      donation.notes.set('failureReason', 'Invalid payment signature');
      await donation.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Get payment details from Razorpay
    const paymentDetails = await razorpayService.getPaymentDetails(razorpayPaymentId);
    
    if (!paymentDetails.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch payment details'
      });
    }

    // Update donation record
    donation.razorpayPaymentId = razorpayPaymentId;
    donation.razorpaySignature = razorpaySignature;
    donation.status = 'paid';
    donation.paidAt = new Date();
    donation.paymentMethod = paymentDetails.payment.method;
    donation.notes.set('paymentDetails', JSON.stringify(paymentDetails.payment));

    // Generate certificate number for successful payment
    if (!donation.certificateNumber) {
      donation.certificateNumber = donation.generateReceipt();
    }    await donation.save();

    // Send confirmation email
    try {
      await emailService.sendDonationConfirmationEmail({
        donorName: donation.donorName,
        donorEmail: donation.donorEmail,
        amount: donation.amount,
        receipt: donation.receipt,
        orderId: donation.orderId,
        certificateNumber: donation.certificateNumber,
        paidAt: donation.paidAt,
        paymentMethod: donation.paymentMethod
      });
    } catch (emailError) {
      console.error('⚠️ Failed to send donation confirmation email:', emailError);
      // Don't fail the transaction if email fails
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: donation.orderId,
        donationId: donation._id,
        amount: donation.amount,
        status: donation.status,
        receiptNumber: donation.receipt,
        certificateNumber: donation.certificateNumber,
        donorName: donation.donorName,
        paidAt: donation.paidAt
      }
    });

  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while verifying payment',
      error: error.message
    });
  }
});

// Get donation details
router.get('/details/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const donation = await Donation.findOne({ orderId }).select('-notes');
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Format the response to match frontend expectations
    const formattedData = {
      orderId: donation.orderId,
      amount: donation.amount,
      donorName: donation.donorName,
      receiptNumber: donation.receipt,
      certificateNumber: donation.certificateNumber,
      paidAt: donation.paidAt,
      status: donation.status,
      createdAt: donation.createdAt,
      paymentMethod: donation.paymentMethod
    };

    res.status(200).json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    console.error('Get Donation Details Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Webhook handler for Razorpay events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      return res.status(500).json({ success: false, message: 'Webhook not configured' });
    }

    // Verify webhook signature
    const isValidWebhook = razorpayService.verifyWebhookSignature(
      req.body,
      webhookSignature,
      webhookSecret
    );

    if (!isValidWebhook) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const event = JSON.parse(req.body);
    
    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      
      case 'order.paid':
        await handleOrderPaid(event.payload.order.entity);
        break;
      
      default:
        console.log(`Unhandled webhook event: ${event.event}`);
    }

    res.status(200).json({ success: true, message: 'Webhook processed' });

  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
});

// Helper function to handle payment captured webhook
async function handlePaymentCaptured(payment) {
  try {
    const donation = await Donation.findOne({ razorpayOrderId: payment.order_id });
    if (donation && donation.status !== 'paid') {
      donation.status = 'paid';
      donation.paidAt = new Date(payment.created_at * 1000);
      donation.paymentMethod = payment.method;
      donation.notes.set('webhookProcessed', 'payment.captured');
      await donation.save();
      console.log(`Payment captured for order: ${payment.order_id}`);
    }
  } catch (error) {
    console.error('Handle Payment Captured Error:', error);
  }
}

// Helper function to handle payment failed webhook
async function handlePaymentFailed(payment) {
  try {
    const donation = await Donation.findOne({ razorpayOrderId: payment.order_id });
    if (donation) {
      donation.status = 'failed';
      donation.notes.set('failureReason', payment.error_description || 'Payment failed');
      donation.notes.set('webhookProcessed', 'payment.failed');
      await donation.save();
    }
  } catch (error) {
    console.error('Handle Payment Failed Error:', error);
  }
}

// Helper function to handle order paid webhook
async function handleOrderPaid(order) {
  try {
    const donation = await Donation.findOne({ razorpayOrderId: order.id });
    if (donation) {
      donation.notes.set('orderPaidWebhook', new Date().toISOString());
      await donation.save();
    }
  } catch (error) {
    console.error('Handle Order Paid Error:', error);
  }
}

// Get donation statistics (admin endpoint)
router.get('/stats', async (req, res) => {
  try {
    const stats = await Donation.getDonationStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get Donation Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donation statistics',
      error: error.message
    });
  }
});

export default router;
