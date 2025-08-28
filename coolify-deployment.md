# Coolify Deployment Guide für Kreditheld24

## 🚀 Coolify-spezifische Konfiguration

### 📋 Voraussetzungen

1. **Coolify Server** eingerichtet und erreichbar
2. **GitHub Repository** verfügbar: `https://github.com/smc1992/Kreditheld24`
3. **PostgreSQL Datenbank** in Coolify
4. **Domain** für die Website

### 🔧 Umgebungsvariablen für Coolify

Erstelle diese Environment Variables in deinem Coolify-Projekt:

```bash
# Database
DATABASE_URI=postgresql://username:password@postgres:5432/kreditheld24

# Payload CMS
PAYLOAD_SECRET=dein-super-sicherer-secret-key-hier
PAYLOAD_CONFIG_PATH=dist/payload.config.js

# Next.js
NEXT_PUBLIC_SERVER_URL=https://deine-domain.com
NEXTAUTH_SECRET=dein-nextauth-secret

# Node.js
NODE_ENV=production
PORT=3000

# Build
NODE_OPTIONS=--no-deprecation
```

### 📦 Build-Konfiguration

#### Build Command:
```bash
pnpm install && pnpm build
```

#### Start Command:
```bash
pnpm start
```

#### Port:
```
3000
```

### 🗄️ Datenbank-Setup

1. **PostgreSQL Service** in Coolify erstellen
2. **Datenbank** `kreditheld24` anlegen
3. **Migrationen ausführen** nach dem ersten Deployment:

```bash
# In Coolify Terminal/Console:
npx payload migrate

# Footer-Daten initialisieren:
psql $DATABASE_URI -f init-footer.sql
```

### 🔄 Deployment-Prozess

#### 1. Neues Projekt in Coolify erstellen
- **Source**: GitHub Repository
- **Repository**: `https://github.com/smc1992/Kreditheld24`
- **Branch**: `main`
- **Build Pack**: Node.js

#### 2. Environment Variables setzen
- Alle oben genannten Variablen in Coolify eintragen
- **DATABASE_URI** mit der PostgreSQL-Verbindung aus Coolify

#### 3. Build & Deploy
- Coolify führt automatisch `pnpm install && pnpm build` aus
- Nach erfolgreichem Build startet der Container mit `pnpm start`

#### 4. Post-Deployment Setup
- Datenbank-Migrationen ausführen
- Footer-Daten initialisieren
- Admin-User erstellen (optional)

### 🌐 Domain-Konfiguration

1. **Custom Domain** in Coolify hinzufügen
2. **SSL-Zertifikat** automatisch via Let's Encrypt
3. **NEXT_PUBLIC_SERVER_URL** entsprechend anpassen

### 📁 Wichtige Dateien für Coolify

#### `.env.example` (bereits vorhanden)
```bash
# Kopiere diese Datei zu .env und fülle die Werte aus
DATABASE_URI=
PAYLOAD_SECRET=
NEXT_PUBLIC_SERVER_URL=
```

#### `package.json` Scripts (bereits konfiguriert)
```json
{
  "scripts": {
    "build": "cross-env NODE_OPTIONS=--no-deprecation next build",
    "start": "cross-env NODE_OPTIONS=--no-deprecation next start",
    "dev": "cross-env NODE_OPTIONS=--no-deprecation next dev"
  }
}
```

### 🔍 Troubleshooting

#### Build-Fehler beheben:
1. **Node.js Version**: Stelle sicher, dass Node.js 18+ verwendet wird
2. **Memory**: Erhöhe Build-Memory falls nötig (2GB empfohlen)
3. **Dependencies**: Prüfe ob alle Dependencies korrekt installiert sind

#### Datenbank-Probleme:
1. **Verbindung**: Teste DATABASE_URI in Coolify Terminal
2. **Migrationen**: Führe Migrationen manuell aus falls nötig
3. **Permissions**: Stelle sicher, dass DB-User alle Rechte hat

#### Runtime-Fehler:
1. **Environment Variables**: Prüfe alle Required Variables
2. **Payload Secret**: Muss mindestens 32 Zeichen lang sein
3. **Logs**: Nutze Coolify Logs für Debugging

### 📊 Performance-Optimierung

#### Coolify-spezifische Einstellungen:
- **CPU**: 1-2 vCPUs für kleine bis mittlere Last
- **RAM**: 1-2 GB für optimale Performance
- **Storage**: 10-20 GB für Logs und temporäre Dateien

#### Caching:
- Next.js Static Generation ist bereits aktiviert
- Payload CMS nutzt automatisches Caching
- Reverse Proxy Caching in Coolify konfigurieren

### 🔐 Sicherheit

#### Wichtige Sicherheitsmaßnahmen:
1. **Starke Secrets**: Verwende sichere, zufällige Werte
2. **Database Security**: Beschränke DB-Zugriff auf notwendige IPs
3. **HTTPS**: Immer SSL/TLS verwenden
4. **Updates**: Regelmäßige Updates von Dependencies

### 📈 Monitoring

#### Coolify Monitoring nutzen:
- **Resource Usage**: CPU, RAM, Storage überwachen
- **Application Logs**: Fehler und Performance-Metriken
- **Uptime Monitoring**: Verfügbarkeit der Website
- **Database Monitoring**: PostgreSQL Performance

### 🚀 Go-Live Checklist

- [ ] PostgreSQL Datenbank erstellt
- [ ] Alle Environment Variables gesetzt
- [ ] GitHub Repository verknüpft
- [ ] Build erfolgreich
- [ ] Datenbank-Migrationen ausgeführt
- [ ] Footer-Daten initialisiert
- [ ] Domain konfiguriert
- [ ] SSL-Zertifikat aktiv
- [ ] Website erreichbar
- [ ] Admin-Panel funktional
- [ ] Alle Seiten laden korrekt
- [ ] Kontaktformulare funktionieren
- [ ] Kreditrechner arbeiten

### 📞 Support

Bei Problemen:
1. **Coolify Logs** prüfen
2. **GitHub Issues** für projektspezifische Probleme
3. **Coolify Community** für Deployment-Fragen

---

**Hinweis**: Diese Anleitung ist spezifisch für Coolify optimiert. Das Projekt ist bereits produktionsreif und getestet.