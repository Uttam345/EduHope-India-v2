import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, Share2, Download } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const DonationSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [donation, setDonation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      fetchDonationDetails(sessionId);
    }
  }, [searchParams]);

  const fetchDonationDetails = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('transaction_id', sessionId)
        .single();

      if (error) throw error;
      setDonation(data);
    } catch (error) {
      console.error('Error fetching donation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Processing your donation...</p>
        </div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Donation not found</p>
          <Link to="/donate" className="btn btn-primary mt-4">
            Make a New Donation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container-custom max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 bg-green-500"></div>

          <div className="p-8 sm:p-12">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-500" />
              </div>

              <h1 className="text-3xl font-bold mb-4">
                Thank You for Your Donation!
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Your contribution of{' '}
                <span className="font-semibold text-secondary">
                  ₹{donation.amount.toLocaleString()}
                </span>{' '}
                will make a real difference.
              </p>
              <p className="text-gray-600">
                Transaction ID: {donation.transaction_id}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-2">Your Impact</h3>
                <p className="text-gray-600">
                  Your donation will help provide education, nutrition, and
                  support to children in need.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-2">Tax Receipt</h3>
                <p className="text-gray-600">
                  A tax receipt has been sent to your email address. You can
                  also download it here.
                </p>
                <button className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white mt-4">
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </button>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div>
                <h3 className="font-bold mb-2">Share Your Support</h3>
                <p className="text-gray-600 mb-4">
                  Inspire others by sharing your contribution
                </p>
                <div className="flex justify-center space-x-4">
                  <button className="btn btn-outline border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-bold mb-2">What's Next?</h3>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/impact" className="btn btn-primary">
                    See Your Impact
                  </Link>
                  <Link
                    to="/donate"
                    className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Make Another Donation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccessPage;
