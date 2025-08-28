'use client'

import React, { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Separate main nav items from credit types and service items
  const serviceItems = ['Tipps']
  const creditTypeItems = ['Ratenkredite', 'Autokredit', 'Umschuldung', 'Sofortkredit', 'SCHUFA-neutral', 'Selbstständige']
  
  const mainNavItems = navItems.filter(({ link }) => 
    ![...creditTypeItems, ...serviceItems].includes(link?.label || '')
  )
  
  const creditTypes = navItems.filter(({ link }) => 
    creditTypeItems.includes(link?.label || '')
  )
  
  const serviceTypes = navItems.filter(({ link }) => 
    serviceItems.includes(link?.label || '')
  )

  return (
    <div className="hidden lg:flex items-center space-x-8">
      {/* Navigation Links */}
      <nav className="flex items-center space-x-6">
        {/* Kredite Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`font-medium transition-colors hover:text-primary flex items-center ${
              creditTypes.some(({ link }) => pathname === link?.url)
                ? 'text-primary font-semibold' 
                : 'text-gray-700'
            }`}
          >
            <span>Kredite</span>
            <div className="w-4 h-4 ml-1 flex items-center justify-center">
              <i className={`ri-arrow-down-s-line transition-transform ${
                dropdownOpen ? 'rotate-180' : ''
              }`}></i>
            </div>
          </button>
          
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {creditTypes.map(({ link }, i) => {
                const isActive = pathname === link?.url
                return (
                  <Link
                     key={i}
                     href={link?.url || '#'}
                     className={`block px-4 py-3 text-sm transition-colors hover:bg-gray-50 hover:text-primary ${
                       isActive 
                         ? 'text-primary font-semibold bg-green-50' 
                         : 'text-gray-700'
                     }`}
                     onClick={() => setDropdownOpen(false)}
                   >
                     {link?.label}
                   </Link>
                )
              })}
              <div className="border-t border-gray-200 mt-2 pt-2">
                <Link
                  href="/kreditarten"
                  className="block px-4 py-3 text-sm text-primary font-medium hover:bg-gray-50"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="flex items-center">
                    <span>Alle Kreditarten</span>
                    <div className="w-4 h-4 ml-2 flex items-center justify-center">
                      <i className="ri-arrow-right-line"></i>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Service Dropdown */}
        {serviceTypes.length > 0 && (
          <div className="relative">
            <button
              className={`font-medium transition-colors hover:text-primary flex items-center ${
                serviceTypes.some(({ link }) => pathname === link?.url)
                  ? 'text-primary font-semibold' 
                  : 'text-gray-700'
              }`}
            >
              <span>Service</span>
              <div className="w-4 h-4 ml-1 flex items-center justify-center">
                <i className="ri-arrow-down-s-line"></i>
              </div>
            </button>
            
            {/* Service Dropdown Menu */}
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              {serviceTypes.map(({ link }, i) => {
                const isActive = pathname === link?.url
                return (
                  <Link
                    key={i}
                    href={link?.url || '#'}
                    className={`block px-4 py-3 text-sm transition-colors hover:bg-gray-50 hover:text-primary ${
                      isActive 
                        ? 'text-primary font-semibold bg-green-50' 
                        : 'text-gray-700'
                    }`}
                  >
                    {link?.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
        
        {/* Other Navigation Items */}
        {mainNavItems.map(({ link }, i) => {
          const isActive = pathname === link?.url
          return (
            <CMSLink 
              key={i} 
              {...link} 
              className={`font-medium transition-colors hover:text-primary ${
                isActive 
                  ? 'text-primary font-semibold' 
                  : 'text-gray-700'
              }`}
            />
          )
        })}
      </nav>
      
      {/* Desktop CTA Button */}
      <Link
        href="/kontakt"
        className="bg-primary hover:bg-green-500 text-white font-medium py-2.5 px-5 rounded-button transition-all flex items-center shadow-sm hover:shadow-md"
      >
        <div className="w-4 h-4 flex items-center justify-center mr-2">
          <i className="ri-customer-service-2-line"></i>
        </div>
        <span>Beratung</span>
      </Link>
    </div>
  )
}
