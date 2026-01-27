# 🚀 Kreditheld24 CRM - Quick Start Guide

## ✅ System ist einsatzbereit!

### 1️⃣ Server starten

```bash
pnpm dev
```

### 2️⃣ Admin-Login

**URL:** http://localhost:3000/admin/login

**Zugangsdaten:**
- **E-Mail:** admin@kreditheld24.de
- **Passwort:** admin123

⚠️ **Wichtig:** Ändern Sie das Passwort nach dem ersten Login!

---

## 📋 Verfügbare Funktionen

### ✅ Kundenverwaltung
- Kunden anlegen, bearbeiten, löschen
- Alle Kontaktdaten erfassen
- Detailansicht mit Vorgängen

### ✅ Vorgangsverwaltung
- Kreditvorgänge verwalten
- Berater zuweisen
- Status verfolgen
- Wiedervorlagen setzen

### ✅ Aktivitätsverlauf
- E-Mails, Telefonate, Termine
- Chronologische Auflistung
- Filterung nach Typ

### ✅ Unterlagen-Management
- Dokumente hochladen (geplant)
- Dateiverwaltung
- Zuordnung zu Vorgängen

---

## 🎯 Erste Schritte

### 1. Ersten Kunden anlegen
1. Login unter `/admin/login`
2. Navigiere zu "Kunden"
3. Klicke "Neuer Kunde"
4. Fülle alle Felder aus
5. Speichern

### 2. Vorgang erstellen
1. Öffne Kundendetails
2. Klicke "Neuer Vorgang"
3. Erfasse Vorgangsdaten
4. Speichern

### 3. Aktivität hinzufügen
1. Öffne Vorgangsdetails
2. Füge Aktivität hinzu
3. Wähle Typ (E-Mail, Telefonat, etc.)
4. Speichern

---

## 🗄️ Datenbank-Befehle

```bash
# Migration generieren (nach Schema-Änderungen)
pnpm db:generate

# Migration ausführen
pnpm db:migrate

# Datenbank-GUI öffnen
pnpm db:studio

# Neuen Admin-User erstellen
pnpm admin:create email@example.com password "Name"
```

---

## 📱 Navigation

- **Dashboard:** `/admin`
- **Kunden:** `/admin/customers`
- **Vorgänge:** `/admin/cases`
- **Zinssätze:** `/admin/rates`

---

## 🔐 Sicherheit

- ✅ Passwörter sind mit bcrypt gehasht
- ✅ JWT-basierte Sessions
- ✅ Geschützte API-Routes
- ✅ Middleware-Authentifizierung

---

## 📚 Dokumentation

Vollständige Dokumentation: `CRM_DOCUMENTATION.md`

---

## 🆘 Support

Bei Problemen:
1. Server neu starten: `pnpm dev`
2. Cache löschen: `rm -rf .next`
3. Datenbank prüfen: `pnpm db:studio`

---

**Viel Erfolg mit Ihrem CRM-System! 🎉**
