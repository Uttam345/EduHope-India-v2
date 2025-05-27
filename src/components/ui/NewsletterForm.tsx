import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
//import 'dotenv/config';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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

    try {
      // Check for existing subscription
      const { data: existingSubscriptions } = await supabase
        .from('newsletter_subscriptions')
        .select()
        .eq('email', email);

      if (existingSubscriptions && existingSubscriptions.length > 0) {
        setStatus({
          type: 'error',
          message: 'This email is already subscribed to our newsletter.',
        });
        setIsSubmitting(false);
        return;
      }

      // Insert new subscription into database
      const { error: insertError } = await supabase
        .from('newsletter_subscriptions')
        .insert([
          {
            email: email,
            name: name || null,
            //subscribed_at: new Date().toISOString(),
            //is_active: true
          }
        ]);

      if (insertError) {
        throw new Error(`Database insert failed: ${insertError.message}`);
      }

      // Send welcome email
      const emailResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-welcome-mail`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email, name }),
        }
      );

      const emailResult = await emailResponse.json();
      
      if (!emailResponse.ok) {
        console.error('Welcome email failed:', emailResult);
        // Check if it's a Mailgun authorization issue
        if (emailResult.error && emailResult.error.includes('authorized recipients')) {
          setStatus({
            type: 'success',
            message: 'Thank you for subscribing! Email confirmation will be sent once your address is verified.',
          });
        } else {
          setStatus({
            type: 'success',
            message: 'Thank you for subscribing! Welcome email will be sent shortly.',
          });
        }
      } else {
        console.log('Welcome email sent successfully:', emailResult);
        setStatus({
          type: 'success',
          message: 'Thank you for subscribing to our newsletter! Check your email for a welcome message.',
        });
      }
      setEmail('');
      setName('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus({
        type: 'error',
        message: 'Failed to subscribe. Please try again.',
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
            placeholder="Your name (optional)"
            className="input-field bg-gray-800 border-gray-700 text-white placeholder-gray-400 w-full mb-2"
            disabled={isSubmitting}
          />
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="input-field bg-gray-800 border-gray-700 text-white placeholder-gray-400 pr-12 w-full"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bg-secondary hover:bg-secondary-light text-white p-2 rounded-md transition-colors"
              disabled={isSubmitting}
              aria-label="Subscribe"
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {status.type && (
          <p
            className={`text-sm ${
              status.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
          >
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