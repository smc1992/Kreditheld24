
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

async function sendTest() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error('❌ RESEND_API_KEY is missing in .env');
        process.exit(1);
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@kreditheld24.de';
    const toEmail = 'smc.consulting.mueller@gmail.com';

    console.log(`🚀 Sending test email via Resend...`);
    console.log(`From: ${fromEmail}`);
    console.log(`To: ${toEmail}`);

    try {
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            subject: 'Resend Test: Kreditheld24 Verification',
            html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #10b981;">Resend Integration Test</h2>
          <p>Dies ist eine Test-E-Mail, um die Integration von <strong>Resend</strong> zu bestätigen.</p>
          <p>Wenn du diese E-Mail siehst, funktioniert der Versand über die API korrekt!</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">Gesendet von Kreditheld24 System</p>
        </div>
      `
        });

        if (error) {
            console.error('❌ Resend API returned error:', error);
        } else {
            console.log('✅ Email sent successfully!');
            console.log('ID:', data?.id);
        }

    } catch (err) {
        console.error('❌ Exception sending email:', err);
    }
}

sendTest();
