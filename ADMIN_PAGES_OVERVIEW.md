# Kreditheld24 CRM - Admin-Seiten Übersicht

## 🎨 Design-System

Alle Admin-Seiten verwenden ein einheitliches, modernes Design mit Gradients:

- 🟣 **Lila-Gradient**: Kunden (#667eea → #764ba2)
- 🌸 **Pink-Gradient**: Vorgänge (#f093fb → #f5576c)
- 🔵 **Cyan-Gradient**: Aktivitäten (#4facfe → #00f2fe)
- 🟢 **Grün-Gradient**: Dokumente (#43e97b → #38f9d7)
- 🔴 **Navy-Gradient**: Navigation (#0A2540 → #1a3a5c)

## 📄 Alle Admin-Seiten

### 1. **Login** (`/admin/login`)
- **Beschreibung**: Admin-Login mit Kreditheld24 CI
- **Features**:
  - Navy-Gradient Hintergrund
  - Shield-Logo mit Blau-Grün-Gradient
  - E-Mail & Passwort Felder
  - Dynamisches Jahr im Footer
  - Standard-Zugangsdaten angezeigt
- **Credentials**: admin@kreditheld24.de / admin123
- **Design**: Vollbild-Login mit zentrierter Card

---

### 2. **Dashboard** (`/admin`)
- **Beschreibung**: Hauptübersicht mit Statistiken
- **Features**:
  - 4 Statistik-Karten mit Gradients:
    - 👥 Kunden (Lila)
    - 📁 Vorgänge (Pink)
    - 📊 Aktivitäten (Cyan)
    - ⏰ Wiedervorlagen (Grün)
  - Schnellzugriff-Buttons:
    - 👤 Neuer Kunde (Lila-Gradient)
    - 📋 Neuer Vorgang (Pink-Gradient)
  - Live-Daten von API
  - Hover-Effekte mit Transform & Shadow
- **API**: `/api/admin/stats`

---

### 3. **Kunden-Übersicht** (`/admin/customers`)
- **Beschreibung**: Liste aller Kunden
- **Features**:
  - Moderne Tabelle mit:
    - Avatar-Kreise mit Initialen
    - Name & Nationalität
    - 📧 E-Mail & 📱 Telefon
    - Geburtsdatum
    - Erstelldatum
    - Details-Button (Lila-Gradient)
  - "Neuer Kunde" Button (Lila-Gradient)
  - Responsive mit Scroll
- **API**: `/api/admin/customers`
- **Design**: Weiße Card mit 16px Border-Radius

---

### 4. **Neuer Kunde** (`/admin/customers/new`)
- **Beschreibung**: Formular zum Anlegen neuer Kunden
- **Features**:
  - Zurück-Button
  - 2 Sektionen:
    - **Persönliche Daten**: Vorname, Nachname, Geburtsdatum, Geburtsort, Familienstand, Kinder, Staatsangehörigkeit
    - **Kontaktdaten**: Adresse, Telefon, E-Mail
  - Responsive Grid (auto-fit, minmax 280px)
  - Lila Focus-Border (#667eea)
  - Abbrechen & Speichern Buttons
- **API**: `POST /api/admin/customers`
- **Design**: Weiße Card mit Formular-Grid

---

### 5. **Kunden-Details** (`/admin/customers/[id]`)
- **Status**: ⚠️ Noch zu erstellen
- **Geplante Features**:
  - Kundendetails anzeigen
  - Bearbeiten-Funktion
  - Verknüpfte Vorgänge anzeigen
  - Aktivitätsverlauf

---

### 6. **Vorgänge-Übersicht** (`/admin/cases`)
- **Beschreibung**: Liste aller Kreditvorgänge
- **Features**:
  - Moderne Tabelle mit:
    - 📁 Icon mit Vorgangsnummer
    - Kundenname (verknüpft)
    - Berater Name/Nummer
    - Kreditbeträge (beantragt + genehmigt ✓)
    - Bank
    - Status-Badge mit Farben:
      - 🔵 Offen
      - 🟠 In Bearbeitung
      - 🟢 Genehmigt
      - 🔴 Abgelehnt
      - ⚫ Geschlossen
    - Details-Button (Pink-Gradient)
  - "Neuer Vorgang" Button (Pink-Gradient)
- **API**: `/api/admin/cases`
- **Design**: Pink-Theme durchgehend

---

### 7. **Neuer Vorgang** (`/admin/cases/new`)
- **Beschreibung**: Formular zum Anlegen neuer Vorgänge
- **Features**:
  - Zurück-Button
  - 2 Sektionen:
    - **Vorgangsdaten**: Kunde (Dropdown), Vorgangsnummer (auto), Berater Name/Nummer
    - **Kreditdaten**: Beantragter Betrag, Genehmigter Betrag, Bank, Laufzeit, Wiedervorlage, Status
  - Auto-generierte Vorgangsnummer (VG-XXXXXXXX)
  - Kunden-Dropdown mit allen Kunden
  - Pink Focus-Border (#f093fb)
  - Status-Dropdown (Offen, In Bearbeitung, etc.)
- **API**: `POST /api/admin/cases`
- **Design**: Pink-Gradient Button

---

### 8. **Vorgangs-Details** (`/admin/cases/[id]`)
- **Beschreibung**: Detailansicht eines Vorgangs mit Tabs
- **Features**:
  - Header mit:
    - Zurück-Button
    - Vorgangsnummer
    - Kundenname
    - Status-Badge
  - **3 Tabs**:
    
    **Tab 1: Details**
    - 3 Cards nebeneinander:
      - Kundendaten (Name, E-Mail, Telefon)
      - Beraterdaten (Name, Nummer)
      - Kreditdaten (Beträge groß, Bank, Laufzeit, Wiedervorlage)
    
    **Tab 2: Aktivitäten** (Cyan-Theme)
    - Timeline-Ansicht
    - Icons: 📧 E-Mail, 📞 Anruf, 🤝 Meeting, 📝 Notiz
    - Datum & Beschreibung
    - "Neue Aktivität" Button (Cyan-Gradient)
    
    **Tab 3: Unterlagen** (Grün-Theme)
    - Grid mit Dokument-Karten
    - 📄 Icon, Name, Dateigröße
    - "Dokument hochladen" Button (Grün-Gradient)
    - Hover-Effekt auf Karten
- **APIs**: 
  - `/api/admin/cases/[id]`
  - `/api/admin/activities?caseId=...`
  - `/api/admin/documents?caseId=...`
- **Design**: Tab-Navigation mit Pink-Underline

---

### 9. **Zinssätze** (`/admin/rates`)
- **Status**: ⚠️ Noch zu erstellen
- **Geplante Features**:
  - Liste aller Zinssätze
  - Filter nach Bank, Kreditart
  - Scraping-Status anzeigen
  - Neue Zinssätze manuell hinzufügen

---

## 🧭 Navigation

Alle Seiten (außer Login) haben die **AdminNav** Komponente:

- **Logo**: Shield-Icon mit Blau-Grün-Gradient + "Kreditheld24 CRM"
- **Menüpunkte** mit Icons:
  - 📊 Dashboard (`/admin`)
  - 👥 Kunden (`/admin/customers`)
  - 📁 Vorgänge (`/admin/cases`)
  - 💰 Zinssätze (`/admin/rates`)
- **Rechts**: Admin-Name + Abmelden-Button
- **Design**: Navy-Gradient (#0A2540 → #1a3a5c)
- **Aktiver Zustand**: Weiße Highlight-Box mit Border

---

## 🎯 Layout-Struktur

```
/admin/layout.tsx (SessionProvider)
  └─ DashboardLayout (Navigation + Session-Check)
      └─ AdminNav (Navy-Gradient)
      └─ Content Area (max-width: 1280px)
```

**Alle Seiten verwenden**:
- `DashboardLayout` für Navigation & Auth
- Inline-Styles für konsistentes Design
- Gradient-Buttons mit Hover-Effekten
- 16px Border-Radius für moderne Optik
- Box-Shadows: `0 4px 6px rgba(0,0,0,0.05)`

---

## 📊 Datenmodell

### **Tabellen**:
1. `admin_users` - Admin-Benutzer
2. `crm_customers` - Kunden
3. `crm_cases` - Vorgänge
4. `crm_activities` - Aktivitäten
5. `crm_documents` - Dokumente

### **Beziehungen**:
- Customer → Cases (1:n)
- Case → Activities (1:n)
- Case → Documents (1:n)

---

## 🔐 Authentifizierung

- **NextAuth.js** mit Credentials Provider
- **Session-Check** in DashboardLayout
- **Redirect** zu `/admin/login` wenn nicht authentifiziert
- **API-Schutz** mit `auth()` in allen Routes

---

## 🎨 Design-Prinzipien

1. **Gradients überall**: Buttons, Icons, Badges
2. **Hover-Effekte**: Transform + Shadow-Änderung
3. **Focus-States**: Farbige Border bei Inputs
4. **Konsistente Abstände**: 16px, 24px, 32px
5. **Moderne Schatten**: `0 4px 6px rgba(0,0,0,0.05)`
6. **Große Border-Radius**: 12px, 16px
7. **Bold Zahlen**: 36px, 800 weight für Statistiken
8. **Icons**: Emojis statt Icon-Libraries

---

## 📱 Responsive Design

- **Grid**: `repeat(auto-fit, minmax(280px, 1fr))`
- **Max-Width**: 1280px für Content
- **Overflow**: Horizontal-Scroll bei Tabellen
- **Mobile**: Alle Buttons & Cards stapeln sich

---

## ✅ Status

| Seite | Status | API | Design |
|-------|--------|-----|--------|
| Login | ✅ Fertig | - | ✅ Navy-Gradient |
| Dashboard | ✅ Fertig | ✅ | ✅ 4 Gradients |
| Kunden-Liste | ✅ Fertig | ✅ | ✅ Lila-Theme |
| Neuer Kunde | ✅ Fertig | ✅ | ✅ Lila-Gradient |
| Kunden-Details | ⚠️ TODO | ⚠️ | - |
| Vorgänge-Liste | ✅ Fertig | ✅ | ✅ Pink-Theme |
| Neuer Vorgang | ✅ Fertig | ✅ | ✅ Pink-Gradient |
| Vorgangs-Details | ✅ Fertig | ✅ | ✅ 3 Tabs |
| Zinssätze | ⚠️ TODO | ✅ | - |

---

## 🚀 Nächste Schritte

1. **Kunden-Details Seite** erstellen
2. **Zinssätze-Verwaltung** implementieren
3. **Aktivitäten-Formular** für neue Einträge
4. **Dokument-Upload** Funktionalität
5. **Suchfunktion** für Kunden & Vorgänge
6. **Filter & Sortierung** in Tabellen
7. **Export-Funktion** (CSV, PDF)
8. **Dashboard-Charts** mit Statistiken

---

## 📝 Notizen

- Alle Seiten verwenden **Client Components** (`'use client'`)
- **Inline-Styles** statt Tailwind für Konsistenz
- **Session-Check** in jedem useEffect
- **Loading-States** für bessere UX
- **Error-Handling** mit try-catch
- **TypeScript** für Type-Safety
- **Drizzle ORM** für Datenbank-Zugriff
