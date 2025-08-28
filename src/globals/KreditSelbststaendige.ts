import type { GlobalConfig } from 'payload'

export const KreditSelbststaendige: GlobalConfig = {
  slug: 'kredit-selbststaendige',
  label: 'Kredit für Selbstständige Seite',
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
          defaultValue: 'Kredite für Selbstständige und Freiberufler'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          required: true,
          defaultValue: 'Maßgeschneiderte Finanzierungslösungen für Unternehmer, Freiberufler und Selbstständige.'
        }
      ]
    },
    {
      name: 'benefits',
      type: 'group',
      label: 'Vorteile Sektion',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Ihre Vorteile als Selbstständige'
        },
        {
          name: 'items',
          type: 'array',
          label: 'Vorteile',
          maxRows: 6,
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
    },
    {
      name: 'calculator',
      type: 'group',
      label: 'Kreditrechner Sektion',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Kreditrechner für Selbstständige'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Berechnen Sie Ihre individuellen Kreditkonditionen als Selbstständiger.'
        }
      ]
    },
    {
      name: 'requirements',
      type: 'group',
      label: 'Voraussetzungen Sektion',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Voraussetzungen für Selbstständige'
        },
        {
          name: 'items',
          type: 'array',
          label: 'Voraussetzungen',
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
            }
          ]
        }
      ]
    },
    {
      name: 'faq',
      type: 'group',
      label: 'FAQ Sektion',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Häufig gestellte Fragen'
        },
        {
          name: 'items',
          type: 'array',
          label: 'FAQ Einträge',
          fields: [
            {
              name: 'question',
              type: 'text',
              label: 'Frage',
              required: true
            },
            {
              name: 'answer',
              type: 'textarea',
              label: 'Antwort',
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