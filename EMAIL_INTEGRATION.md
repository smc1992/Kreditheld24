# E-Mail-Integration - Kreditheld24

## Übersicht

Die E-Mail-Integration verwendet **Resend** für das Versenden von E-Mails. Für den Empfang von E-Mails wird ein separates SMTP-Postfach benötigt.

## Aktuelle Konfiguration

### Versenden (Resend)

**Status:** ✅ Produktionsreif

- **Service:** Resend API
- **Verwendung:** Alle ausgehenden E-Mails
- **Konfiguration:**
  - `RESEND_API_KEY` - API-Schlüssel von Resend
  - `RESEND_FROM_EMAIL` - Absender-E-Mail (z.B. `Kreditheld24 <noreply@kreditheld24.de>`)

**Funktionen:**
- ✅ E-Mail-Verifizierung (Kundenregistrierung)
- ✅ Passwort-Reset
- ✅ Status-Updates für Kreditanträge
- ✅ Neue Nachrichten-Benachrichtigungen
- ✅ Manuelles E-Mail-Versenden über Admin-Panel (EmailEditor)

**Vorteile:**
- Hohe Zustellrate
- Einfache API
- Tracking und Analytics
- Keine SMTP-Konfiguration nötig

### Empfangen (SMTP Inbox)

**Status:** ⚠️ Muss konfiguriert werden

Für den Empfang von E-Mails (z.B. Kundenantworten) wird ein separates E-Mail-Postfach mit SMTP/IMAP-Zugang benötigt.

**Empfohlene Lösung:**

1. **Separates E-Mail-Postfach einrichten:**
   - z.B. `support@kreditheld24.de` oder `kontakt@kreditheld24.de`
   - Bei Ihrem Domain-Provider (z.B. Strato, 1&1, Google Workspace)

2. **SMTP/IMAP-Zugangsdaten:**
   ```env
   # Für Empfang (IMAP)
   IMAP_HOST=imap.yourdomain.de
   IMAP_PORT=993
   IMAP_USER=support@kreditheld24.de
   IMAP_PASSWORD=your-password
   IMAP_TLS=true
   
   # Optional: SMTP für Backup-Versand
   SMTP_HOST=smtp.yourdomain.de
   SMTP_PORT=587
   SMTP_USER=support@kreditheld24.de
   SMTP_PASSWORD=your-password
   SMTP_SECURE=true
   ```

3. **E-Mail-Polling implementieren:**
   - Regelmäßiges Abrufen neuer E-Mails via IMAP
   - Zuordnung zu Kunden/Vorgängen
   - Speicherung in Datenbank
   - Benachrichtigung der Admins

## E-Mail-Editor

**Status:** ✅ Produktionsreif mit erweiterten Funktionen

Der E-Mail-Editor im Admin-Panel bietet:

### Vorhandene Funktionen:
- ✅ Rich-Text-Formatierung (Fett, Kursiv, Unterstrichen)
- ✅ Listen (Aufzählung, Nummerierung)
- ✅ Schriftgrößen-Auswahl
- ✅ Dateianhänge
- ✅ Live-Vorschau
- ✅ E-Mail-Templates laden/speichern
- ✅ Kundenname-Platzhalter

### Fehlende Funktionen (Optional):
- ⚠️ Bilder direkt einfügen (aktuell nur als Anhang)
- ⚠️ Tabellen einfügen
- ⚠️ Links einfügen (aktuell nur als Text)
- ⚠️ Farben für Text/Hintergrund
- ⚠️ HTML-Editor-Modus
- ⚠️ Signatur-Verwaltung

## Produktionsreife Checkliste

### Versenden (Resend):
- [x] Resend API-Key konfiguriert
- [x] From-Email konfiguriert
- [x] E-Mail-Templates funktionieren
- [x] E-Mail-Editor funktioniert
- [x] Fehlerbehandlung implementiert
- [x] Logging implementiert

### Empfangen (SMTP/IMAP):
- [ ] E-Mail-Postfach eingerichtet
- [ ] SMTP/IMAP-Zugangsdaten konfiguriert
- [ ] E-Mail-Polling implementieren
- [ ] E-Mail-Parsing implementieren
- [ ] Zuordnung zu Kunden/Vorgängen
- [ ] Admin-Benachrichtigungen

## Nächste Schritte

1. **E-Mail-Postfach einrichten:**
   - Bei Domain-Provider ein Postfach erstellen
   - SMTP/IMAP aktivieren
   - Zugangsdaten notieren

2. **Environment-Variablen setzen:**
   - In Coolify die IMAP-Zugangsdaten hinzufügen
   - Resend API-Key prüfen

3. **E-Mail-Empfang implementieren (Optional):**
   - IMAP-Client integrieren (z.B. `imap-simple`)
   - Cron-Job für E-Mail-Polling
   - E-Mail-Parser für Kundenantworten
   - Zuordnung zu Vorgängen

## Verwendung

### E-Mail versenden (Admin):
1. Admin-Panel → Kunden → Kunde auswählen
2. "E-Mail senden" Button klicken
3. E-Mail-Editor öffnet sich
4. Template auswählen oder manuell schreiben
5. "E-Mail senden" klicken

### E-Mail-Templates verwalten:
1. Admin-Panel → E-Mails
2. Neue Templates erstellen
3. Bestehende Templates bearbeiten
4. Templates in Kategorien organisieren

## Technische Details

### Resend API:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Kreditheld24 <noreply@kreditheld24.de>',
  to: 'kunde@example.com',
  subject: 'Betreff',
  html: '<p>Inhalt</p>'
});
```

### E-Mail-Benachrichtigungen:
- `src/lib/email-notifications.ts` - Alle E-Mail-Funktionen
- Automatische E-Mails bei:
  - Kundenregistrierung (Verifizierung)
  - Passwort-Reset
  - Status-Änderungen
  - Neue Nachrichten

## Support

Bei Fragen zur E-Mail-Integration:
- Resend Dokumentation: https://resend.com/docs
- IMAP/SMTP: Kontaktieren Sie Ihren Domain-Provider
