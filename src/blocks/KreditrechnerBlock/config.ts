import type { Block } from 'payload'

export const KreditrechnerBlock: Block = {
  slug: 'kreditrechner',
  labels: {
    singular: 'Kreditrechner Block',
    plural: 'Kreditrechner Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Kreditrechner',
    },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Berechnen Sie Ihre monatliche Rate',
    },
    {
      name: 'kreditart',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Ratenkredit',
          value: 'ratenkredit',
        },
        {
          label: 'Autokredit',
          value: 'autokredit',
        },
        {
          label: 'Umschuldung',
          value: 'umschuldung',
        },
      ],
      defaultValue: 'ratenkredit',
    },
    {
      name: 'minBetrag',
      type: 'number',
      required: true,
      defaultValue: 3000,
      admin: {
        description: 'Minimaler Kreditbetrag in Euro',
      },
    },
    {
      name: 'maxBetrag',
      type: 'number',
      required: true,
      defaultValue: 120000,
      admin: {
        description: 'Maximaler Kreditbetrag in Euro',
      },
    },
    {
      name: 'defaultBetrag',
      type: 'number',
      required: true,
      defaultValue: 20000,
      admin: {
        description: 'Standard-Kreditbetrag in Euro',
      },
    },
    {
      name: 'minLaufzeit',
      type: 'number',
      required: true,
      defaultValue: 12,
      admin: {
        description: 'Minimale Laufzeit in Monaten',
      },
    },
    {
      name: 'maxLaufzeit',
      type: 'number',
      required: true,
      defaultValue: 120,
      admin: {
        description: 'Maximale Laufzeit in Monaten',
      },
    },
    {
      name: 'defaultLaufzeit',
      type: 'number',
      required: true,
      defaultValue: 48,
      admin: {
        description: 'Standard-Laufzeit in Monaten',
      },
    },
    {
      name: 'zinssatz',
      type: 'number',
      required: true,
      defaultValue: 3.99,
      admin: {
        description: 'Effektiver Jahreszins in Prozent',
      },
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'Kredit beantragen',
    },
    {
      name: 'buttonLink',
      type: 'text',
      defaultValue: '/kontakt',
    },
  ],
}