/*// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { MailerSend, EmailParams, Recipient, Sender } from 'mailersend';

const mailersend = new MailerSend({
  apiKey: (typeof Deno !== "undefined" && Deno.env.get)
    ? Deno.env.get('MAILERSEND_API_KEY')!
    : process.env.MAILERSEND_API_KEY!,
});

serve(async (req: { json: () => PromiseLike<{ email: any; name: any; }>|{ email: any; name: any; }; }) => {
  const { email, name } = await req.json();

  const emailParams = new EmailParams()
    .setFrom(new Sender('uttambansal345@gmail.com', 'EduHope India Newsletter'))
    .setTo([new Recipient(email, name || 'Subscriber')])
    .setSubject('Welcome to our newsletter!')
    .setHtml(`<p>Hey ${name || 'there'}, thanks for subscribing! 🎉</p>`)
    .setText(`Hey ${name || 'there'}, thanks for subscribing!`);

  try {
    await mailersend.email.send(emailParams);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});
*/

/*import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { MailerSend, EmailParams, Recipient, Sender } from 'npm:mailersend';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  try {
    // Validate API key
    const apiKey = (typeof Deno !== "undefined" && Deno.env && Deno.env.get)
      ? Deno.env.get('MAILERSEND_API_KEY')
      : (typeof process !== "undefined" && process.env && process.env.MAILERSEND_API_KEY)
        ? process.env.MAILERSEND_API_KEY
        : undefined;
    if (!apiKey) {
      throw new Error('MailerSend API key is not configured');
    }

    const mailersend = new MailerSend({
      apiKey: apiKey,
    });

    const { email, name } = await req.json();

    // Validate required fields
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const emailParams = new EmailParams()
      .setFrom(new Sender('uttambansal345@gmail.com', 'EduHope India Newsletter'))
      .setTo([new Recipient(email, name || 'Subscriber')])
      .setSubject('Welcome to EduHope India Newsletter!')
      .setHtml(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1f2937;">Welcome to EduHope India! 🎉</h1>
          <p>Dear ${name || 'Supporter'},</p>
          <p>Thank you for subscribing to our newsletter. We're excited to have you join our community of supporters helping homeless children across India.</p>
          <p>You'll receive regular updates about:</p>
          <ul>
            <li>Our latest initiatives and success stories</li>
            <li>Ways to get involved and make a difference</li>
            <li>Impact reports and project updates</li>
          </ul>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Best regards,<br>The EduHope India Team</p>
        </div>
      `)
      .setText(`Welcome to EduHope India! 🎉

Dear ${name || 'Supporter'},

Thank you for subscribing to our newsletter. We're excited to have you join our community of supporters helping homeless children across India.

You'll receive regular updates about:
- Our latest initiatives and success stories
- Ways to get involved and make a difference
- Impact reports and project updates

If you have any questions, feel free to reply to this email.

Best regards,
The EduHope India Team`);

console.log('Sending welcome email to:', email);
    await mailersend.email.send(emailParams);

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
*/

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  try {
    console.log('Send welcome mail function called');
    const { email, name } = await req.json();
    console.log('Request data:', { email, name: name || 'No name provided' });

    // Validate required fields
    if (!email) {
      console.error('No email provided');
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get Mailgun API key from environment
    const mailgunApiKey = Deno.env.get('MAILGUN_API_KEY');
    const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN') || 'sandbox8e97fa9b407c4f4c9e06824253ae5088.mailgun.org';
    
    console.log('Environment check:', {
      hasApiKey: !!mailgunApiKey,
      domain: mailgunDomain,
      domainLength: mailgunDomain?.length
    });
    
    if (!mailgunApiKey) {
      console.error('Mailgun API key not found in environment');
      throw new Error('Mailgun API key is not configured');
    }

    // Prepare form data for Mailgun API
    const formData = new FormData();
    formData.append('from', `EduHope India Newsletter <postmaster@${mailgunDomain}>`);
    formData.append('to', email);
    formData.append('subject', 'Welcome to EduHope India Newsletter!');
    formData.append('html', `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">Welcome to EduHope India! 🎉</h1>
        <p>Dear ${name || 'Supporter'},</p>
        <p>Thank you for subscribing to our newsletter. We're excited to have you join our community of supporters helping homeless children across India.</p>
        <p>You'll receive regular updates about:</p>
        <ul>
          <li>Our latest initiatives and success stories</li>
          <li>Ways to get involved and make a difference</li>
          <li>Impact reports and project updates</li>
        </ul>
        <p>If you have any questions, feel free to reply to this email.</p>
        <p>Best regards,<br>The EduHope India Team</p>
      </div>
    `);
    formData.append('text', `Welcome to EduHope India! 🎉

Dear ${name || 'Supporter'},

Thank you for subscribing to our newsletter. We're excited to have you join our community of supporters helping homeless children across India.

You'll receive regular updates about:
- Our latest initiatives and success stories
- Ways to get involved and make a difference
- Impact reports and project updates

If you have any questions, feel free to reply to this email.

Best regards,
The EduHope India Team`);    // Send email via Mailgun API
    console.log('Attempting to send email via Mailgun...');
    const mailgunResponse = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${mailgunApiKey}`)}`,
      },
      body: formData,
    });

    console.log('Mailgun response status:', mailgunResponse.status);
    
    if (!mailgunResponse.ok) {
      const errorText = await mailgunResponse.text();
      console.error('Mailgun API error:', {
        status: mailgunResponse.status,
        statusText: mailgunResponse.statusText,
        error: errorText
      });
      throw new Error(`Mailgun API error: ${mailgunResponse.status} - ${errorText}`);
    }

    const result = await mailgunResponse.json();
    console.log('Email sent successfully:', result);

    return new Response(
      JSON.stringify({ success: true, messageId: result.id }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});