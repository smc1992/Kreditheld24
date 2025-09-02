# Kreditheld24 Zinssatz-Scraper

Ein automatisierter Service zum Sammeln aktueller Zinssätze von verschiedenen Kreditvergleichsportalen.

## Features

- 🕐 **Automatische tägliche Updates** um 6:00 Uhr
- 🔒 **Sichere API** mit Token-Authentifizierung
- 📊 **Monitoring und Logging** aller Scraping-Aktivitäten
- 🐳 **Docker-ready** für einfache Deployment
- 🔄 **Retry-Mechanismen** bei Fehlern
- 📈 **Health Checks** für Überwachung

## Architektur

```
scraper/
├── src/
│   ├── index.ts              # Hauptserver
│   ├── scrapers/
│   │   └── rateScraper.ts    # Scraping-Logik
│   ├── database/
│   │   └── rateStorage.ts    # Datenbank-Integration
│   ├── middleware/
│   │   └── auth.ts           # Authentifizierung
│   └── utils/
│       └── logger.ts         # Logging
├── Dockerfile                # Container-Konfiguration
├── package.json             # Dependencies
└── .env.example             # Umgebungsvariablen
```

## Installation

### Lokale Entwicklung

```bash
cd scraper
npm install
cp .env.example .env
# Konfiguriere .env Datei
npm run dev
```

### Docker Build

```bash
docker build -t kreditheld24-scraper .
docker run -p 3002:3002 --env-file .env kreditheld24-scraper
```

### Mit Docker Compose

```bash
# Im Hauptverzeichnis
docker-compose up scraper
```

## Konfiguration

### Umgebungsvariablen

```env
# Server
NODE_ENV=production
PORT=3002
LOG_LEVEL=info

# Datenbank
DATABASE_URL=postgresql://user:pass@host:5432/db

# Authentifizierung
CRON_SECRET=your-secret-key

# Scraping
SCRAPING_DELAY=30000
MAX_RETRIES=3
TIMEOUT=60000

# Cron Schedule
CRON_SCHEDULE=0 6 * * *
TIMEZONE=Europe/Berlin
```

## API Endpoints

### Health Check
```http
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "kreditheld24-scraper"
}
```

### Manuelles Scraping
```http
POST /api/scrape
Authorization: Bearer YOUR_CRON_SECRET
```

Response:
```json
{
  "success": true,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "results": [
    {
      "source": "check24",
      "success": true,
      "rateCount": 15,
      "error": null
    }
  ]
}
```

### Status Abfrage
```http
GET /api/status
```

## Coolify Integration

### Service-Konfiguration

1. **Neuer Service** in Coolify erstellen
2. **Git Repository** verbinden
3. **Build Path** auf `./scraper` setzen
4. **Port** auf `3002` konfigurieren
5. **Environment Variables** setzen

### Environment Variables in Coolify

```env
NODE_ENV=production
PORT=3002
DATABASE_URL=postgresql://kreditheld:${DB_PASSWORD}@postgres:5432/kreditheld24
CRON_SECRET=${CRON_SECRET}
CRON_SCHEDULE=0 6 * * *
TIMEZONE=Europe/Berlin
```

### Service Dependencies

- **PostgreSQL** (für Datenspeicherung)
- **Redis** (optional, für Caching)
- **Frontend** (für API-Integration)

## Monitoring

### Logs

```bash
# Container Logs
docker logs kreditheld24-scraper

# Log-Dateien
tail -f scraper/logs/combined.log
tail -f scraper/logs/error.log
```

### Health Checks

```bash
# Docker Health Check
docker inspect --format='{{.State.Health.Status}}' kreditheld24-scraper

# Manual Health Check
curl http://localhost:3002/health
```

### Metriken

- **Scraping-Erfolgsrate** pro Quelle
- **Durchschnittliche Scraping-Dauer**
- **Anzahl gesammelter Zinssätze**
- **Fehlerrate und -typen**

## Scraping-Quellen

### Aktuell implementiert (Demo)

- **Check24** (simuliert)
- **Verivox** (simuliert)
- **Smava** (simuliert)

### Geplante Erweiterungen

- **ING Bank** (direkte Website)
- **DKB** (direkte Website)
- **Commerzbank** (direkte Website)
- **Santander** (direkte Website)

## Sicherheit

### Best Practices

- **Rate Limiting** zwischen Requests
- **User-Agent Rotation**
- **Proxy-Unterstützung** (optional)
- **robots.txt Respektierung**
- **Fehler-Handling** bei Blockierungen

### Rechtliche Aspekte

- **Terms of Service** beachten
- **Moderate Frequenz** (1x täglich)
- **Keine übermäßige Server-Belastung**
- **Transparente User-Agents**

## Troubleshooting

### Häufige Probleme

**Scraping schlägt fehl:**
```bash
# Logs prüfen
docker logs kreditheld24-scraper

# Manuell testen
curl -X POST http://localhost:3002/api/scrape \
  -H "Authorization: Bearer YOUR_SECRET"
```

**Datenbank-Verbindung:**
```bash
# PostgreSQL Verbindung testen
psql $DATABASE_URL -c "SELECT 1;"
```

**Cron-Jobs laufen nicht:**
```bash
# Environment prüfen
echo $NODE_ENV
echo $CRON_SCHEDULE
```

## Entwicklung

### Neue Scraper hinzufügen

1. **Scraper-Funktion** in `scrapers/rateScraper.ts` erstellen
2. **Tests** schreiben
3. **Error-Handling** implementieren
4. **Logging** hinzufügen

### Testing

```bash
# Unit Tests
npm test

# Integration Tests
npm run test:integration

# Manual Testing
npm run scrape
```

## Deployment

### Coolify Deployment

1. **Git Push** → Automatisches Build
2. **Health Check** → Service-Verfügbarkeit
3. **Logs** → Monitoring in Coolify
4. **Rollback** → Bei Problemen

### Produktions-Checkliste

- [ ] Environment Variables gesetzt
- [ ] Datenbank-Schema erstellt
- [ ] Health Checks funktionieren
- [ ] Cron-Jobs konfiguriert
- [ ] Monitoring eingerichtet
- [ ] Backup-Strategie definiert

## Support

Bei Problemen:

1. **Logs prüfen** (`/logs/` Verzeichnis)
2. **Health Check** aufrufen (`/health`)
3. **Manuelle Scraping** testen (`/api/scrape`)
4. **Datenbank-Verbindung** prüfen
5. **Environment Variables** validieren