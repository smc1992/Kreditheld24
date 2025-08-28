import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'company',
      type: 'group',
      label: 'Unternehmensinformationen',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Firmenname',
          defaultValue: 'Kreditheld24',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Beschreibung',
          defaultValue: 'Ihr unabhängiger Kreditvergleich für maßgeschneiderte Finanzierungslösungen zu Top-Konditionen.',
        },
        {
          name: 'fontFamily',
          type: 'text',
          label: 'Logo Schriftart',
          defaultValue: 'Pacifico, cursive',
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Kontaktinformationen',
      fields: [
        {
          name: 'address',
          type: 'textarea',
          label: 'Adresse',
          defaultValue: 'Kreditheldenstraße 24\n10115 Berlin',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefon',
          defaultValue: '030 / 123 456 789',
        },
        {
          name: 'email',
          type: 'email',
          label: 'E-Mail',
          defaultValue: 'info@kreditheld24.de',
        },
      ],
    },
    {
      name: 'kreditarten',
      type: 'array',
      label: 'Kreditarten Links',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
      },
      defaultValue: [
        {
          link: {
            type: 'custom',
            label: 'Ratenkredit',
            url: '/ratenkredite',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Autokredit',
            url: '/autokredit',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Umschuldung',
            url: '/umschuldung',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Sofortkredit',
            url: '/sofortkredit',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Kredit für Selbstständige',
            url: '/kredit-selbststaendige',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'SCHUFA-neutral',
            url: '/schufa-neutral',
          },
        },
      ],
    },
    {
      name: 'serviceLinks',
      type: 'array',
      label: 'Service Links',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
      },
      defaultValue: [
        {
          link: {
            type: 'custom',
            label: 'Über uns',
            url: '/ueber-uns',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Kontakt',
            url: '/kontakt',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'FAQ',
            url: '/faq',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Blog',
            url: '/blog',
          },
        },
      ],
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Rechtliche Links',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 5,
      admin: {
        initCollapsed: true,
      },
      defaultValue: [
        {
          link: {
            type: 'custom',
            label: 'Impressum',
            url: '/impressum',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Datenschutz',
            url: '/datenschutz',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'AGB',
            url: '/agb',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Cookie-Einstellungen',
            url: '/cookie-einstellungen',
          },
        },
      ],
    },
    {
      name: 'socialMedia',
      type: 'array',
      label: 'Social Media Links',
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: 'Plattform',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter', value: 'twitter' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
          ],
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
        },
      ],
      maxRows: 5,
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright Text',
      defaultValue: '© 2025 Kreditheld24. Alle Rechte vorbehalten.',
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
