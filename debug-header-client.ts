import { getPayload } from 'payload'
import config from './src/payload.config'

async function debugHeaderClient() {
  try {
    const payload = await getPayload({ config })
    
    console.log('=== HEADER DEBUG ===\n')
    
    // Get current header data
    const header = await payload.findGlobal({ slug: 'header' })
    
    console.log('Header data loaded:')
    console.log('- Logo text:', header.logo?.text)
    console.log('- Total navItems:', header.navItems?.length || 0)
    console.log()
    
    console.log('All navigation items:')
    header.navItems?.forEach((item: any, index: number) => {
      console.log(`${index + 1}. "${item.link?.label}" -> ${item.link?.url} (ID: ${item.id})`)
    })
    console.log()
    
    // Check specific items
    const sofortkredit = header.navItems?.find((item: any) => 
      item.link?.label === 'Sofortkredit'
    )
    
    console.log('Sofortkredit item:')
    if (sofortkredit) {
      console.log('✅ Found:', JSON.stringify(sofortkredit, null, 2))
    } else {
      console.log('❌ NOT FOUND')
    }
    console.log()
    
    // Check filtering logic
    const creditTypeItems = ['Ratenkredite', 'Autokredit', 'Umschuldung', 'Sofortkredit', 'SCHUFA-neutral', 'Selbstständige']
    
    const filteredCreditTypes = header.navItems?.filter((item: any) => 
      creditTypeItems.includes(item.link?.label || '')
    )
    
    console.log('Filtered credit types (what should appear in dropdown):')
    filteredCreditTypes?.forEach((item: any, index: number) => {
      console.log(`${index + 1}. "${item.link?.label}" -> ${item.link?.url}`)
    })
    console.log()
    
    console.log('Expected credit types:', creditTypeItems)
    console.log('Found credit types:', filteredCreditTypes?.map(item => item.link?.label) || [])
    
    const missing = creditTypeItems.filter(expected => 
      !filteredCreditTypes?.some(item => item.link?.label === expected)
    )
    
    if (missing.length > 0) {
      console.log('❌ Missing credit types:', missing)
    } else {
      console.log('✅ All credit types found!')
    }
    
  } catch (error) {
    console.error('Error debugging header:', error)
  }
}

debugHeaderClient()