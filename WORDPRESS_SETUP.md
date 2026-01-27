# WordPress Headless CMS Setup für Kreditheld24

Diese Anleitung führt Sie durch die Einrichtung von WordPress als Headless CMS für Ihre Kreditheld24-Website.

## 🎯 Übersicht

Ihr neues Setup besteht aus:
- **Frontend**: Next.js (diese Anwendung)
- **Backend/CMS**: WordPress (Headless)
- **API**: WordPress REST API + WPGraphQL
- **Hosting**: WordPress auf Subdomain (z.B. `cms.kreditheld24.de`)

## 📋 Voraussetzungen

### WordPress Installation
1. **WordPress 6.0+** auf Ihrer Subdomain installieren
2. **PHP 8.0+** und **MySQL 5.7+**
3. **SSL-Zertifikat** für die Subdomain

### Erforderliche WordPress Plugins

#### 1. WPGraphQL (Empfohlen)
```bash
# Installation über WordPress Admin:
# Plugins > Neu hinzufügen > "WPGraphQL" suchen
# Installieren und aktivieren
```

**Oder verwenden Sie die WordPress REST API (bereits integriert)**

#### 2. Zusätzliche empfohlene Plugins
- **Advanced Custom Fields (ACF)** - für benutzerdefinierte Felder
- **WP Webhooks** - für automatische Revalidierung
- **Yoast SEO** - für SEO-Optimierung
- **WP REST API Cache** - für bessere Performance

## 🔧 WordPress Konfiguration

### 1. Permalinks aktivieren
1. Gehen Sie zu `Einstellungen > Permalinks`
2. Wählen Sie "Beitragsname" oder eine andere Option (nicht "Einfach")
3. Speichern Sie die Änderungen

### 2. REST API testen
Besuchen Sie: `https://cms.kreditheld24.de/wp-json/wp/v2/posts`

Sie sollten JSON-Daten sehen.

### 3. CORS konfigurieren (falls nötig)
Fügen Sie zu Ihrer `wp-config.php` hinzu:
```php
// CORS Headers für Headless WordPress
header('Access-Control-Allow-Origin: https://kreditheld24.de');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

## 🏗️ Custom Post Types erstellen

### Kreditarten Post Type
Fügen Sie zu Ihrer `functions.php` hinzu:

```php
// Kreditarten Custom Post Type
function create_kreditarten_post_type() {
    register_post_type('kreditarten',
        array(
            'labels' => array(
                'name' => 'Kreditarten',
                'singular_name' => 'Kreditart'
            ),
            'public' => true,
            'show_in_rest' => true, // Wichtig für REST API
            'rest_base' => 'kreditarten',
            'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
            'menu_icon' => 'dashicons-money-alt'
        )
    );
}
add_action('init', 'create_kreditarten_post_type');

// Services Custom Post Type
function create_services_post_type() {
    register_post_type('services',
        array(
            'labels' => array(
                'name' => 'Services',
                'singular_name' => 'Service'
            ),
            'public' => true,
            'show_in_rest' => true,
            'rest_base' => 'services',
            'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
            'menu_icon' => 'dashicons-admin-tools'
        )
    );
}
add_action('init', 'create_services_post_type');
```

### Custom Fields mit ACF

#### Für Kreditarten:
- `zinssatz_von` (Zahl)
- `zinssatz_bis` (Zahl)
- `laufzeit_min` (Zahl)
- `laufzeit_max` (Zahl)
- `kreditsumme_min` (Zahl)
- `kreditsumme_max` (Zahl)
- `besonderheiten` (Repeater)
- `voraussetzungen` (Repeater)

#### Für Services:
- `service_icon` (Text)
- `service_features` (Repeater)
- `service_benefits` (Repeater)

## 🔄 Webhook Setup für automatische Revalidierung

### 1. WP Webhooks Plugin konfigurieren
1. Installieren Sie "WP Webhooks"
2. Gehen Sie zu `Einstellungen > WP Webhooks`
3. Erstellen Sie einen neuen Webhook:
   - **URL**: `https://kreditheld24.de/api/revalidate`
   - **Trigger**: Post Updated, Post Published, Post Deleted
   - **Authorization**: `Bearer your-webhook-secret`

### 2. Webhook-Payload konfigurieren
```json
{
  "post_type": "%post_type%",
  "post_id": "%post_id%",
  "action": "%action%",
  "slug": "%post_name%"
}
```

## 🌐 Environment Variables

Erstellen Sie eine `.env.local` Datei:

```env
# WordPress Configuration
WORDPRESS_URL=https://cms.kreditheld24.de
NEXT_PUBLIC_WORDPRESS_URL=https://cms.kreditheld24.de
WORDPRESS_HOSTNAME=cms.kreditheld24.de

# Webhook Security
WORDPRESS_WEBHOOK_SECRET=ihr-sicherer-webhook-schlüssel
REVALIDATE_SECRET=ihr-revalidate-secret

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://kreditheld24.de
```

## 🚀 Deployment

### 1. WordPress auf Subdomain
1. Erstellen Sie die Subdomain `cms.kreditheld24.de`
2. Installieren Sie WordPress
3. Konfigurieren Sie SSL
4. Installieren Sie die erforderlichen Plugins

### 2. Next.js Frontend
1. Aktualisieren Sie die Environment Variables
2. Testen Sie die WordPress-Verbindung
3. Deployen Sie die Anwendung

## 🧪 Testing

### WordPress API testen
```bash
# Posts abrufen
curl https://cms.kreditheld24.de/wp-json/wp/v2/posts

# Kreditarten abrufen
curl https://cms.kreditheld24.de/wp-json/wp/v2/kreditarten

# Einzelne Seite abrufen
curl https://cms.kreditheld24.de/wp-json/wp/v2/pages?slug=impressum
```

### Revalidation testen
```bash
# Manueller Cache-Reset
curl "https://kreditheld24.de/api/revalidate?secret=ihr-secret&tag=wordpress"
```

## 📝 Content Migration

### Bestehende Inhalte migrieren
1. **Statische Seiten** → WordPress Pages
2. **Kreditarten-Informationen** → Custom Post Type "Kreditarten"
3. **Service-Informationen** → Custom Post Type "Services"
4. **Blog-Inhalte** → WordPress Posts

### Migration-Script (optional)
```php
// WordPress Migration Script
// Fügen Sie dies zu functions.php hinzu und rufen Sie es einmalig auf

function migrate_kreditheld_content() {
    // Beispiel: Kreditart erstellen
    $kreditart = array(
        'post_title' => 'Ratenkredit',
        'post_content' => 'Beschreibung des Ratenkredits...',
        'post_status' => 'publish',
        'post_type' => 'kreditarten'
    );
    
    $post_id = wp_insert_post($kreditart);
    
    // Custom Fields hinzufügen
    update_field('zinssatz_von', '2.5', $post_id);
    update_field('zinssatz_bis', '12.9', $post_id);
    // ... weitere Felder
}
```

## 🔒 Sicherheit

### WordPress absichern
1. **Admin-Bereich schützen** (IP-Whitelist)
2. **Starke Passwörter** verwenden
3. **2FA aktivieren**
4. **Regelmäßige Updates**
5. **Security-Plugin** installieren (z.B. Wordfence)

### API-Sicherheit
1. **Rate Limiting** konfigurieren
2. **CORS richtig einstellen**
3. **Webhook-Secrets** verwenden
4. **HTTPS erzwingen**

## 📊 Performance

### WordPress optimieren
1. **Caching-Plugin** (z.B. WP Rocket)
2. **CDN** für Medien
3. **Bildoptimierung**
4. **Database-Cleanup**

### Next.js optimieren
1. **ISR** für dynamische Inhalte
2. **Image Optimization**
3. **Bundle Analyzer**
4. **Core Web Vitals** überwachen

## 🆘 Troubleshooting

### Häufige Probleme

#### WordPress API nicht erreichbar
```bash
# Permalinks neu speichern
# WordPress Admin > Einstellungen > Permalinks > Speichern
```

#### CORS-Fehler
```php
// In wp-config.php hinzufügen
header('Access-Control-Allow-Origin: *');
```

#### Webhook funktioniert nicht
1. Webhook-URL prüfen
2. Authorization Header prüfen
3. WordPress-Logs überprüfen

## 📞 Support

Bei Problemen:
1. WordPress-Logs überprüfen
2. Next.js-Logs überprüfen
3. Browser-Konsole überprüfen
4. API-Endpunkte direkt testen

---

**Nächste Schritte:**
1. WordPress auf Subdomain installieren
2. Plugins installieren und konfigurieren
3. Custom Post Types erstellen
4. Environment Variables setzen
5. Content migrieren
6. Testing und Go-Live