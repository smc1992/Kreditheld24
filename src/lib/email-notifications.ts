import { Resend } from 'resend';

let resend: Resend | null = null;

function getResendClient() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const fromEmail = process.env.RESEND_FROM_EMAIL || 'Kreditheld24 <noreply@kreditheld24.de>';

interface EmailVerificationParams {
  to: string;
  firstName: string;
  verificationUrl: string;
}

interface PasswordResetParams {
  to: string;
  firstName: string;
  resetUrl: string;
}

interface CaseStatusChangeParams {
  to: string;
  firstName: string;
  caseNumber: string;
  oldStatus: string;
  newStatus: string;
  caseUrl: string;
}

interface NewMessageParams {
  to: string;
  firstName: string;
  caseNumber: string;
  messagePreview: string;
  caseUrl: string;
}

export async function sendEmailVerification({ to, firstName, verificationUrl }: EmailVerificationParams) {
  try {
    await getResendClient().emails.send({
      from: fromEmail,
      to,
      subject: 'Bestätigen Sie Ihre E-Mail-Adresse',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>E-Mail-Bestätigung</h1>
              </div>
              <div class="content">
                <p>Hallo ${firstName},</p>
                <p>vielen Dank für Ihre Registrierung bei Kreditheld24. Bitte bestätigen Sie Ihre E-Mail-Adresse, um Ihr Konto zu aktivieren.</p>
                <p style="text-align: center;">
                  <a href="${verificationUrl}" class="button">E-Mail bestätigen</a>
                </p>
                <p>Oder kopieren Sie diesen Link in Ihren Browser:</p>
                <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${verificationUrl}</p>
                <p>Dieser Link ist 24 Stunden gültig.</p>
                <p>Falls Sie sich nicht registriert haben, können Sie diese E-Mail ignorieren.</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kreditheld24. Alle Rechte vorbehalten.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Email verification send error:', error);
    return { success: false, error };
  }
}

export async function sendPasswordReset({ to, firstName, resetUrl }: PasswordResetParams) {
  try {
    await getResendClient().emails.send({
      from: fromEmail,
      to,
      subject: 'Passwort zurücksetzen',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Passwort zurücksetzen</h1>
              </div>
              <div class="content">
                <p>Hallo ${firstName},</p>
                <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt. Klicken Sie auf den Button unten, um ein neues Passwort zu erstellen.</p>
                <p style="text-align: center;">
                  <a href="${resetUrl}" class="button">Passwort zurücksetzen</a>
                </p>
                <p>Oder kopieren Sie diesen Link in Ihren Browser:</p>
                <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${resetUrl}</p>
                <p>Dieser Link ist 1 Stunde gültig.</p>
                <p>Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kreditheld24. Alle Rechte vorbehalten.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Password reset send error:', error);
    return { success: false, error };
  }
}

export async function sendCaseStatusChange({ to, firstName, caseNumber, oldStatus, newStatus, caseUrl }: CaseStatusChangeParams) {
  const statusLabels: Record<string, string> = {
    draft: 'Entwurf',
    open: 'Offen',
    active: 'In Bearbeitung',
    approved: 'Genehmigt',
    rejected: 'Abgelehnt',
    won: 'Gewonnen',
    lost: 'Verloren',
  };

  try {
    await getResendClient().emails.send({
      from: fromEmail,
      to,
      subject: `Status-Update für Ihre Kreditanfrage ${caseNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .status-box { background: white; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Status-Update</h1>
              </div>
              <div class="content">
                <p>Hallo ${firstName},</p>
                <p>der Status Ihrer Kreditanfrage <strong>${caseNumber}</strong> wurde aktualisiert.</p>
                <div class="status-box">
                  <p><strong>Neuer Status:</strong> ${statusLabels[newStatus] || newStatus}</p>
                </div>
                <p>Sie können den aktuellen Stand Ihrer Anfrage jederzeit in Ihrem Kundenportal einsehen.</p>
                <p style="text-align: center;">
                  <a href="${caseUrl}" class="button">Zum Kundenportal</a>
                </p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kreditheld24. Alle Rechte vorbehalten.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Case status change notification error:', error);
    return { success: false, error };
  }
}

export async function sendNewMessageNotification({ to, firstName, caseNumber, messagePreview, caseUrl }: NewMessageParams) {
  try {
    await getResendClient().emails.send({
      from: fromEmail,
      to,
      subject: `Neue Nachricht zu Ihrer Kreditanfrage ${caseNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .message-box { background: white; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Neue Nachricht</h1>
              </div>
              <div class="content">
                <p>Hallo ${firstName},</p>
                <p>Sie haben eine neue Nachricht zu Ihrer Kreditanfrage <strong>${caseNumber}</strong> erhalten.</p>
                <div class="message-box">
                  <p>${messagePreview.substring(0, 150)}${messagePreview.length > 150 ? '...' : ''}</p>
                </div>
                <p style="text-align: center;">
                  <a href="${caseUrl}" class="button">Nachricht lesen</a>
                </p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kreditheld24. Alle Rechte vorbehalten.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('New message notification error:', error);
    return { success: false, error };
  }
}

interface InviteUserParams {
  to: string;
  firstName: string;
  inviteUrl: string;
}

export async function sendInviteEmail({ to, firstName, inviteUrl }: InviteUserParams) {
  try {
    const client = getResendClient();
    if (!client) {
      console.error('Resend client not initialized (missing API key)');
      return { success: false, error: 'Resend API key missing' };
    }

    await client.emails.send({
      from: fromEmail,
      to,
      subject: 'Einladung zu Kreditheld24',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Willkommen bei Kreditheld24</h1>
              </div>
              <div class="content">
                <p>Hallo ${firstName},</p>
                <p>Sie wurden von einem Administrator zu Kreditheld24 eingeladen.</p>
                <p>Bitte klicken Sie auf den Button unten, um Ihr Konto zu aktivieren und Ihr Passwort festzulegen.</p>
                <p style="text-align: center;">
                  <a href="${inviteUrl}" class="button">Konto aktivieren</a>
                </p>
                <p>Oder kopieren Sie diesen Link in Ihren Browser:</p>
                <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${inviteUrl}</p>
                <p>Dieser Link ist 24 Stunden gültig.</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Kreditheld24. Alle Rechte vorbehalten.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Invite email send error:', error);
    return { success: false, error };
  }
}
