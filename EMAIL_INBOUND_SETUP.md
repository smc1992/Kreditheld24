# Kreditheld24 CRM - Inbound Email Setup Guide 📬

This guide explains how to configure your domain and email provider to receive real emails directly into the Kreditheld24 Admin Dashboard.

## 🚀 Concept: Inbound Webhooks

Kreditheld24 uses a modern "Push" approach for emails. Instead of periodically checking a mailbox via IMAP (which is slow and resource-intensive), your email provider (e.g., Resend, Mailgun, or SendGrid) receives the email and immediately "pushes" it to our API endpoint.

### Advantages:
- **Instant:** Emails appear in the CRM as soon as they are sent.
- **Automated:** The system automatically links the email to the correct customer via their email address.
- **Scalable:** No local storage of huge mailboxes required.

---

## 🛠️ Configuration Steps

### 1. DNS Setup (MX Records)

To receive emails on your domain (e.g., `*@kreditheld24.de`), you must point your MX records to your chosen provider.

**Example for Resend:**
1. Go to [Resend Dashboard > Domains](https://resend.com/domains).
2. Add your domain and follow the verification steps (TXT records).
3. Under the "Inbound" tab, you will see the required MX records.
4. Add these MX records to your domain provider (e.g., Strato, IONOS, Cloudflare):
   - `MX` | `@` | `feedback-smtp.us-east-1.amazonses.com` (Example value)

### 2. Webhook Integration

Configure your provider to send a `POST` request to your Kreditheld24 instance whenever an email is received.

- **Webhook URL:** `https://your-domain.de/api/admin/emails/inbound`
- **Method:** `POST`
- **Format:** `JSON`

### 3. Security (Optional but Recommended)

In the file `src/app/api/admin/emails/inbound/route.ts`, you should implement a secret check to ensure only your email provider can call this endpoint.

```typescript
// Example: check for a secret header
const secret = request.headers.get('x-webhook-secret');
if (secret !== process.env.EMAIL_WEBHOOK_SECRET) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

---

## 📁 Data Mapping

The implemented endpoint automatically processes the following:

| Field | Description |
|-------|-------------|
| **From** | Automatically identifies the customer in the database. |
| **Subject** | Saved as the email subject. |
| **Content** | Supports both HTML and Plain Text. |
| **Activity** | Creates a new entry in the customer's activity timeline. |

## 🧪 Testing

You can simulate an incoming email using `curl`:

```bash
curl -X POST http://localhost:3000/api/admin/emails/inbound \
  -H "Content-Type: application/json" \
  -d '{
    "from": "test-customer@example.com",
    "to": "info@kreditheld24.de",
    "subject": "Question about my loan",
    "html": "<p>Hello, I have a question...</p>",
    "messageId": "msg_123456"
  }'
```

---

## 🚨 Troubleshooting

- **Email not appearing:** Check if the customer exists in the CRM with the *exact* same email address as the sender.
- **MX Records:** DNS changes can take up to 24 hours to propagate.
- **Payload Format:** If you use a provider other than Resend, you might need to adjust the field extraction in `/api/admin/emails/inbound/route.ts`.

---

**Happy Communicating! 📧**
