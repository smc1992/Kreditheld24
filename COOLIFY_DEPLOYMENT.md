# Kreditheld24 - Coolify Deployment Guide

## 🚀 Service-Übersicht

Dieses Projekt besteht aus **2 Hauptservices** + 1 optionalem Service:

1. **Frontend** (Next.js Website) - PFLICHT
2. **PostgreSQL** (Datenbank) - PFLICHT  
3. **Redis** (Cache) - OPTIONAL

---

## 🔑 Benötigte Secrets

### Erstellen Sie diese Secrets in Coolify:

```bash
# Datenbank-Passwort (stark und sicher)
DB_PASSWORD=KreditHeld24_DB_2024!SecurePass

# E-Mail-Konfiguration (Gmail App-Passwort)
EMAIL_PASSWORD=IhrGmailAppPasswort

# Redis-Passwort (optional)
REDIS_PASSWORD=Redis_Cache_2024_SecureKey456
```

**⚠️ Wichtig:** Ersetzen Sie diese Beispiel-Passwörter durch eigene sichere Werte!

---

## 📦 Service 1: Frontend (Next.js)

### Service-Konfiguration:
```
Service Name: kreditheld24-frontend
Service Type: Application
Repository: https://github.com/smc1992/Kreditheld24.git
Branch: main
Build Command: pnpm build
Start Command: pnpm start
Port: 3000
Domain: kreditheld24.de
Build Context: .
```

### Environment Variables:
```env
# Basis-Konfiguration
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://kreditheld24.de

# Datenbank-Verbindung
DATABASE_URL=postgresql://kreditheld:${DB_PASSWORD}@postgres:5432/kreditheld24

# E-Mail-System
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@kreditheld24.de
SMTP_PASS=${EMAIL_PASSWORD}

# Redis-Cache (optional)
REDIS_URL=redis://redis:6379

# Performance-Optimierung
NEXT_TELEMETRY_DISABLED=1
NODE_OPTIONS=--max-old-space-size=2048
```

### Dependencies:
- PostgreSQL Service
- Redis Service (optional)

### Health Check:
- URL: `/`
- Interval: 30s
- Timeout: 10s

---

## 🗄️ Service 2: PostgreSQL (Datenbank)

### Service-Konfiguration:
```
Service Name: kreditheld24-postgres
Service Type: Database
Image: postgres:15-alpine
Port: 5432 (intern)
Volume: /var/lib/postgresql/data
```

### Environment Variables:
```env
# Datenbank-Konfiguration
POSTGRES_DB=kreditheld24
POSTGRES_USER=kreditheld
POSTGRES_PASSWORD=${DB_PASSWORD}
POSTGRES_INITDB_ARGS=--encoding=UTF-8 --lc-collate=C --lc-ctype=C
```

### Initialization:
```sql
-- Nach dem ersten Start ausführen:
-- Verbindung: psql postgresql://kreditheld:${DB_PASSWORD}@localhost:5432/kreditheld24
-- Dann: \i database/init.sql
```

### Health Check:
```bash
pg_isready -U kreditheld -d kreditheld24
```

### Backup-Konfiguration:
```
Schedule: 0 2 * * * (täglich 2:00 Uhr)
Retention: 30 Tage
Compression: true
```

---

## 🔴 Service 3: Redis (Cache) - OPTIONAL

### Service-Konfiguration:
```
Service Name: kreditheld24-redis
Service Type: Cache
Image: redis:7-alpine
Port: 6379 (intern)
Volume: /data
```

### Environment Variables:
```env
# Redis-Konfiguration
REDIS_PASSWORD=${REDIS_PASSWORD}
```

### Command Override:
```bash
redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
```

### Health Check:
```bash
redis-cli --raw incr ping
```

---

## 🔗 Service-Dependencies

### Deployment-Reihenfolge:
1. **PostgreSQL** (zuerst)
2. **Redis** (optional, zweites)
3. **Frontend** (letztes)

### Abhängigkeiten konfigurieren:
```
Frontend depends on:
  - PostgreSQL
  - Redis (optional)

PostgreSQL depends on:
  - Keine

Redis depends on:
  - Keine
```

---

## 🌐 Domain & SSL

### Domain-Konfiguration:
```
Primary Domain: kreditheld24.de
SSL: Auto (Let's Encrypt)
WWW Redirect: www.kreditheld24.de → kreditheld24.de
```

### Subdomain-Optionen:
```
Scraper Admin: scraper.kreditheld24.de (optional)
API Endpoint: api.kreditheld24.de (optional)
```

---

## 📊 Monitoring & Logs

### Log-Konfiguration:
```
Log Level: info
Log Retention: 7 Tage
Log Format: JSON
```

### Monitoring-Endpoints:
```
Frontend Health: https://kreditheld24.de/
Scraper Health: http://scraper:3002/health
Database Health: pg_isready
Redis Health: redis-cli ping
```

### Alerts einrichten:
```
Service Down: E-Mail an admin@kreditheld24.de
High CPU: > 80% für 5 Minuten
High Memory: > 90% für 5 Minuten
Disk Full: > 85% Speicher
```

---

## 🔧 Troubleshooting

### Häufige Probleme:

#### Frontend startet nicht:
```bash
# Logs prüfen
docker logs kreditheld24-frontend

# Database-Verbindung testen
psql $DATABASE_URL -c "SELECT 1;"
```

#### Scraper funktioniert nicht:
```bash
# Health Check
curl http://scraper:3002/health

# Manuelles Scraping testen
curl -X POST http://scraper:3002/api/scrape \
  -H "Authorization: Bearer ${CRON_SECRET}"
```

#### Datenbank-Probleme:
```bash
# Verbindung testen
pg_isready -h postgres -p 5432 -U kreditheld

# Schema prüfen
psql $DATABASE_URL -c "\dt"
```

### Performance-Optimierung:
```bash
# Frontend Build-Cache leeren
docker system prune -f

# Datenbank-Statistiken aktualisieren
psql $DATABASE_URL -c "ANALYZE;"

# Redis-Cache leeren
redis-cli FLUSHALL
```

---

## 🚀 Deployment-Checkliste

### Vor dem Deployment:
- [ ] **Secrets erstellt** (DB_PASSWORD, CRON_SECRET, etc.)
- [ ] **Domain konfiguriert** (kreditheld24.de)
- [ ] **SSL-Zertifikat** aktiviert
- [ ] **E-Mail-Konfiguration** getestet

### Services deployen:
- [ ] **PostgreSQL** Service erstellt
- [ ] **Database Schema** mit init.sql geladen
- [ ] **Redis** Service erstellt (optional)
- [ ] **Frontend** Service erstellt und gestartet
- [ ] **Scraper** Service erstellt und gestartet

### Nach dem Deployment:
- [ ] **Website erreichbar** (https://kreditheld24.de)
- [ ] **Health Checks** funktionieren
- [ ] **Scraper läuft** (ersten Test durchführen)
- [ ] **E-Mail-System** getestet
- [ ] **Monitoring** eingerichtet
- [ ] **Backup-Strategie** aktiviert

---

## 📞 Support & Wartung

### Regelmäßige Aufgaben:
```
Täglich:
  - Health Checks prüfen
  - Scraper-Logs kontrollieren

Wöchentlich:
  - Database-Performance prüfen
  - Log-Dateien archivieren

Monatlich:
  - Backup-Restore testen
  - Security-Updates prüfen
  - Performance-Optimierung
```

### Kontakt bei Problemen:
```
Technischer Support: admin@kreditheld24.de
Notfall-Hotline: +49 XXX XXXXXXX
Status-Page: status.kreditheld24.de
```

---

## 🎯 Geschätzte Kosten

### Resource-Anforderungen:
```
Frontend:
  CPU: 1 Core
  RAM: 1GB
  Disk: 5GB

PostgreSQL:
  CPU: 1 Core
  RAM: 2GB
  Disk: 20GB

Scraper:
  CPU: 1 Core
  RAM: 1GB
  Disk: 5GB

Redis (optional):
  CPU: 0.5 Core
  RAM: 512MB
  Disk: 2GB

Total: ~3.5 Cores, 4.5GB RAM, 32GB Disk
```

### Geschätzte monatliche Kosten:
```
VPS (4 Cores, 8GB RAM): ~25-40€/Monat
Domain & SSL: ~15€/Jahr
Backup-Storage: ~5€/Monat

Total: ~30-45€/Monat
```

---

## 🎉 Erfolg!

Nach erfolgreichem Deployment haben Sie:

✅ **Vollständige Kreditvergleichsplattform**
✅ **Automatische Zinssatz-Updates**
✅ **Professionelles E-Mail-System**
✅ **Skalierbare Architektur**
✅ **Monitoring & Backup**
✅ **SSL-verschlüsselte Website**

**Ihre Kreditheld24-Website ist produktionsbereit! 🚀**