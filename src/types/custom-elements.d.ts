import type React from 'react'

declare namespace JSX {
  interface IntrinsicElements {
    'baufi-passt-flex': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      'frontend-key-id'?: string
      datenkontext?: string
    }
  }
}