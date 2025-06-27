import Razorpay from 'razorpay';
import crypto from 'crypto';

class RazorpayService {
  constructor() {
    this.razorpay = null;
  }

  // Initialize Razorpay instance lazily
  _initRazorpay() {
    if (!this.razorpay) {
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay credentials not found in environment variables');
      }
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });
    }
    return this.razorpay;
  }
  // Create a Razorpay order
  async createOrder(amount, receipt, notes = {}) {
    try {
      const razorpay = this._initRazorpay();
      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        receipt: receipt,
        notes: notes
      };

      const order = await razorpay.orders.create(options);
      return {
        success: true,
        order: order
      };
    } catch (error) {
      console.error('Razorpay Order Creation Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify payment signature
  verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    try {
      const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const digest = shasum.digest('hex');

      return digest === razorpaySignature;
    } catch (error) {
      console.error('Payment Signature Verification Error:', error);
      return false;
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(webhookBody, webhookSignature, webhookSecret) {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(webhookBody))
        .digest('hex');

      return expectedSignature === webhookSignature;
    } catch (error) {
      console.error('Webhook Signature Verification Error:', error);
      return false;
    }
  }
  // Fetch payment details
  async getPaymentDetails(paymentId) {
    try {
      const razorpay = this._initRazorpay();
      const payment = await razorpay.payments.fetch(paymentId);
      return {
        success: true,
        payment: payment
      };
    } catch (error) {
      console.error('Fetch Payment Details Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  // Capture payment (for authorized payments)
  async capturePayment(paymentId, amount) {
    try {
      const razorpay = this._initRazorpay();
      const payment = await razorpay.payments.capture(paymentId, amount * 100);
      return {
        success: true,
        payment: payment
      };
    } catch (error) {
      console.error('Payment Capture Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Refund payment
  async refundPayment(paymentId, amount = null, notes = {}) {
    try {
      const refundData = {
        notes: notes
      };
        if (amount) {
        refundData.amount = amount * 100; // Convert to paise
      }

      const razorpay = this._initRazorpay();
      const refund = await razorpay.payments.refund(paymentId, refundData);
      return {
        success: true,
        refund: refund
      };
    } catch (error) {
      console.error('Payment Refund Error:', error);
      return {
        success: false,
        error: error.message
      };    }
  }

  // Get order details
  async getOrderDetails(orderId) {
    try {
      const razorpay = this._initRazorpay();
      const order = await razorpay.orders.fetch(orderId);
      return {
        success: true,
        order: order
      };
    } catch (error) {
      console.error('Fetch Order Details Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate order receipt
  generateReceipt(donorName) {
    const timestamp = Date.now();
    const shortName = donorName.replace(/\s+/g, '').substring(0, 4).toUpperCase();
    return `EDU_${shortName}_${timestamp}`;
  }

  // Validate amount
  validateAmount(amount) {
    const numAmount = parseFloat(amount);
    return numAmount >= 1 && numAmount <= 50000000; // Razorpay limits: ₹1 to ₹5 crore
  }

  // Format amount for display
  formatAmount(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
}

export default new RazorpayService();
