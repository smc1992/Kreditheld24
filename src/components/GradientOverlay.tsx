'use client'
import React from 'react'

interface GradientOverlayProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'hero' | 'cta' | 'subtle'
  direction?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl'
  opacity?: 'light' | 'medium' | 'strong'
  className?: string
  children?: React.ReactNode
}

const gradientVariants = {
  primary: {
    'to-r': 'bg-gradient-to-r from-green-600 via-green-500 to-green-400',
    'to-l': 'bg-gradient-to-l from-green-600 via-green-500 to-green-400',
    'to-t': 'bg-gradient-to-t from-green-600 via-green-500 to-green-400',
    'to-b': 'bg-gradient-to-b from-green-600 via-green-500 to-green-400',
    'to-br': 'bg-gradient-to-br from-green-600 via-green-500 to-green-400',
    'to-bl': 'bg-gradient-to-bl from-green-600 via-green-500 to-green-400',
    'to-tr': 'bg-gradient-to-tr from-green-600 via-green-500 to-green-400',
    'to-tl': 'bg-gradient-to-tl from-green-600 via-green-500 to-green-400',
  },
  secondary: {
    'to-r': 'bg-gradient-to-r from-green-50 via-green-100 to-white',
    'to-l': 'bg-gradient-to-l from-green-50 via-green-100 to-white',
    'to-t': 'bg-gradient-to-t from-green-50 via-green-100 to-white',
    'to-b': 'bg-gradient-to-b from-green-50 via-green-100 to-white',
    'to-br': 'bg-gradient-to-br from-green-50 via-green-100 to-white',
    'to-bl': 'bg-gradient-to-bl from-green-50 via-green-100 to-white',
    'to-tr': 'bg-gradient-to-tr from-green-50 via-green-100 to-white',
    'to-tl': 'bg-gradient-to-tl from-green-50 via-green-100 to-white',
  },
  accent: {
    'to-r': 'bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400',
    'to-l': 'bg-gradient-to-l from-green-600 via-emerald-500 to-teal-400',
    'to-t': 'bg-gradient-to-t from-green-600 via-emerald-500 to-teal-400',
    'to-b': 'bg-gradient-to-b from-green-600 via-emerald-500 to-teal-400',
    'to-br': 'bg-gradient-to-br from-green-600 via-emerald-500 to-teal-400',
    'to-bl': 'bg-gradient-to-bl from-green-600 via-emerald-500 to-teal-400',
    'to-tr': 'bg-gradient-to-tr from-green-600 via-emerald-500 to-teal-400',
    'to-tl': 'bg-gradient-to-tl from-green-600 via-emerald-500 to-teal-400',
  },
  hero: {
    'to-r': 'bg-gradient-to-r from-green-700 via-green-600 to-green-500',
    'to-l': 'bg-gradient-to-l from-green-700 via-green-600 to-green-500',
    'to-t': 'bg-gradient-to-t from-green-700 via-green-600 to-green-500',
    'to-b': 'bg-gradient-to-b from-green-700 via-green-600 to-green-500',
    'to-br': 'bg-gradient-to-br from-green-700 via-green-600 to-green-500',
    'to-bl': 'bg-gradient-to-bl from-green-700 via-green-600 to-green-500',
    'to-tr': 'bg-gradient-to-tr from-green-700 via-green-600 to-green-500',
    'to-tl': 'bg-gradient-to-tl from-green-700 via-green-600 to-green-500',
  },
  cta: {
    'to-r': 'bg-gradient-to-r from-green-500 via-green-400 to-emerald-400',
    'to-l': 'bg-gradient-to-l from-green-500 via-green-400 to-emerald-400',
    'to-t': 'bg-gradient-to-t from-green-500 via-green-400 to-emerald-400',
    'to-b': 'bg-gradient-to-b from-green-500 via-green-400 to-emerald-400',
    'to-br': 'bg-gradient-to-br from-green-500 via-green-400 to-emerald-400',
    'to-bl': 'bg-gradient-to-bl from-green-500 via-green-400 to-emerald-400',
    'to-tr': 'bg-gradient-to-tr from-green-500 via-green-400 to-emerald-400',
    'to-tl': 'bg-gradient-to-tl from-green-500 via-green-400 to-emerald-400',
  },
  subtle: {
    'to-r': 'bg-gradient-to-r from-gray-50 via-green-50 to-white',
    'to-l': 'bg-gradient-to-l from-gray-50 via-green-50 to-white',
    'to-t': 'bg-gradient-to-t from-gray-50 via-green-50 to-white',
    'to-b': 'bg-gradient-to-b from-gray-50 via-green-50 to-white',
    'to-br': 'bg-gradient-to-br from-gray-50 via-green-50 to-white',
    'to-bl': 'bg-gradient-to-bl from-gray-50 via-green-50 to-white',
    'to-tr': 'bg-gradient-to-tr from-gray-50 via-green-50 to-white',
    'to-tl': 'bg-gradient-to-tl from-gray-50 via-green-50 to-white',
  },
}

const opacityClasses = {
  light: 'opacity-60',
  medium: 'opacity-80',
  strong: 'opacity-95'
}

export default function GradientOverlay({
  variant = 'primary',
  direction = 'to-r',
  opacity = 'medium',
  className = '',
  children
}: GradientOverlayProps) {
  const gradientClass = gradientVariants[variant][direction]
  const opacityClass = opacityClasses[opacity]
  
  return (
    <div className={`relative ${className}`}>
      <div className={`absolute inset-0 ${gradientClass} ${opacityClass}`} />
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  )
}

// Dark Mode Gradient Overlays
export function DarkGradientOverlay({
  variant = 'primary',
  direction = 'to-r',
  opacity = 'medium',
  className = '',
  children
}: GradientOverlayProps) {
  const darkGradientVariants = {
    primary: {
      'to-r': 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700',
      'to-l': 'bg-gradient-to-l from-gray-900 via-gray-800 to-gray-700',
      'to-t': 'bg-gradient-to-t from-gray-900 via-gray-800 to-gray-700',
      'to-b': 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700',
      'to-br': 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700',
      'to-bl': 'bg-gradient-to-bl from-gray-900 via-gray-800 to-gray-700',
      'to-tr': 'bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700',
      'to-tl': 'bg-gradient-to-tl from-gray-900 via-gray-800 to-gray-700',
    },
    secondary: {
      'to-r': 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600',
      'to-l': 'bg-gradient-to-l from-gray-800 via-gray-700 to-gray-600',
      'to-t': 'bg-gradient-to-t from-gray-800 via-gray-700 to-gray-600',
      'to-b': 'bg-gradient-to-b from-gray-800 via-gray-700 to-gray-600',
      'to-br': 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600',
      'to-bl': 'bg-gradient-to-bl from-gray-800 via-gray-700 to-gray-600',
      'to-tr': 'bg-gradient-to-tr from-gray-800 via-gray-700 to-gray-600',
      'to-tl': 'bg-gradient-to-tl from-gray-800 via-gray-700 to-gray-600',
    },
    accent: {
      'to-r': 'bg-gradient-to-r from-green-900 via-green-800 to-emerald-700',
      'to-l': 'bg-gradient-to-l from-green-900 via-green-800 to-emerald-700',
      'to-t': 'bg-gradient-to-t from-green-900 via-green-800 to-emerald-700',
      'to-b': 'bg-gradient-to-b from-green-900 via-green-800 to-emerald-700',
      'to-br': 'bg-gradient-to-br from-green-900 via-green-800 to-emerald-700',
      'to-bl': 'bg-gradient-to-bl from-green-900 via-green-800 to-emerald-700',
      'to-tr': 'bg-gradient-to-tr from-green-900 via-green-800 to-emerald-700',
      'to-tl': 'bg-gradient-to-tl from-green-900 via-green-800 to-emerald-700',
    },
    hero: {
      'to-r': 'bg-gradient-to-r from-gray-900 via-green-900 to-gray-800',
      'to-l': 'bg-gradient-to-l from-gray-900 via-green-900 to-gray-800',
      'to-t': 'bg-gradient-to-t from-gray-900 via-green-900 to-gray-800',
      'to-b': 'bg-gradient-to-b from-gray-900 via-green-900 to-gray-800',
      'to-br': 'bg-gradient-to-br from-gray-900 via-green-900 to-gray-800',
      'to-bl': 'bg-gradient-to-bl from-gray-900 via-green-900 to-gray-800',
      'to-tr': 'bg-gradient-to-tr from-gray-900 via-green-900 to-gray-800',
      'to-tl': 'bg-gradient-to-tl from-gray-900 via-green-900 to-gray-800',
    },
    cta: {
      'to-r': 'bg-gradient-to-r from-green-700 via-green-600 to-emerald-600',
      'to-l': 'bg-gradient-to-l from-green-700 via-green-600 to-emerald-600',
      'to-t': 'bg-gradient-to-t from-green-700 via-green-600 to-emerald-600',
      'to-b': 'bg-gradient-to-b from-green-700 via-green-600 to-emerald-600',
      'to-br': 'bg-gradient-to-br from-green-700 via-green-600 to-emerald-600',
      'to-bl': 'bg-gradient-to-bl from-green-700 via-green-600 to-emerald-600',
      'to-tr': 'bg-gradient-to-tr from-green-700 via-green-600 to-emerald-600',
      'to-tl': 'bg-gradient-to-tl from-green-700 via-green-600 to-emerald-600',
    },
    subtle: {
      'to-r': 'bg-gradient-to-r from-gray-800 via-gray-750 to-gray-700',
      'to-l': 'bg-gradient-to-l from-gray-800 via-gray-750 to-gray-700',
      'to-t': 'bg-gradient-to-t from-gray-800 via-gray-750 to-gray-700',
      'to-b': 'bg-gradient-to-b from-gray-800 via-gray-750 to-gray-700',
      'to-br': 'bg-gradient-to-br from-gray-800 via-gray-750 to-gray-700',
      'to-bl': 'bg-gradient-to-bl from-gray-800 via-gray-750 to-gray-700',
      'to-tr': 'bg-gradient-to-tr from-gray-800 via-gray-750 to-gray-700',
      'to-tl': 'bg-gradient-to-tl from-gray-800 via-gray-750 to-gray-700',
    },
  }
  
  const gradientClass = darkGradientVariants[variant][direction]
  const opacityClass = opacityClasses[opacity]
  
  return (
    <div className={`relative ${className}`}>
      <div className={`absolute inset-0 dark:block hidden ${gradientClass} ${opacityClass}`} />
      <div className={`absolute inset-0 dark:hidden block ${gradientVariants[variant][direction]} ${opacityClass}`} />
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  )
}

// Animated Gradient Component
export function AnimatedGradient({
  variant = 'primary',
  className = '',
  children
}: {
  variant?: 'primary' | 'accent' | 'hero'
  className?: string
  children?: React.ReactNode
}) {
  const animatedVariants = {
    primary: 'bg-gradient-to-r from-green-600 via-green-500 to-green-400 bg-[length:200%_200%] animate-gradient-x',
    accent: 'bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 bg-[length:200%_200%] animate-gradient-x',
    hero: 'bg-gradient-to-r from-green-700 via-green-600 to-green-500 bg-[length:200%_200%] animate-gradient-x'
  }
  
  return (
    <div className={`relative ${className}`}>
      <div className={`absolute inset-0 ${animatedVariants[variant]}`} />
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  )
}