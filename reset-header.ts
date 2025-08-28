import { getPayload } from 'payload'
import config from './src/payload.config'

async function resetHeader() {
  try {
    const payload = await getPayload({ config })
    
    console.log('Resetting header navigation...')
    
    // Complete navigation items as defined in config
    const completeNavItems = [
      {
        id: '1',
        link: {
          type: 'custom' as const,
          label: 'Ratenkredite',
          url: '/ratenkredite',
        },
      },
      {
        id: '2',
        link: {
          type: 'custom' as const,
          label: 'Autokredit',
          url: '/autokredit',
        },
      },
      {
        id: '3',
        link: {
          type: 'custom' as const,
          label: 'Umschuldung',
          url: '/umschuldung',
        },
      },
      {
        id: '4',
        link: {
          type: 'custom' as const,
          label: 'Sofortkredit',
          url: '/sofortkredit',
        },
      },
      {
        id: '5',
        link: {
          type: 'custom' as const,
          label: 'SCHUFA-neutral',
          url: '/schufa-neutral',
        },
      },
      {
        id: '6',
        link: {
          type: 'custom' as const,
          label: 'Selbstständige',
          url: '/kredit-selbststaendige',
        },
      },
      {
        id: '7',
        link: {
          type: 'custom' as const,
          label: 'Kreditarten',
          url: '/kreditarten',
        },
      },
      {
        id: '8',
        link: {
          type: 'custom' as const,
          label: 'Tipps',
          url: '/tipps-kreditaufnahme',
        },
      },
      {
        id: '9',
        link: {
          type: 'custom' as const,
          label: 'Über uns',
          url: '/ueber-uns',
        },
      },
      {
        id: '10',
        link: {
          type: 'custom' as const,
          label: 'Kontakt',
          url: '/kontakt',
        },
      },
    ]
    
    // Update header with complete navigation using normal API
    await payload.updateGlobal({
      slug: 'header',
      data: {
        logo: {
          text: 'Kreditheld24',
          fontFamily: 'Pacifico, cursive',
        },
        navItems: completeNavItems,
      },
    })
    
    console.log('Header navigation reset successfully!')
    
    // Verify the update
    const updatedHeader = await payload.findGlobal({ slug: 'header' })
    console.log('\nUpdated navigation items:')
    updatedHeader.navItems?.forEach((item: any, index: number) => {
      console.log(`${index + 1}. ${item.link?.label} -> ${item.link?.url}`)
    })
    
    console.log(`\nTotal items: ${updatedHeader.navItems?.length || 0}`)
    
  } catch (error) {
    console.error('Error resetting header:', error)
  }
}

resetHeader()