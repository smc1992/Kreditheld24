const { getPayload } = require('payload')
const config = require('./dist/payload.config.js')

require('dotenv').config()

const start = async () => {
  const payload = await getPayload({ config })

  try {
    // Create footer global with default data
    await payload.updateGlobal({
      slug: 'footer',
      data: {
        company: {
          name: 'Kreditheld24',
          description: 'Ihr unabhängiger Kreditvergleich für maßgeschneiderte Finanzierungslösungen zu Top-Konditionen.',
          fontFamily: 'Pacifico, cursive',
        },
        contact: {
          address: 'Glücksburger Str. 13\n49477 Ibbenbüren',
          phone: '0251. 149 142 77',
          email: 'info@kreditheld24.de',
        },
        kreditarten: [
          {
            link: {
              type: 'custom',
              label: 'Ratenkredit',
              url: '/ratenkredite',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Autokredit',
              url: '/autokredit',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Umschuldung',
              url: '/umschuldung',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Sofortkredit',
              url: '/sofortkredit',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'SCHUFA-neutral',
              url: '/schufa-neutral',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Kredit für Selbstständige',
              url: '/kredit-selbststaendige',
            },
          },
        ],
        serviceLinks: [
          {
            link: {
              type: 'custom',
              label: 'Über uns',
              url: '/ueber-uns',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Kontakt',
              url: '/kontakt',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Kreditarten',
              url: '/kreditarten',
            },
          },
        ],
        legalLinks: [
          {
            link: {
              type: 'custom',
              label: 'Impressum',
              url: '/impressum',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Datenschutz',
              url: '/datenschutz',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'AGB',
              url: '/agb',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Cookie-Einstellungen',
              url: '/cookie-einstellungen',
            },
          },
        ],
        socialMedia: [
          {
            platform: 'facebook',
            url: 'https://facebook.com/kreditheld24',
          },
          {
            platform: 'instagram',
            url: 'https://instagram.com/kreditheld24',
          },
          {
            platform: 'linkedin',
            url: 'https://linkedin.com/company/kreditheld24',
          },
        ],
        copyright: '© 2025 Kreditheld24. Alle Rechte vorbehalten.',
      },
    })

    console.log('Footer initialized successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error initializing footer:', error)
    process.exit(1)
  }
}

start()