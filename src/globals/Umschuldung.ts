import type { GlobalConfig } from 'payload'

export const Umschuldung: GlobalConfig = {
  slug: 'umschuldung',
  label: 'Umschuldung Seite',
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
          defaultValue: 'Umschuldung – Kredite zusammenfassen und sparen'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          required: true,
          defaultValue: 'Fassen Sie mehrere Kredite zu einem zusammen und profitieren Sie von niedrigeren Zinsen und einer besseren Übersicht.'
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
          defaultValue: 'Ihre Vorteile bei der Umschuldung'
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
      label: 'Umschuldungsrechner Sektion',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Umschuldungsrechner'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Berechnen Sie Ihr Einsparpotenzial bei einer Umschuldung.'
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