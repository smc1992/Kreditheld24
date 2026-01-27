# Kreditheld24 - WordPress Headless CMS Website

Eine moderne Website für Kreditvergleiche, gebaut mit Next.js und WordPress als Headless CMS.

## 🚀 Technologie-Stack

- **Frontend**: Next.js 15 mit App Router
- **Backend/CMS**: WordPress (Headless)
- **API**: WordPress REST API + WPGraphQL
- **Styling**: Tailwind CSS
- **TypeScript**: Vollständige Typisierung
- **Deployment**: Vercel/Netlify + WordPress Subdomain

## 📋 Features

### ✅ Implementiert
- **Responsive Design** für alle Geräte
- **SEO-optimiert** mit dynamischen Meta-Tags
- **Performance-optimiert** mit Next.js ISR
- **Kreditanfrage-Formular** mit Validierung
- **Impressum & Datenschutz** (DSGVO-konform)
- **WordPress API Integration** mit Caching
- **Automatische Revalidierung** via Webhooks

### 🔄 In Entwicklung
- WordPress Custom Post Types
- Content-Migration von statischen Seiten
- Blog-System mit WordPress
- Erweiterte Kreditrechner

## 🛠️ Installation

### Voraussetzungen
- Node.js 18+
- pnpm (empfohlen) oder npm
- WordPress-Installation auf Subdomain

### Setup

1. **Repository klonen**
```bash
git clone https://github.com/smc1992/Kreditheld24.git
cd kreditheld24-payload-template
```

2. **Dependencies installieren**
```bash
pnpm install
```

3. **Environment Variables konfigurieren**
```bash
cp .env.example .env.local
```

Füllen Sie die `.env.local` mit Ihren WordPress-Daten:
```env
WORDPRESS_URL=https://cms.kreditheld24.de
NEXT_PUBLIC_WORDPRESS_URL=https://cms.kreditheld24.de
WORDPRESS_WEBHOOK_SECRET=ihr-webhook-secret
REVALIDATE_SECRET=ihr-revalidate-secret
NEXT_PUBLIC_SITE_URL=https://kreditheld24.de
```

4. **Development Server starten**
```bash
pnpm dev
```

Die Website ist unter `http://localhost:3000` verfügbar.

## 📁 Projektstruktur

```
src/
├── app/
│   ├── (frontend)/          # Alle Website-Seiten
│   │   ├── page.tsx         # Startseite
│   │   ├── impressum/       # Impressum
│   │   ├── datenschutz/     # Datenschutzerklärung
│   │   ├── kreditanfrage/   # Kreditanfrage-Formular
│   │   └── .../             # Weitere Kreditseiten
│   ├── api/
│   │   └── revalidate/      # WordPress Webhook
│   └── sitemap.ts           # Dynamische Sitemap
├── components/
│   ├── KreditanfrageForm.tsx     # Hauptformular
│   ├── UnverbindlichAnfragenButton.tsx
│   └── ui/                       # UI-Komponenten
├── providers/
│   └── Theme/               # Theme-Management
lib/
├── wordpress.ts             # WordPress API
└── wordpress.d.ts           # TypeScript-Typen
```

## 🔧 WordPress Setup

Detaillierte Anweisungen finden Sie in der [WordPress Setup Anleitung](./WORDPRESS_SETUP.md).

### Schnellstart

1. **WordPress auf Subdomain installieren**
   - `cms.kreditheld24.de`
   - SSL-Zertifikat konfigurieren

2. **Erforderliche Plugins installieren**
   - WPGraphQL (empfohlen)
   - Advanced Custom Fields
   - WP Webhooks

3. **Custom Post Types erstellen**
   - Kreditarten
   - Services
   - Blog-Posts

4. **Webhook konfigurieren**
   - URL: `https://kreditheld24.de/api/revalidate`
   - Secret: Ihr Webhook-Secret

## 🚀 Deployment

### Frontend (Next.js)

**Vercel (empfohlen)**
```bash
# Vercel CLI installieren
npm i -g vercel

# Deployen
vercel
```

**Netlify**
```bash
# Build-Kommando: pnpm build
# Publish-Verzeichnis: .next
```

### Backend (WordPress)

- WordPress auf Subdomain hosten
- SSL-Zertifikat konfigurieren
- Plugins installieren und konfigurieren
- Custom Post Types einrichten

## 📊 Performance

### Optimierungen
- **ISR (Incremental Static Regeneration)** für dynamische Inhalte
- **Image Optimization** für WordPress-Medien
- **Caching** auf mehreren Ebenen
- **Bundle Optimization** durch Tree Shaking

### Monitoring
- Core Web Vitals Tracking
- WordPress API Response Times
- Cache Hit Rates

## 🔒 Sicherheit

### Implementiert
- **Webhook-Authentifizierung** mit Secrets
- **CORS-Konfiguration** für API-Zugriff
- **Environment-basierte Konfiguration**
- **Input-Validierung** in Formularen

### WordPress-Sicherheit
- Admin-Bereich IP-Whitelist
- 2FA für WordPress-Admin
- Security-Plugins (Wordfence)
- Regelmäßige Updates

## 🧪 Testing

```bash
# E2E Tests
pnpm test:e2e

# WordPress API testen
curl https://cms.kreditheld24.de/wp-json/wp/v2/posts

# Revalidation testen
curl "https://kreditheld24.de/api/revalidate?secret=ihr-secret&tag=wordpress"
```

## 📝 Content Management

### WordPress Admin
- **Posts**: Blog-Artikel und News
- **Pages**: Statische Seiten
- **Kreditarten**: Custom Post Type für Kreditprodukte
- **Services**: Custom Post Type für Dienstleistungen

### Content-Workflow
1. Content in WordPress erstellen/bearbeiten
2. Automatische Webhook-Benachrichtigung
3. Next.js Cache wird invalidiert
4. Neue Inhalte sind sofort live

## 🤝 Contributing

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Änderungen committen (`git commit -m 'Add amazing feature'`)
4. Branch pushen (`git push origin feature/amazing-feature`)
5. Pull Request erstellen

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

## 📞 Support

Bei Fragen oder Problemen:
- GitHub Issues erstellen
- E-Mail: support@kreditheld24.de

---

**Kreditheld24** - Ihr zuverlässiger Partner für Kreditvergleiche 🏦✨