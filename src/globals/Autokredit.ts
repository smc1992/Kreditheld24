import type { GlobalConfig } from 'payload'

export const Autokredit: GlobalConfig = {
  slug: 'autokredit',
  label: 'Autokredit Seite',
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
          defaultValue: 'Günstige Autofinanzierung ab 2,99%'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          required: true,
          defaultValue: 'Finanzieren Sie Ihr Traumauto zu Top-Konditionen. Neu- und Gebrauchtwagen, mit oder ohne Anzahlung.'
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
          defaultValue: 'Ihre Vorteile beim Autokredit'
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
      label: 'Autokredit-Rechner Sektion',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Autokredit-Rechner'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Berechnen Sie Ihre Autofinanzierung und vergleichen Sie die besten Angebote.'
        }
      ]
    },
    {
      name: 'process',
      type: 'group',
      label: 'Prozess Sektion',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'So funktioniert die Autofinanzierung'
        },
        {
          name: 'steps',
          type: 'array',
          label: 'Schritte',
          maxRows: 4,
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