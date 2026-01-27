# 🗄️ Kreditheld24 - Postgres Datenbank Setup mit Drizzle ORM

## ✅ Setup abgeschlossen!

Die Postgres-Datenbank ist erfolgreich mit Drizzle ORM konfiguriert und die erste Migration wurde auf die Coolify-Datenbank angewendet.

---

## 📊 Datenbank-Schema

### Tabellen:
1. **interest_rates** - Zinssätze von verschiedenen Banken
2. **scraping_logs** - Protokolle der Scraping-Vorgänge
3. **email_verifications** - E-Mail-Verifizierungen für Formulare
4. **credit_applications** - Kreditanträge von Nutzern

---

## 🚀 Verfügbare Commands

### Migration Commands:
```bash
# Neue Migration generieren (nach Schema-Änderungen)
pnpm db:generate

# Migrations auf Datenbank anwenden
pnpm db:migrate

# Schema direkt pushen (nur Development!)
pnpm db:push

# Drizzle Studio öffnen (GUI für Datenbank)
pnpm db:studio

# Migration löschen
pnpm db:drop
```

---

## 🔧 Workflow: Schema-Änderungen

### 1. Schema bearbeiten
Bearbeite `src/db/schema.ts`:
```typescript
// Beispiel: Neue Spalte hinzufügen
export const interestRates = pgTable('interest_rates', {
  // ... bestehende Spalten
  newColumn: varchar('new_column', { length: 100 }),
});
```

### 2. Migration generieren
```bash
pnpm db:generate
```

### 3. Migration anwenden
```bash
pnpm db:migrate
```

### 4. Git Commit & Push
```bash
git add .
git commit -m "feat: add new_column to interest_rates"
git push
```

### 5. Automatisches Deployment
Coolify erkennt den Push und deployt automatisch. Die Migration wird automatisch ausgeführt.

---

## 💻 Datenbank in Code verwenden

### Import:
```typescript
import { db, interestRates, creditApplications } from '@/db';
import { eq, desc } from 'drizzle-orm';
```

### Beispiele:

#### Daten einfügen:
```typescript
await db.insert(interestRates).values({
  source: 'check24',
  kreditart: 'Ratenkredit',
  bank: 'Beispielbank',
  minZins: '2.99',
  maxZins: '9.99',
  repZins: '5.99',
  laufzeitMin: 12,
  laufzeitMax: 120,
  minSumme: 1000,
  maxSumme: 100000,
});
```

#### Daten abfragen:
```typescript
// Alle Zinssätze
const rates = await db.select().from(interestRates);

// Gefiltert nach Quelle
const check24Rates = await db
  .select()
  .from(interestRates)
  .where(eq(interestRates.source, 'check24'));

// Sortiert nach Datum
const latestRates = await db
  .select()
  .from(interestRates)
  .orderBy(desc(interestRates.createdAt))
  .limit(10);
```

#### Daten aktualisieren:
```typescript
await db
  .update(creditApplications)
  .set({ status: 'approved' })
  .where(eq(creditApplications.id, applicationId));
```

#### Daten löschen:
```typescript
await db
  .delete(emailVerifications)
  .where(eq(emailVerifications.verified, true));
```

---

## 🌐 Verbindungsdaten

### Lokal (Development):
```env
DATABASE_URL=postgres://postgres:PASSWORD@217.160.138.202:5432/postgres?sslmode=require
```

### Coolify (Production):
Die interne URL wird automatisch von Coolify gesetzt:
```env
DATABASE_URL=postgres://postgres:PASSWORD@b4kscs4o4csg4ckwg0gsw00g:5432/postgres?sslmode=require
```

---

## 🔄 Automatisches Deployment auf Coolify

### Aktueller Workflow:
1. **Lokal entwickeln** → Schema in `src/db/schema.ts` ändern
2. **Migration generieren** → `pnpm db:generate`
3. **Lokal testen** → `pnpm db:migrate` (auf öffentliche URL)
4. **Git Push** → `git push origin main`
5. **Coolify Auto-Deploy** → Erkennt Push und deployt
6. **Migration läuft automatisch** → Bei Deployment

### Für automatische Migrations bei Deployment:

#### Option 1: Build-Script erweitern (empfohlen)
Füge in `package.json` hinzu:
```json
"scripts": {
  "build": "pnpm db:migrate && cross-env NODE_OPTIONS=--no-deprecation next build"
}
```

#### Option 2: Coolify Pre-Deploy Command
In Coolify unter Service → Build Settings:
```bash
Pre-Deploy Command: pnpm db:migrate
```

---

## 🛠️ Drizzle Studio (Datenbank-GUI)

Starte die visuelle Datenbank-Oberfläche:
```bash
pnpm db:studio
```

Öffnet Browser auf `https://local.drizzle.studio`

Features:
- ✅ Tabellen browsen
- ✅ Daten bearbeiten
- ✅ SQL-Queries ausführen
- ✅ Schema visualisieren

---

## 📝 TypeScript Types

Alle Tabellen haben automatisch generierte TypeScript-Types:

```typescript
import type { 
  InterestRate, 
  NewInterestRate,
  CreditApplication,
  NewCreditApplication 
} from '@/db';

// Für SELECT (mit allen Feldern inkl. defaults)
const rate: InterestRate = await db.query.interestRates.findFirst();

// Für INSERT (nur required Felder)
const newRate: NewInterestRate = {
  source: 'check24',
  kreditart: 'Ratenkredit',
  // ...
};
```

---

## 🔒 Sicherheit

### Best Practices:
- ✅ `.env` ist in `.gitignore`
- ✅ Niemals Credentials in Code committen
- ✅ SSL-Verbindung aktiviert (`sslmode=require`)
- ✅ Starke Passwörter verwenden
- ✅ Regelmäßige Backups in Coolify aktivieren

---

## 🐛 Troubleshooting

### Migration schlägt fehl:
```bash
# Prüfe Verbindung
pnpm db:studio

# Prüfe .env
cat .env | grep DATABASE_URL

# Manuelle SQL-Ausführung
psql $DATABASE_URL
```

### Schema-Konflikte:
```bash
# Drizzle introspect (Schema aus DB lesen)
pnpm drizzle-kit introspect

# Schema-Diff anzeigen
pnpm drizzle-kit check
```

### Rollback:
```bash
# Letzte Migration rückgängig machen
pnpm db:drop
# Dann vorherige Migration erneut anwenden
```

---

## 📚 Weitere Ressourcen

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Drizzle Queries](https://orm.drizzle.team/docs/rqb)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

## ✅ Status

- ✅ Drizzle ORM installiert
- ✅ Schema definiert (`src/db/schema.ts`)
- ✅ Erste Migration generiert
- ✅ Migration auf Coolify-DB ausgeführt
- ✅ 4 Tabellen erstellt
- ✅ Alle Indizes angelegt
- ✅ TypeScript-Types verfügbar
- ✅ Ready for Development! 🚀
