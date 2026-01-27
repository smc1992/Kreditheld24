# 🚀 Automatische Migrations bei Coolify Deployment

## Übersicht

Dieses Dokument beschreibt, wie Datenbank-Migrations automatisch bei jedem Deployment auf Coolify ausgeführt werden.

---

## ⚙️ Coolify Konfiguration

### Option 1: Pre-Deploy Command (Empfohlen)

In Coolify unter **Service → Build Settings**:

```bash
Pre-Deploy Command: pnpm db:migrate
```

**Vorteile:**
- ✅ Migration läuft vor dem Build
- ✅ Bei Fehler wird Deployment abgebrochen
- ✅ Sauber getrennt vom Build-Prozess

---

### Option 2: Build-Script erweitern

In `package.json`:

```json
{
  "scripts": {
    "build": "pnpm db:migrate && cross-env NODE_OPTIONS=--no-deprecation next build"
  }
}
```

**Vorteile:**
- ✅ Funktioniert automatisch bei jedem Build
- ✅ Keine Coolify-Konfiguration nötig

**Nachteile:**
- ⚠️ Migration läuft auch bei lokalem Build

---

## 🔐 Environment Variables in Coolify

Stelle sicher, dass folgende Environment Variables gesetzt sind:

### Production (Coolify):
```env
# Interne Coolify-Verbindung (schneller)
DATABASE_URL=postgres://postgres:PASSWORD@b4kscs4o4csg4ckwg0gsw00g:5432/postgres?sslmode=require

# Oder externe Verbindung
DATABASE_URL=postgres://postgres:PASSWORD@217.160.138.202:5432/postgres?sslmode=require

NODE_ENV=production
```

---

## 📝 Workflow: Änderungen deployen

### 1. Lokal entwickeln
```bash
# Schema ändern in src/db/schema.ts
# Neue Migration generieren
pnpm db:generate

# Lokal testen (auf öffentliche DB)
pnpm db:migrate
```

### 2. Committen & Pushen
```bash
git add .
git commit -m "feat: add new database column"
git push origin main
```

### 3. Automatisches Deployment
- Coolify erkennt den Push
- Pre-Deploy Command läuft: `pnpm db:migrate`
- Migration wird auf Production-DB angewendet
- Build startet
- Deployment abgeschlossen ✅

---

## 🔄 Migration-Dateien

### Was wird committed?
```
drizzle/
├── 0000_worthless_leech.sql     ✅ Commit
├── 0001_next_migration.sql      ✅ Commit
└── meta/
    ├── _journal.json            ❌ Gitignore
    └── 0000_snapshot.json       ❌ Gitignore
```

**Wichtig:** Nur `.sql` Dateien committen, `meta/` Ordner ist in `.gitignore`

---

## 🛡️ Sicherheit & Best Practices

### Rollback-Strategie
```bash
# Bei Problemen: Vorherige Version deployen
git revert HEAD
git push

# Oder: Manuell in Coolify vorherige Version wählen
```

### Backup vor großen Änderungen
```bash
# In Coolify: Database → Backup → Create Manual Backup
```

### Testing
```bash
# Immer erst lokal testen
pnpm db:migrate

# Dann auf Production deployen
git push
```

---

## 🐛 Troubleshooting

### Migration schlägt bei Deployment fehl

**Logs prüfen:**
```bash
# In Coolify: Service → Logs → Build Logs
```

**Häufige Fehler:**

#### 1. DATABASE_URL nicht gesetzt
```
Error: DATABASE_URL is not set
```
**Lösung:** Environment Variable in Coolify setzen

#### 2. Verbindung fehlgeschlagen
```
Error: getaddrinfo ENOTFOUND
```
**Lösung:** Interne Coolify-URL verwenden (`b4kscs4o4csg4ckwg0gsw00g`)

#### 3. Migration-Konflikt
```
Error: Migration already applied
```
**Lösung:** `drizzle/meta/` Ordner lokal löschen und neu generieren

---

## 📊 Monitoring

### Migration-Logs prüfen
```bash
# In Coolify: Service → Logs
# Suche nach: "🚀 Running migrations..."
```

### Erfolgreiche Migration:
```
🔌 Connecting to database...
🔧 Enabling UUID extension...
🚀 Running migrations...
✅ Migrations completed successfully!
```

### Fehlgeschlagene Migration:
```
❌ Migration failed: [Error Details]
```

---

## 🎯 Checkliste für Deployment

- [ ] Schema-Änderungen in `src/db/schema.ts`
- [ ] Migration generiert: `pnpm db:generate`
- [ ] Lokal getestet: `pnpm db:migrate`
- [ ] TypeScript-Errors behoben
- [ ] `.sql` Dateien committed
- [ ] `meta/` Ordner in `.gitignore`
- [ ] Git Push
- [ ] Coolify Deployment beobachten
- [ ] Migration-Logs prüfen
- [ ] Website testen

---

## 🔗 Verwandte Dateien

- `DATABASE_SETUP.md` - Vollständige Datenbank-Dokumentation
- `COOLIFY_DEPLOYMENT.md` - Allgemeine Deployment-Anleitung
- `src/db/migrate.ts` - Migration-Script
- `drizzle.config.ts` - Drizzle-Konfiguration

---

## ✅ Status

- ✅ Automatische Migrations konfiguriert
- ✅ Pre-Deploy Command eingerichtet
- ✅ Environment Variables gesetzt
- ✅ Erste Migration erfolgreich deployed
- ✅ Ready for Production! 🚀
