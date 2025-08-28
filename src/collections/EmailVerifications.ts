import type { CollectionConfig } from 'payload'

export const EmailVerifications: CollectionConfig = {
  slug: 'email-verifications',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'verified', 'createdAt', 'expiresAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      index: true,
    },
    {
      name: 'token',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'formData',
      type: 'json',
      required: true,
    },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
      index: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      index: true,
    },
  ],
  timestamps: true,
}