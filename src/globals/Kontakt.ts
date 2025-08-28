import type { GlobalConfig } from 'payload'

export const Kontakt: GlobalConfig = {
  slug: 'kontakt',
  label: 'Kontakt Seite',
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Sektion',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Haupttitel',
          required: true,
          defaultValue: 'Kontakt'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          required: true,
          defaultValue: 'Haben Sie Fragen? Wir sind für Sie da und beraten Sie gerne persönlich.'
        }
      ]
    },
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Kontaktinformationen',
      fields: [
        {
          name: 'phone',
          type: 'text',
          label: 'Telefonnummer',
          defaultValue: '0800 123 456 789'
        },
        {
          name: 'email',
          type: 'email',
          label: 'E-Mail',
          defaultValue: 'info@kreditheld24.de'
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Adresse',
          defaultValue: 'Kreditheldenstraße 24\n10115 Berlin'
        },
        {
          name: 'openingHours',
          type: 'textarea',
          label: 'Öffnungszeiten',
          defaultValue: 'Mo-Fr: 8:00 - 18:00 Uhr\nSa: 9:00 - 14:00 Uhr'
        }
      ]
    },
    {
      name: 'form',
      type: 'group',
      label: 'Kontaktformular',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Schreiben Sie uns'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Nutzen Sie unser Kontaktformular für Ihre Anfrage. Wir melden uns schnellstmöglich bei Ihnen.'
        }
      ]
    },
    {
      name: 'alternatives',
      type: 'group',
      label: 'Alternative Kontaktmöglichkeiten',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Weitere Kontaktmöglichkeiten'
        },
        {
          name: 'items',
          type: 'array',
          label: 'Kontaktoptionen',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Titel',
              required: true
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Beschreibung',
              required: true
            },
            {
              name: 'icon',
              type: 'text',
              label: 'RemixIcon Klasse',
              required: true
            }
          ]
        }
      ]
    }
  ],
  admin: {
    group: 'Seiten Inhalte'
  }
}