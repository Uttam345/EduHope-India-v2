import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface DonationFormData {
  amount: number;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
}

const DonationCard: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DonationFormData>({
    amount: 500,
    donorName: '',
    donorEmail: '',
    donorPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const predefinedAmounts = [100, 500, 1000, 2500, 5000];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseInt(value) || 0 : value
    }));
  };

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({ ...prev, amount }));
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate form
      if (!formData.donorName || !formData.donorEmail || formData.amount < 100) {
        throw new Error('Please fill in all required fields with valid values');
      }

      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load payment gateway. Please try again.');
      }

      // Create order
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/donation/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const orderData = await response.json();
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Configure Razorpay options
      const options = {
        key: orderData.data.key,
        amount: orderData.data.amount * 100,
        currency: orderData.data.currency,
        name: 'EduHope India',
        description: 'Donation for homeless children education',
        order_id: orderData.data.razorpayOrderId,
        prefill: {
          name: formData.donorName,
          email: formData.donorEmail,
          contact: formData.donorPhone,
        },
        theme: {
          color: '#667eea',
        },
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/donation/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: orderData.data.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              // Redirect to success page with order details
              navigate(`/donation/success?orderId=${verifyData.data.orderId}`);
            } else {
              throw new Error(verifyData.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setError('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError('Payment was cancelled');
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Support Our Mission</h2>
        <p className="text-gray-600">
          Your contribution helps us provide education and support to homeless children across India.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handlePayment} className="space-y-4">
        {/* Amount Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Donation Amount (₹)
          </label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handleAmountSelect(amount)}
                className={`py-2 px-3 rounded border text-sm font-medium transition-colors ${
                  formData.amount === amount
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                ₹{amount}
              </button>
            ))}
          </div>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            min="100"
            max="500000"
            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter custom amount"
            required
          />
        </div>

        {/* Donor Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="donorName"
            value={formData.donorName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium  text-black mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="donorEmail"
            value={formData.donorEmail}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="donorPhone"
            value={formData.donorPhone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
            pattern="[6-9][0-9]{9}"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
          } text-white focus:outline-none`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Donate ₹${formData.amount}`
          )}
        </button>
      </form>

      {/* Security Notice */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secure payment powered by Razorpay
        </div>
      </div>
    </div>
  );
};

export default DonationCard;