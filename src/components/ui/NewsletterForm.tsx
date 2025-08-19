import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface NewsletterFormProps {
  onSuccess?: () => void;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus({
        type: 'error',
        message: 'Please enter your email address.',
      });
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid email address.',
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(),
          name: name.trim() || null,
          source: 'website'
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        if (response.status === 409) {
          setStatus({
            type: 'error',
            message: result.message || 'This email is already subscribed to our newsletter.',
          });
        } else if (response.status === 429) {
          setStatus({
            type: 'error',
            message: result.message || 'Too many subscription attempts. Please try again later.',
          });
        } else {
          setStatus({
            type: 'error',
            message: result.message || 'Failed to subscribe. Please try again.',
          });
        }
        return;
      }

      setStatus({
        type: 'success',
        message: result.message || 'Thank you for subscribing to our newsletter! Check your email for a welcome message.',
      });

      setEmail('');
      setName('');

      //It's purpose is not serving now, but maybe used in future for tracking successful subscriptions
      if (onSuccess) { 
        onSuccess();
      }

    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-3 py-2 mb-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full px-3 py-2 pr-12 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors disabled:bg-gray-600"
              disabled={isSubmitting}
              aria-label="Subscribe"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4l8 8-8 8M4 12h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {status.type && (
          <p className={`text-sm ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {status.message}
          </p>
        )}

        <p className="text-xs text-gray-400">
          By subscribing, you agree to our Privacy Policy and consent to receive
          updates from our organization. You can unsubscribe at any time.
        </p>
      </form>
    </div>
  );
};

export default NewsletterForm;