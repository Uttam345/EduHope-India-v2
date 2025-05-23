import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { MailerSend, EmailParams, Recipient, Sender } from 'mailersend';

const mailersend = new MailerSend({
  apiKey: Deno.env.get('MAILERSEND_API_KEY')!,
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
