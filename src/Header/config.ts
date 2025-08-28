import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
          defaultValue: 'Kreditheld24',
        },
        {
          name: 'fontFamily',
          type: 'text',
          defaultValue: 'Pacifico, cursive',
        },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 10,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
      defaultValue: [
        {
          link: {
            type: 'custom',
            label: 'Ratenkredite',
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
            label: 'SCHUFA-neutral',
            url: '/schufa-neutral',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Selbstständige',
            url: '/kredit-selbststaendige',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Kreditarten',
            url: '/kreditarten',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Tipps',
            url: '/tipps-kreditaufnahme',
          },
        },
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
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
