# Kreditheld24 - Coolify Secrets

## 🔑 Generierte Secrets für Coolify

**⚠️ WICHTIG: Diese Secrets sind für Ihr Projekt generiert. Kopieren Sie sie sicher und löschen Sie diese Datei nach der Verwendung!**

---

## 📋 Secrets für Coolify-Services

### 🗄️ Datenbank-Secret:
```
Secret Name: DB_PASSWORD
Secret Value: KH24_DB_9x7mP2nQ8vR5tY3wE6uI1oA4sD7fG0hJ
```



### 📧 E-Mail-Konfiguration:
```
Secret Name: EMAIL_PASSWORD
Secret Value: [IHR_GMAIL_APP_PASSWORT_HIER_EINFÜGEN]
```
**Hinweis:** Ersetzen Sie dies durch Ihr echtes Gmail App-Passwort!

### 🔴 Redis-Cache (optional):
```
Secret Name: REDIS_PASSWORD
Secret Value: Redis_2024_7nB4mV9xZ2cF5gH8jK1lQ6wE3rT0yU
```

### 🌐 Domain-Konfiguration:
```
Secret Name: NEXT_PUBLIC_SITE_URL
Secret Value: https://kreditheld24.de
```

---

## 🛠️ Zusätzliche Sicherheits-Secrets

### 🔒 JWT-Secret (für Sessions):
```
Secret Name: JWT_SECRET
Secret Value: JWT_KH24_5mN8xB3vC6zF9gH2jK5lQ8wE1rT4yU7iO0pA
```

---

## 📝 Anleitung: Secrets in Coolify hinzufügen

### Schritt 1: Coolify Dashboard öffnen
1. Gehen Sie zu Ihrem Coolify-Dashboard
2. Navigieren Sie zu **"Secrets"** oder **"Environment Variables"**

### Schritt 2: Secrets erstellen
Für jeden Secret:
1. Klicken Sie auf **"Add Secret"** oder **"New Secret"**
2. **Name:** Verwenden Sie den exakten Secret Name (z.B. `DB_PASSWORD`)
3. **Value:** Kopieren Sie den Secret Value
4. **Scope:** Wählen Sie "Project" oder "Global" je nach Bedarf
5. Klicken Sie **"Save"** oder **"Create"**

### Schritt 3: Secrets den Services zuweisen
Bei der Service-Konfiguration:
1. Gehen Sie zu **Environment Variables**
2. Verwenden Sie die Syntax: `${SECRET_NAME}`
3. Beispiel: `DATABASE_URL=postgresql://kreditheld:${DB_PASSWORD}@postgres:5432/kreditheld24`

---

## 🔧 Service-spezifische Secret-Zuordnung

### 🖥️ Frontend-Service benötigt:
- `DB_PASSWORD`
- `EMAIL_PASSWORD`
- `JWT_SECRET`

### 🗄️ PostgreSQL-Service benötigt:
- `DB_PASSWORD`

### 🔴 Redis-Service benötigt:
- `REDIS_PASSWORD`

---

## 🔒 Sicherheits-Best-Practices

### ✅ Dos:
- **Kopieren Sie alle Secrets** in einen sicheren Passwort-Manager
- **Löschen Sie diese Datei** nach der Verwendung
- **Verwenden Sie unterschiedliche Secrets** für Development/Production
- **Rotieren Sie Secrets regelmäßig** (alle 3-6 Monate)
- **Beschränken Sie den Zugriff** auf Secrets

### ❌ Don'ts:
- **Niemals Secrets in Git** committen
- **Nicht in Logs ausgeben** oder debuggen
- **Nicht per E-Mail** oder Chat versenden
- **Nicht in Screenshots** oder Dokumentation zeigen
- **Nicht hardcoded** in Code verwenden

---

## 🔄 Secret-Rotation (Empfohlen)

### Alle 3 Monate rotieren:
- `JWT_SECRET`

### Alle 6 Monate rotieren:
- `DB_PASSWORD`
- `REDIS_PASSWORD`

### Bei Bedarf rotieren:
- `EMAIL_PASSWORD` (wenn Gmail-Passwort geändert)

---

## 🆘 Notfall-Prozedur

### Falls Secrets kompromittiert:
1. **Sofort alle betroffenen Secrets** in Coolify ändern
2. **Services neu starten** um neue Secrets zu laden
3. **Logs prüfen** auf verdächtige Aktivitäten
4. **Datenbank-Zugriffe überprüfen**
5. **Neue Secrets generieren** und dokumentieren

---

## 📞 Support

### Bei Problemen mit Secrets:
- **Coolify-Logs prüfen:** Service-spezifische Logs
- **Environment-Test:** `echo $SECRET_NAME` in Container
- **Verbindungstest:** Manuelle DB/Redis-Verbindung
- **Service-Restart:** Nach Secret-Änderungen

---

## ⚠️ WICHTIGER HINWEIS

**Diese Datei enthält sensible Informationen!**

1. **Kopieren Sie alle Secrets** in Ihren Passwort-Manager
2. **Fügen Sie die Secrets in Coolify** hinzu
3. **Testen Sie alle Services** mit den neuen Secrets
4. **LÖSCHEN SIE DIESE DATEI** vollständig

```bash
# Nach der Verwendung ausführen:
rm COOLIFY_SECRETS.md
git add .
git commit -m "Remove secrets file"
```

---

## 🎯 Checkliste

- [ ] Alle Secrets in Coolify erstellt
- [ ] Secrets den Services zugewiesen
- [ ] Frontend-Service getestet
- [ ] Scraper-Service getestet
- [ ] Datenbank-Verbindung funktioniert
- [ ] E-Mail-System funktioniert
- [ ] Redis-Cache funktioniert (optional)
- [ ] **Diese Datei gelöscht**

**Nach erfolgreicher Konfiguration: Diese Datei sicher löschen! 🗑️**