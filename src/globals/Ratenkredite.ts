import type { GlobalConfig } from 'payload'

export const Ratenkredite: GlobalConfig = {
  slug: 'ratenkredite',
  label: 'Ratenkredite Seite',
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
          defaultValue: 'Günstige Ratenkredite ab 1.000 €'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          required: true,
          defaultValue: 'Flexible Finanzierung für alle Ihre Wünsche. Vergleichen Sie jetzt die besten Konditionen von über 20 Banken.'
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
          defaultValue: 'Ihre Vorteile beim Ratenkredit'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Profitieren Sie von fairen Konditionen und flexiblen Laufzeiten.'
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
          defaultValue: 'Ratenkredit-Rechner'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Berechnen Sie Ihre monatliche Rate und finden Sie den passenden Ratenkredit.'
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
          defaultValue: 'Antworten auf die wichtigsten Fragen rund um Ratenkredite.'
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
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Call-to-Action Sektion',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Bereit für Ihren Ratenkredit?'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Vergleichen Sie jetzt kostenlos die besten Angebote und sparen Sie bares Geld.'
        }
      ]
    }
  ],
  admin: {
    group: 'Seiten Inhalte'
  }
}