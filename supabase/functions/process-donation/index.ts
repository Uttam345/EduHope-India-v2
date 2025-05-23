import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import Stripe from 'npm:stripe@14.19.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate Stripe API key
    if (!Deno.env.get('STRIPE_SECRET_KEY')) {
      throw new Error('Stripe API key is not configured');
    }

    const { amount, email, name, phone } = await req.json();

    // Validate required fields
    if (!amount || !email || !name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate amount
    if (amount < 100) {
      return new Response(
        JSON.stringify({ error: 'Minimum donation amount is ₹100' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get origin for success and cancel URLs
    const origin = req.headers.get('origin');
    if (!origin) {
      throw new Error('Origin header is required');
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: 'Donation to EduHope India',
                description: 'Supporting education for homeless children',
              },
              unit_amount: amount * 100, // Convert to paise
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${origin}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/donation/cancel`,
        customer_email: email,
        metadata: {
          donor_name: name,
          donor_phone: phone || '',
        },
      });

      if (!session?.url) {
        throw new Error('Failed to create Stripe session URL');
      }

      return new Response(
        JSON.stringify({ sessionId: session.id, url: session.url }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (stripeError) {
      console.error('Stripe session creation error:', stripeError);
      throw new Error('Failed to create payment session: ' + stripeError.message);
    }
  } catch (error) {
    console.error('Process donation error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});