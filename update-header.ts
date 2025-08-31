import { getPayload } from 'payload'
import config from './src/payload.config'

async function updateHeader() {
  try {
    const payload = await getPayload({ config })
    
    // Get current header
    const header = await payload.findGlobal({ slug: 'header' })
    console.log('Current nav items:', header.navItems?.length || 0)
    
    // Check if Sofortkredit exists
    const hassofortkredit = header.navItems?.some((item: any) => 
      item.link?.label === 'Sofortkredit'
    )
    
    console.log('Has Sofortkredit:', hassofortkredit)
    
    if (!hassofortkredit) {
      console.log('Adding Sofortkredit to navigation...')
      
      const updatedNavItems = [
        ...(header.navItems || []),
        {
          link: {
            type: 'custom' as const,
            label: 'Sofortkredit',
            url: '/sofortkredit',
          },
        },
      ]
      
      await payload.updateGlobal({
        slug: 'header',
        data: {
          navItems: updatedNavItems,
        },
      })
      
      console.log('Sofortkredit added successfully!')
    } else {
      console.log('Sofortkredit already exists in navigation')
    }
    
    // Show all nav items
    const updatedHeader = await payload.findGlobal({ slug: 'header' })
    console.log('\nAll navigation items:')
    updatedHeader.navItems?.forEach((item: any, index: number) => {
      console.log(`${index + 1}. ${item.link?.label} -> ${item.link?.url}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  }
}

updateHeader()