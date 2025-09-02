'use client'
import React, { useState, useEffect } from 'react'
import { Header } from '@/components/Header'

interface StickyHeaderProps {
  threshold?: number
  className?: string
}

export default function StickyHeader({ threshold = 100, className = '' }: StickyHeaderProps) {
  const [isSticky, setIsSticky] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Bestimme ob Header sticky werden soll
      if (currentScrollY > threshold) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
      
      // Bestimme Sichtbarkeit basierend auf Scroll-Richtung
      if (currentScrollY > lastScrollY && currentScrollY > threshold) {
        // Scrolling down - hide header
        setIsVisible(false)
      } else {
        // Scrolling up - show header
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    // Throttle scroll events for better performance
    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [lastScrollY, threshold])

  return (
    <div
      className={`
        ${isSticky ? 'fixed top-0 left-0 right-0 z-50' : 'relative'}
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        transition-all duration-300 ease-in-out
        ${isSticky ? 'shadow-lg backdrop-blur-sm bg-white/95' : ''}
        ${className}
      `}
    >
      <Header />
    </div>
  )
}

// Hook für Sticky Header Funktionalität
export function useStickyHeader(threshold: number = 100) {
  const [isSticky, setIsSticky] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      setIsSticky(currentScrollY > threshold)
      
      if (currentScrollY > lastScrollY && currentScrollY > threshold) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [lastScrollY, threshold])

  return { isSticky, isVisible }
}

// Alternative: Einfacher Sticky Header ohne Hide/Show
export function SimpleStickyHeader({ threshold = 100, className = '' }: StickyHeaderProps) {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  return (
    <div
      className={`
        ${isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-lg backdrop-blur-sm bg-white/95' : 'relative'}
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      <Header />
    </div>
  )
}