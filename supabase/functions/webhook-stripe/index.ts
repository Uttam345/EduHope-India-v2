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

const generateCertificateNumber = () => {
  const prefix = 'EDH';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

serve(
  async (req: { headers: { get: (arg0: string) => any }; text: () => any }) => {
    try {
      const signature = req.headers.get('stripe-signature');
      const body = await req.text();

      const event = stripe.webhooks.constructEvent(
        body,
        signature || '',
        Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const certificateNumber = generateCertificateNumber();

        // Create donation record
        const { error } = await supabase.from('donations').insert({
          transaction_id: session.id,
          donor_id: session.client_reference_id,
          full_name: session.metadata.donor_name,
          email: session.customer_email,
          phone: session.metadata.donor_phone,
          amount: session.amount_total / 100, // Convert from paise to rupees
          payment_status: 'completed',
          payment_method: session.payment_method_types[0],
          certificate_number: certificateNumber,
          donation_date: new Date().toISOString(),
        });

        if (error) throw error;
      }

      return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
);
