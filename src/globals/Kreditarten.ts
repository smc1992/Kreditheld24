import type { GlobalConfig } from 'payload'

export const Kreditarten: GlobalConfig = {
  slug: 'kreditarten',
  label: 'Kreditarten Übersicht Seite',
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
          defaultValue: 'Alle Kreditarten im Überblick'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          required: true,
          defaultValue: 'Finden Sie den passenden Kredit für Ihre Bedürfnisse. Von Ratenkredit bis Baufinanzierung.'
        }
      ]
    },
    {
      name: 'creditTypes',
      type: 'group',
      label: 'Kreditarten Sektion',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Unsere Kreditarten'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Wählen Sie aus verschiedenen Kreditarten die passende Finanzierung für Ihr Vorhaben.'
        },
        {
          name: 'items',
          type: 'array',
          label: 'Kreditarten',
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
              name: 'features',
              type: 'array',
              label: 'Features',
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                  label: 'Feature',
                  required: true
                }
              ]
            },
            {
              name: 'icon',
              type: 'text',
              label: 'RemixIcon Klasse',
              required: true
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link zur Detailseite',
              required: true
            }
          ]
        }
      ]
    },
    {
      name: 'statistics',
      type: 'group',
      label: 'Statistiken Sektion',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Kreditheld24 in Zahlen'
        },
        {
          name: 'items',
          type: 'array',
          label: 'Statistiken',
          maxRows: 4,
          fields: [
            {
              name: 'number',
              type: 'text',
              label: 'Zahl',
              required: true
            },
            {
              name: 'description',
              type: 'text',
              label: 'Beschreibung',
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
          defaultValue: 'Bereit für Ihren Kredit?'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Starten Sie jetzt Ihren kostenlosen Kreditvergleich und finden Sie die besten Konditionen.'
        }
      ]
    }
  ],
  admin: {
    group: 'Seiten Inhalte'
  }
}