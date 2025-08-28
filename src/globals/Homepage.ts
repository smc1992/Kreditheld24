import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Startseite',
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
          defaultValue: 'Ihr Kreditvergleich für beste Konditionen'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          required: true,
          defaultValue: 'Vergleichen Sie über 20 Banken und finden Sie den perfekten Kredit für Ihre Bedürfnisse. Kostenlos, unverbindlich und SCHUFA-neutral.'
        },
        {
          name: 'ctaText',
          type: 'text',
          label: 'Button Text',
          defaultValue: 'Jetzt Kredit vergleichen'
        }
      ]
    },
    {
      name: 'features',
      type: 'group',
      label: 'Vorteile Sektion',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Warum Kreditheld24?'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Profitieren Sie von unserer Expertise und finden Sie die besten Kreditkonditionen am Markt.'
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
          defaultValue: 'Kreditrechner'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Berechnen Sie Ihre individuellen Kreditkonditionen und vergleichen Sie die besten Angebote.'
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
          defaultValue: 'In nur 3 Schritten zu Ihrem Wunschkredit'
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
      name: 'cta',
      type: 'group',
      label: 'Call-to-Action Sektion',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Bereit für Ihren Wunschkredit?'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Starten Sie jetzt Ihren kostenlosen und unverbindlichen Kreditvergleich.'
        },
        {
          name: 'primaryButtonText',
          type: 'text',
          label: 'Primärer Button Text',
          defaultValue: 'Jetzt vergleichen'
        },
        {
          name: 'secondaryButtonText',
          type: 'text',
          label: 'Sekundärer Button Text',
          defaultValue: 'Beratung anfordern'
        }
      ]
    }
  ],
  admin: {
    group: 'Seiten Inhalte'
  }
}