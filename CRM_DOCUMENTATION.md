# 🎯 Kreditheld24 CRM System - Dokumentation

## ✅ System erfolgreich eingerichtet!

Ein vollständiges Admin-CRM-System mit Login, Kundenverwaltung, Vorgängen, Aktivitätsverlauf und Unterlagen-Management.

---

## 🚀 Erste Schritte

### 1. Admin-Benutzer anlegen

```bash
# Standard Admin erstellen (admin@kreditheld24.de / admin123)
pnpm admin:create

# Eigene Zugangsdaten
pnpm admin:create your@email.com yourpassword "Ihr Name"
```

### 2. Server starten

```bash
pnpm dev
```

### 3. Admin-Login

Öffnen Sie: `http://localhost:3000/admin/login`

---

## 📊 CRM-Funktionen

### ✅ Kundenverwaltung

**Kontaktdaten:**
- ✅ Name (Vorname, Nachname)
- ✅ Adresse
- ✅ Telefonnummer
- ✅ E-Mail
- ✅ Geburtsdatum
- ✅ Geburtsort
- ✅ Familienstand
- ✅ Anzahl kindergeldberechtigter Kinder
- ✅ Staatsangehörigkeit

**Features:**
- Kunden anlegen, bearbeiten, löschen
- Übersichtliche Kundenliste
- Detailansicht mit allen Informationen
- Suchfunktion (geplant)

### ✅ Vorgangsverwaltung

**Vorgangsfelder:**
- ✅ Berater (Name oder Nummer)
- ✅ Vorgangsnummer
- ✅ Beantragter Kreditbetrag
- ✅ Genehmigter Kreditbetrag
- ✅ Bank
- ✅ Laufzeit
- ✅ Wiedervorlage
- ✅ Status (offen, in Bearbeitung, abgeschlossen)

**Features:**
- Vorgänge pro Kunde verwalten
- Statusverfolgung
- Wiedervorlagen-System
- Verknüpfung mit Kunden

### ✅ Aktivitätsverlauf

**Aktivitätstypen:**
- E-Mail
- Telefonat
- Termin
- Notiz
- Dokument

**Features:**
- Chronologische Auflistung
- Filterung nach Typ
- Zuordnung zu Vorgängen
- Benutzer-Tracking

### ✅ Unterlagen-Management

**Dokumentenfelder:**
- Name
- Typ
- Datei-URL
- Dateigröße
- Upload-Datum
- Hochgeladen von

---

## 🗄️ Datenbank-Schema

### Tabellen:

1. **admin_users** - Admin-Benutzer
2. **crm_customers** - Kundendaten
3. **crm_cases** - Vorgänge
4. **crm_activities** - Aktivitätsverlauf
5. **crm_documents** - Unterlagen

### Beziehungen:

```
crm_customers (1) ──→ (n) crm_cases
crm_cases (1) ──→ (n) crm_activities
crm_cases (1) ──→ (n) crm_documents
admin_users (1) ──→ (n) crm_activities
admin_users (1) ──→ (n) crm_documents
```

---

## 🎨 Design-Features

### Modernes UI mit:
- ✅ Tailwind CSS
- ✅ Shadcn/ui Komponenten
- ✅ Lucide Icons
- ✅ Responsive Design
- ✅ Gradient-Hintergründe
- ✅ Hover-Effekte
- ✅ Smooth Transitions

### Farbschema:
- **Primary:** Blau (#2563eb)
- **Success:** Grün (#16a34a)
- **Warning:** Orange (#ea580c)
- **Danger:** Rot (#dc2626)

---

## 📱 Seiten-Übersicht

### Admin-Bereich (`/admin`)

#### 1. Login (`/admin/login`)
- Modernes Login-Formular
- Gradient-Hintergrund
- Fehlerbehandlung

#### 2. Dashboard (`/admin`)
- Statistik-Karten
- Letzte Aktivitäten
- Schnellzugriff
- Wiedervorlagen-Übersicht

#### 3. Kunden (`/admin/customers`)
- Kundenliste mit Tabelle
- Suchfunktion
- Neuer Kunde Button
- Detail-Links

#### 4. Kundendetails (`/admin/customers/[id]`)
- Vollständige Kontaktdaten
- Persönliche Informationen
- Zugehörige Vorgänge
- Statistiken

#### 5. Neuer Kunde (`/admin/customers/new`)
- Umfangreiches Formular
- Alle Kontaktfelder
- Validierung
- Speichern & Abbrechen

#### 6. Vorgänge (`/admin/cases`)
- Vorgangsliste
- Filter nach Status
- Wiedervorlagen
- Neuer Vorgang

#### 7. Vorgangsdetails (`/admin/cases/[id]`)
- Alle Vorgangsfelder
- Aktivitätsverlauf
- Unterlagen
- Bearbeiten-Funktion

---

## 🔐 Sicherheit

### Authentifizierung:
- NextAuth.js v5 (Beta)
- JWT-basierte Sessions
- Bcrypt Password Hashing
- Protected Routes via Middleware

### Autorisierung:
- Nur eingeloggte Admins haben Zugriff
- Session-Validierung auf jeder Seite
- API-Routes geschützt

### Best Practices:
- ✅ Passwörter gehasht (bcrypt)
- ✅ SQL Injection geschützt (Drizzle ORM)
- ✅ XSS-Schutz (React)
- ✅ CSRF-Schutz (NextAuth)

---

## 🛠️ API-Endpoints

### Kunden:
```
GET    /api/admin/customers       - Alle Kunden
POST   /api/admin/customers       - Neuer Kunde
GET    /api/admin/customers/[id]  - Kunde abrufen
PUT    /api/admin/customers/[id]  - Kunde aktualisieren
DELETE /api/admin/customers/[id]  - Kunde löschen
```

### Vorgänge:
```
GET    /api/admin/cases           - Alle Vorgänge
POST   /api/admin/cases           - Neuer Vorgang
GET    /api/admin/cases/[id]      - Vorgang abrufen
PUT    /api/admin/cases/[id]      - Vorgang aktualisieren
DELETE /api/admin/cases/[id]      - Vorgang löschen
```

### Aktivitäten:
```
GET    /api/admin/activities      - Alle Aktivitäten
POST   /api/admin/activities      - Neue Aktivität
```

### Unterlagen:
```
GET    /api/admin/documents       - Alle Unterlagen
POST   /api/admin/documents       - Neue Unterlage
DELETE /api/admin/documents/[id]  - Unterlage löschen
```

---

## 📝 Verwendung in Code

### Kunde erstellen:
```typescript
const response = await fetch('/api/admin/customers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.com',
    phone: '+49 123 456789',
    address: 'Musterstraße 1, 12345 Berlin',
    birthDate: '1990-01-01',
    birthPlace: 'Berlin',
    maritalStatus: 'verheiratet',
    childrenCount: 2,
    nationality: 'Deutsch',
  }),
});
```

### Vorgang erstellen:
```typescript
const response = await fetch('/api/admin/cases', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerId: 'customer-uuid',
    caseNumber: 'K-2024-001',
    advisorName: 'John Doe',
    advisorNumber: 'B-123',
    requestedAmount: '50000',
    approvedAmount: '45000',
    bank: 'Sparkasse',
    duration: 84,
    followUpDate: '2024-02-15',
    status: 'open',
  }),
});
```

### Aktivität hinzufügen:
```typescript
const response = await fetch('/api/admin/activities', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    caseId: 'case-uuid',
    type: 'email',
    subject: 'Kreditunterlagen angefordert',
    description: 'Kunde wurde per E-Mail kontaktiert...',
    date: new Date().toISOString(),
  }),
});
```

---

## 🎯 Nächste Schritte

### Empfohlene Erweiterungen:

1. **Vorgangsverwaltung vervollständigen**
   - Vorgänge anlegen/bearbeiten Seiten
   - Status-Workflow
   - Wiedervorlagen-Benachrichtigungen

2. **Unterlagen-Upload**
   - File-Upload-Komponente
   - Cloud-Storage Integration (z.B. S3)
   - Vorschau-Funktion

3. **Suchfunktion**
   - Globale Suche
   - Filter nach Kriterien
   - Sortierung

4. **Export-Funktionen**
   - PDF-Export
   - Excel-Export
   - Berichte generieren

5. **Benachrichtigungen**
   - E-Mail-Benachrichtigungen
   - Wiedervorlagen-Reminder
   - Status-Updates

6. **Dashboard-Erweiterungen**
   - Charts & Statistiken
   - Performance-Metriken
   - Umsatz-Tracking

---

## 🐛 Troubleshooting

### Login funktioniert nicht:
```bash
# Admin-User neu erstellen
pnpm admin:create

# Datenbank prüfen
pnpm db:studio
```

### Seite lädt nicht:
```bash
# Server neu starten
pnpm dev

# Build-Cache löschen
rm -rf .next && pnpm dev
```

### Datenbank-Fehler:
```bash
# Migration erneut ausführen
pnpm db:migrate

# Schema prüfen
pnpm db:studio
```

---

## 📚 Technologie-Stack

- **Framework:** Next.js 15.4.4
- **React:** 19.1.0
- **Datenbank:** PostgreSQL (Coolify)
- **ORM:** Drizzle ORM
- **Auth:** NextAuth.js v5
- **Styling:** Tailwind CSS
- **UI:** Shadcn/ui
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **TypeScript:** 5.7.3

---

## ✅ Checkliste

- [x] Datenbank-Schema erstellt
- [x] Migration ausgeführt
- [x] Admin-Login implementiert
- [x] Dashboard erstellt
- [x] Kundenverwaltung (CRUD)
- [x] API-Routes implementiert
- [x] Responsive Design
- [x] TypeScript-Types
- [x] Sicherheit (Auth, Hashing)
- [ ] Vorgangsverwaltung vervollständigen
- [ ] Unterlagen-Upload
- [ ] Suchfunktion
- [ ] Export-Funktionen

---

## 🎉 Fertig!

Ihr CRM-System ist einsatzbereit! Starten Sie mit:

```bash
# 1. Admin erstellen
pnpm admin:create

# 2. Server starten
pnpm dev

# 3. Login unter http://localhost:3000/admin/login
```

**Viel Erfolg mit Ihrem neuen CRM-System! 🚀**
