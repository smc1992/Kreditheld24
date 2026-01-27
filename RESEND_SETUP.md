# Resend & React Email Integration - Setup Guide

## 📧 E-Mail-Versand an Kunden im Admin-Dashboard

Diese Integration ermöglicht es Ihnen, professionelle E-Mails an Kunden direkt aus dem Admin-Dashboard zu versenden.

## 🚀 Installation

### 1. Packages installieren

```bash
npm install resend react-email @react-email/components
```

Falls es Probleme mit dem Workspace gibt:
```bash
npm install --legacy-peer-deps resend react-email @react-email/components
```

### 2. Resend Account erstellen

1. Gehen Sie zu [resend.com](https://resend.com)
2. Erstellen Sie einen kostenlosen Account
3. Verifizieren Sie Ihre Domain (oder nutzen Sie die Test-Domain)
4. Erstellen Sie einen API-Key

### 3. Environment Variables konfigurieren

Fügen Sie zu Ihrer `.env.local` hinzu:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=Kreditheld24 <noreply@kreditheld24.de>
```

**Wichtig:** Ersetzen Sie `noreply@kreditheld24.de` mit Ihrer verifizierten Domain!

## 📁 Projektstruktur

```
/emails/
  ├── CustomerWelcome.tsx      # Willkommens-E-Mail Template
  └── CaseUpdate.tsx            # Vorgangs-Update Template

/src/lib/
  └── resend.ts                 # Resend Client Konfiguration

/src/app/api/admin/
  └── send-email/
      └── route.ts              # API-Route für E-Mail-Versand
```

## 📧 E-Mail Templates

### 1. CustomerWelcome (Willkommens-E-Mail)

Wird versendet wenn ein neuer Kunde angelegt wird.

**Features:**
- Grüner Kreditheld24 Header-Gradient
- Persönliche Anrede
- Berater-Name
- Call-to-Action Button
- Vorteile-Liste
- Responsive Design

### 2. CaseUpdate (Vorgangs-Update)

Wird versendet bei Status-Änderungen eines Vorgangs.

**Features:**
- Vorgangsnummer
- Status-Badge mit Farben
- Individuelle Nachricht
- Berater-Kontakt
- Responsive Design

### 3. Custom (Individuelle E-Mail)

Für freie Textnachrichten an Kunden.

## 🔌 API-Nutzung

### E-Mail versenden

**Endpoint:** `POST /api/admin/send-email`

**Authentifizierung:** NextAuth Session erforderlich

### Beispiel 1: Willkommens-E-Mail

```typescript
const response = await fetch('/api/admin/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'kunde@example.com',
    type: 'welcome',
    data: {
      customerName: 'Max Mustermann',
      advisorName: 'Julia Schmidt'
    }
  })
});
```

### Beispiel 2: Vorgangs-Update

```typescript
const response = await fetch('/api/admin/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'kunde@example.com',
    type: 'case_update',
    data: {
      customerName: 'Max Mustermann',
      caseNumber: 'VG-12345678',
      status: 'approved',
      message: 'Ihr Kreditantrag wurde genehmigt! Wir werden uns in Kürze bei Ihnen melden.',
      advisorName: 'Julia Schmidt'
    }
  })
});
```

### Beispiel 3: Individuelle E-Mail

```typescript
const response = await fetch('/api/admin/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'kunde@example.com',
    type: 'custom',
    data: {
      subject: 'Rückfrage zu Ihrem Antrag',
      customerName: 'Max Mustermann',
      message: 'Sehr geehrter Herr Mustermann,\n\nwir benötigen noch folgende Unterlagen...',
      advisorName: 'Julia Schmidt'
    }
  })
});
```

## 🎨 E-Mail Design

Alle E-Mails verwenden das **Kreditheld24 Grün-Design**:

- **Header**: Grün-Gradient (#10b981 → #059669)
- **Buttons**: Grün (#10b981)
- **Links**: Grün (#10b981)
- **Status-Badges**: Farbcodiert (Grün, Orange, Rot)

## 🧪 E-Mails testen

### React Email Dev Server

```bash
npx react-email dev
```

Öffnet einen lokalen Server auf `http://localhost:3000` wo Sie alle E-Mail-Templates live bearbeiten und testen können.

## 📱 Integration im Admin-Dashboard

### E-Mail-Button in Kunden-Details hinzufügen

```typescript
<button
  onClick={async () => {
    await fetch('/api/admin/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: customer.email,
        type: 'welcome',
        data: {
          customerName: `${customer.firstName} ${customer.lastName}`,
          advisorName: session.user.name
        }
      })
    });
    alert('E-Mail versendet!');
  }}
  style={{
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  }}
>
  📧 E-Mail senden
</button>
```

## 🔒 Sicherheit

- ✅ Alle API-Routes sind mit NextAuth geschützt
- ✅ Nur authentifizierte Admin-Benutzer können E-Mails versenden
- ✅ API-Key wird nur serverseitig verwendet (nie im Client)
- ✅ E-Mail-Adressen werden validiert

## 📊 Status-Codes

| Status | Farbe | Verwendung |
|--------|-------|------------|
| Offen | Blau (#3b82f6) | Neuer Vorgang |
| In Bearbeitung | Orange (#f59e0b) | Wird bearbeitet |
| Genehmigt | Grün (#10b981) | Kredit genehmigt |
| Abgelehnt | Rot (#ef4444) | Kredit abgelehnt |
| Geschlossen | Grau (#6b7280) | Vorgang abgeschlossen |

## 🚨 Troubleshooting

### "Cannot find module 'resend'"

Packages noch nicht installiert. Führen Sie aus:
```bash
npm install resend react-email @react-email/components
```

### "RESEND_API_KEY is not defined"

Fügen Sie den API-Key zu `.env.local` hinzu:
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### E-Mails kommen nicht an

1. Prüfen Sie ob die Domain verifiziert ist
2. Prüfen Sie den Spam-Ordner
3. Im Resend-Dashboard die Logs prüfen
4. Test-Domain verwenden für Development

### "Unsupported URL Type workspace"

NPM-Workspace-Problem. Verwenden Sie:
```bash
npm install --legacy-peer-deps resend react-email @react-email/components
```

## 📚 Weitere Ressourcen

- [Resend Dokumentation](https://resend.com/docs)
- [React Email Dokumentation](https://react.email/docs)
- [React Email Components](https://react.email/docs/components/button)

## ✨ Nächste Schritte

1. **Packages installieren**
2. **Resend Account erstellen & API-Key holen**
3. **Environment Variables setzen**
4. **E-Mail-Buttons im Admin-Dashboard hinzufügen**
5. **Test-E-Mails versenden**

---

**Viel Erfolg mit dem E-Mail-Versand! 📧**
