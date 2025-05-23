import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Download, Share2, Award } from 'lucide-react';

const CertificatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  
  // Update page title
  useEffect(() => {
    document.title = 'Donation Certificate - EduHope India';
    
    // Simulate loading certificate data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Mock certificate data
  const certificateData = {
    id: id || '12345',
    donorName: 'Arjun Patel',
    amount: 2500,
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    taxId: 'AABCE1234F'
  };
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading your certificate...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container-custom max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-2 bg-primary"></div>
          
          <div className="p-8 sm:p-12 relative">
            <div className="absolute top-4 right-4 flex space-x-2">
              <button className="p-2 text-gray-600 hover:text-primary transition-colors" aria-label="Download Certificate">
                <Download size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-primary transition-colors" aria-label="Share Certificate">
                <Share2 size={20} />
              </button>
            </div>
            
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="w-12 h-12 text-primary" />
              </div>
            </div>
            
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-2">Donation Certificate</h1>
              <p className="text-gray-600">Certificate ID: {certificateData.id}</p>
            </div>
            
            <div className="border-t border-b border-gray-200 py-8 px-4 mb-8 text-center">
              <p className="text-lg mb-6">This certifies that</p>
              <h2 className="text-3xl font-bold mb-6">{certificateData.donorName}</h2>
              <p className="text-lg mb-6">has generously donated</p>
              <div className="text-4xl font-bold text-secondary mb-6">
                ₹{certificateData.amount.toLocaleString()}
              </div>
              <p className="text-lg">to support EduHope India's mission of providing education and support to homeless children in India.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <p className="text-gray-600 mb-1">Date of Contribution</p>
                <p className="font-semibold">{certificateData.date}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 mb-1">Tax Deduction Reference</p>
                <p className="font-semibold">{certificateData.taxId}</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center items-center mb-4">
                <Heart className="w-5 h-5 text-secondary mr-2" />
                <p className="font-medium">Thank you for your generosity!</p>
              </div>
              <p className="text-gray-600 text-sm">
                This donation is eligible for tax deduction under Section 80G of the Income Tax Act, India.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-800">Certificate Information</h3>
              <p className="mt-2 text-blue-700">
                This digital certificate serves as an official record of your donation. You can download and print it for your records or tax purposes. If you need any additional documentation, please contact us at donations@eduhopeindia.org.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;