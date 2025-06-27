import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

interface DonationDetails {
  orderId: string;
  amount: number;
  donorName: string;
  receiptNumber?: string;
  certificateNumber?: string;
  paidAt?: string;
  status: string;
  createdAt: string;
  paymentMethod?: string;
}

const DonationSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [donationDetails, setDonationDetails] = useState<DonationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      fetchDonationDetails(orderId);
    } else {
      setError('No order ID provided');
      setLoading(false);
    }
  }, [orderId]);

  const fetchDonationDetails = async (orderId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/donation/details/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setDonationDetails(data.data);
      } else {
        setError('Failed to fetch donation details');
      }
    } catch (error) {
      console.error('Error fetching donation details:', error);
      setError('Failed to load donation details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading donation details...</p>
        </div>
      </div>
    );
  }

  if (error || !donationDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/donate"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  // Check if payment is still pending
  const isPaymentPending = donationDetails.status === 'created';
  const isPaymentSuccessful = donationDetails.status === 'paid';

  if (isPaymentPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-yellow-500 text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Pending</h1>
          <p className="text-gray-600 mb-6">
            Your donation order has been created but payment is still pending. 
            Please complete the payment process.
          </p>
          <Link
            to="/donate"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Complete Payment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Donation Successful!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your generous contribution to EduHope India
          </p>
        </div>

        {/* Donation Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Donation Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Donation Amount</label>
              <p className="text-2xl font-bold text-green-600">₹{donationDetails.amount.toLocaleString('en-IN')}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Donor Name</label>
              <p className="text-lg font-medium text-gray-900">{donationDetails.donorName}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Receipt Number</label>
              <p className="text-lg font-mono text-gray-900">{donationDetails.receiptNumber || 'Generating...'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Certificate Number</label>
              <p className="text-lg font-mono text-gray-900">{donationDetails.certificateNumber || 'Will be generated'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Order ID</label>
              <p className="text-lg font-mono text-gray-900">{donationDetails.orderId}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Date & Time</label>
              <p className="text-lg text-gray-900">
                {donationDetails.paidAt 
                  ? new Date(donationDetails.paidAt).toLocaleString('en-IN')
                  : new Date(donationDetails.createdAt).toLocaleString('en-IN')
                }
              </p>
            </div>
          </div>
        </div>

        {/* Impact Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Your Impact</h3>
          <div className="text-blue-800">
            <p className="mb-2">
              Your donation of ₹{donationDetails.amount.toLocaleString('en-IN')} will help us:
            </p>
            <ul className="space-y-1 list-disc list-inside">
              {donationDetails.amount >= 5000 && (
                <li>Provide educational materials for 10+ children for a month</li>
              )}
              {donationDetails.amount >= 2500 && (
                <li>Support nutritious meals for homeless children</li>
              )}
              {donationDetails.amount >= 1000 && (
                <li>Fund basic learning supplies and books</li>
              )}
              <li>Contribute to shelter and safety programs</li>
              <li>Support our ongoing outreach initiatives</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.print()}
            className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Receipt
          </button>
          
          <Link
            to="/donation"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            Make Another Donation
          </Link>
          
          <Link
            to="/"
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors text-center"
          >
            Back to Home
          </Link>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">What's Next?</h3>
          <div className="text-yellow-800 space-y-2">
            <p>📧 You'll receive a confirmation email with your donation receipt shortly.</p>
            <p>📋 A tax-exemption certificate will be emailed to you within 7 business days.</p>
            <p>📰 Stay updated with our progress through our newsletter.</p>
            <p>🤝 Consider volunteering or sharing our mission with others.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccessPage;
