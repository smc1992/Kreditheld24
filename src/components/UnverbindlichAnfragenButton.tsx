'use client'
import React from 'react'
import Link from 'next/link'

interface UnverbindlichAnfragenButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullWidth?: boolean
}

export default function UnverbindlichAnfragenButton({ 
  variant = 'secondary', 
  size = 'md',
  className = '',
  fullWidth = false
}: UnverbindlichAnfragenButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-primary to-green-500 hover:from-green-500 hover:to-primary text-white border-transparent shadow-lg hover:shadow-xl'
      case 'secondary':
        return 'bg-white hover:bg-primary text-primary hover:text-white border-primary shadow-md hover:shadow-lg'
      case 'outline':
        return 'bg-transparent hover:bg-primary text-primary hover:text-white border-primary border-2'
      default:
        return 'bg-white hover:bg-primary text-primary hover:text-white border-primary shadow-md hover:shadow-lg'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm'
      case 'md':
        return 'px-6 py-3 text-base'
      case 'lg':
        return 'px-8 py-4 text-lg'
      default:
        return 'px-6 py-3 text-base'
    }
  }

  const buttonClasses = `
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${fullWidth ? 'w-full' : ''}
    font-semibold rounded-button transition-all duration-300 ease-in-out
    transform hover:-translate-y-1 hover:scale-105 active:scale-95
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
    inline-flex items-center justify-center gap-2 group
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <Link href="/kreditanfrage" className="inline-block">
      <button className={buttonClasses}>
        <svg 
          className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
          />
        </svg>
        <span className="font-medium tracking-wide">Unverbindlich anfragen</span>
        <svg 
          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </button>
    </Link>
  )
}

// Zusätzliche Varianten für spezielle Anwendungsfälle
export function UnverbindlichAnfragenButtonPrimary(props: Omit<UnverbindlichAnfragenButtonProps, 'variant'>) {
  return <UnverbindlichAnfragenButton {...props} variant="primary" />
}

export function UnverbindlichAnfragenButtonSecondary(props: Omit<UnverbindlichAnfragenButtonProps, 'variant'>) {
  return <UnverbindlichAnfragenButton {...props} variant="secondary" />
}

export function UnverbindlichAnfragenButtonOutline(props: Omit<UnverbindlichAnfragenButtonProps, 'variant'>) {
  return <UnverbindlichAnfragenButton {...props} variant="outline" />
}