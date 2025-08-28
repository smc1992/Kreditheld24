import type { GlobalConfig } from 'payload'

export const Sofortkredit: GlobalConfig = {
  slug: 'sofortkredit',
  label: 'Sofortkredit Seite',
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
          defaultValue: 'Sofortkredit mit Auszahlung in 24 Stunden'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          required: true,
          defaultValue: 'Schnelle und unkomplizierte Finanzierung für dringende Vorhaben. 100% online, minimaler Aufwand, maximale Flexibilität.'
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
          defaultValue: 'Ihre Vorteile beim Sofortkredit'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Profitieren Sie von unserer schnellen und unkomplizierten Online-Kreditabwicklung.'
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
      label: 'Sofortkredit-Rechner Sektion',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Sofortkredit-Rechner'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Berechnen Sie Ihre individuellen Kreditkonditionen und erhalten Sie sofort eine Entscheidung.'
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
          defaultValue: 'So einfach geht\'s'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'In nur 4 einfachen Schritten zu Ihrem Sofortkredit - schnell, sicher und unkompliziert.'
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
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Antworten auf die wichtigsten Fragen rund um Ihren Sofortkredit.'
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