import type { GlobalConfig } from 'payload'

export const UeberUns: GlobalConfig = {
  slug: 'ueber-uns',
  label: 'Über uns Seite',
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
          defaultValue: 'Ihr vertrauenswürdiger Partner für Finanzlösungen'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          required: true,
          defaultValue: 'Seit über 10 Jahren unterstützen wir Menschen dabei, ihre finanziellen Ziele zu erreichen. Mit Expertise, Transparenz und persönlicher Beratung stehen wir Ihnen zur Seite.'
        }
      ]
    },
    {
      name: 'mission',
      type: 'group',
      label: 'Mission & Vision Sektion',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Unsere Mission & Vision'
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Beschreibung',
          defaultValue: 'Wir bei Kreditheld24 glauben daran, dass jeder Mensch Zugang zu fairen und transparenten Finanzierungslösungen haben sollte. Unsere Mission ist es, den Kreditvergleich so einfach und verständlich wie möglich zu gestalten.'
        },
        {
          name: 'values',
          type: 'array',
          label: 'Werte',
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
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Unsere Erfolgsgeschichte spricht für sich - vertrauen Sie auf unsere Erfahrung und Expertise.'
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
      name: 'team',
      type: 'group',
      label: 'Team Sektion',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Unser Team'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Lernen Sie die Menschen hinter Kreditheld24 kennen - Experten mit Leidenschaft für Finanzlösungen.'
        },
        {
          name: 'members',
          type: 'array',
          label: 'Team Mitglieder',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Name',
              required: true
            },
            {
              name: 'position',
              type: 'text',
              label: 'Position',
              required: true
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Beschreibung',
              required: true
            },
            {
              name: 'image',
              type: 'text',
              label: 'Bild URL',
              required: true
            }
          ]
        }
      ]
    },
    {
      name: 'history',
      type: 'group',
      label: 'Geschichte Sektion',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Unsere Geschichte'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Von der Gründung bis heute - eine Erfolgsgeschichte basierend auf Vertrauen und Kompetenz.'
        },
        {
          name: 'milestones',
          type: 'array',
          label: 'Meilensteine',
          fields: [
            {
              name: 'year',
              type: 'text',
              label: 'Jahr',
              required: true
            },
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
      name: 'contact',
      type: 'group',
      label: 'Kontakt Sektion',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          defaultValue: 'Kontaktieren Sie uns'
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Untertitel',
          defaultValue: 'Haben Sie Fragen oder möchten Sie mehr über unsere Dienstleistungen erfahren? Wir sind gerne für Sie da.'
        }
      ]
    }
  ],
  admin: {
    group: 'Seiten Inhalte'
  }
}