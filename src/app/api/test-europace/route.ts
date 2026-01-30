import { NextResponse } from 'next/server'
import { getEuropaceAccessTokenWithScope } from '../../../../lib/europace'

// Ungeschützte Test-Route (nur für Development!)
export async function GET(request: Request) {
  try {
    const results: any = {
      oauth: { success: false, error: null, token: null },
      baufinanzierung: { success: false, error: null, data: null, endpoint: null, detailData: null },
      privatkredit: { success: false, error: null, data: null, endpoint: null }
    }

    // Test 1: OAuth Token abrufen
    console.log('Testing OAuth token retrieval...')
    console.log('EUROPACE_CLIENT_ID:', process.env.EUROPACE_CLIENT_ID?.substring(0, 10) + '...')
    console.log('EUROPACE_OAUTH_URL:', process.env.EUROPACE_OAUTH_URL)
    
    try {
      const token = await getEuropaceAccessTokenWithScope('baufinanzierung:vorgang:lesen')
      results.oauth.success = true
      results.oauth.token = token.substring(0, 20) + '...'
      console.log('✓ OAuth token retrieved successfully')
    } catch (error) {
      results.oauth.error = error instanceof Error ? error.message : 'Unknown error'
      console.error('✗ OAuth token failed:', error)
      
      // Zusätzliche Diagnose
      if (error instanceof Error && error.message.includes('fetch failed')) {
        results.oauth.error = 'Netzwerkverbindung fehlgeschlagen. Mögliche Ursachen: Firewall, falsche URL, oder SSL-Problem. URL: ' + process.env.EUROPACE_OAUTH_URL
      }
    }

    // Define foundVorgangsNummer in the outer scope to be accessible for detail fetching
    let foundVorgangsNummer = ''

    // Test 2: Baufinanzierung API (Debug Headers)
    if (results.oauth.success) {
      console.log('Testing Baufinanzierung API with different headers...')
      
      const strategies = [
        { name: 'No Extra Headers', headers: {} },
        { name: 'With Partner-ID', headers: { 'X-Partner-ID': process.env.EUROPACE_PERSON_ID || '' } },
        { name: 'With Org-ID', headers: { 'X-Organisationseinheit': process.env.EUROPACE_ORG_ID || '' } },
        { name: 'With Both', headers: { 'X-Partner-ID': process.env.EUROPACE_PERSON_ID || '', 'X-Organisationseinheit': process.env.EUROPACE_ORG_ID || '' } }
      ]

      const baufiResults: any = {}

      for (const strategy of strategies) {
        // Skip strategies with missing env vars
        if ((strategy.name.includes('Partner-ID') && !process.env.EUROPACE_PERSON_ID) || 
            (strategy.name.includes('Org-ID') && !process.env.EUROPACE_ORG_ID)) {
          continue
        }

        try {
          // Use correct scope including echtgeschaeft
          const token = await getEuropaceAccessTokenWithScope('baufinanzierung:vorgang:lesen baufinanzierung:echtgeschaeft')
          const endpoint = 'https://api.europace2.de/v3/vorgaenge?limit=5'
          const url = `${endpoint}&datenKontext=ECHT_GESCHAEFT`

          const headers: Record<string, string> = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-TraceId': `test-${Date.now()}`,
          }

          // Merge strategy headers safely
          Object.entries(strategy.headers).forEach(([key, value]) => {
            if (value) {
              headers[key] = value as string
            }
          })
          
          console.log(`Testing strategy: ${strategy.name}`)
          
          const res = await fetch(url, {
            method: 'GET',
            headers,
            cache: 'no-store',
          })

          const text = await res.text()
          let data = null
          let count = -1
          
          if (res.ok) {
            try {
              data = JSON.parse(text)
              if (Array.isArray(data.vorgaenge)) {
                count = data.vorgaenge.length
                if (count > 0 && !foundVorgangsNummer) {
                  foundVorgangsNummer = data.vorgaenge[0].vorgangsNummer
                }
              }
              else if (Array.isArray(data)) {
                count = data.length
                // Try to find vorgangsNummer if array of objects
                if (count > 0 && !foundVorgangsNummer && data[0].vorgangsNummer) {
                   foundVorgangsNummer = data[0].vorgangsNummer
                }
              }
              else count = 0
            } catch (e) {
               // ignore json error
            }
          }
          
          baufiResults[strategy.name] = {
            status: res.status,
            count: count,
            preview: text.substring(0, 500) // Longer preview to see structure
          }

        } catch (error) {
          baufiResults[strategy.name] = { error: error instanceof Error ? error.message : String(error) }
        }
      }
      
      results.baufinanzierung.data = baufiResults
      results.baufinanzierung.endpoint = 'https://api.europace2.de/v3/vorgaenge (Header Strategy Test + Scope echtgeschaeft)'
    }

    // Test 2b: Baufinanzierung Process Details (Fetch data for first found process)
    if (foundVorgangsNummer) {
      console.log('Fetching details for first process...')
      const vorgangsNummer = foundVorgangsNummer

      if (vorgangsNummer) {
        try {
          const token = await getEuropaceAccessTokenWithScope('baufinanzierung:vorgang:lesen baufinanzierung:echtgeschaeft')
          const endpoint = `https://api.europace2.de/v3/vorgaenge/${vorgangsNummer}`
          
          console.log(`Fetching details for ${vorgangsNummer}...`)
          
          const headers: Record<string, string> = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
          if (process.env.EUROPACE_PERSON_ID) headers['X-Partner-ID'] = process.env.EUROPACE_PERSON_ID
          if (process.env.EUROPACE_ORG_ID) headers['X-Organisationseinheit'] = process.env.EUROPACE_ORG_ID

          const res = await fetch(endpoint, {
            method: 'GET',
            headers,
            cache: 'no-store',
          })

          const text = await res.text()
          if (res.ok) {
            const detailData = JSON.parse(text)
            results.baufinanzierung.detailData = {
              vorgangsNummer,
              structure: JSON.stringify(detailData, null, 2).substring(0, 5000) // Log generic structure
            }
            console.log(`✓ Details for ${vorgangsNummer} fetched successfully`)
          } else {
            console.log(`✗ Failed to fetch details for ${vorgangsNummer}: ${res.status}`)
            results.baufinanzierung.detailData = { error: `HTTP ${res.status}`, response: text.substring(0, 500) }
          }
        } catch (error) {
          console.log('Error fetching details:', error)
          results.baufinanzierung.detailData = { error: error instanceof Error ? error.message : String(error) }
        }
      }
    }

    // Test 3: Privatkredit API (Introspection - Mutations)
    if (results.oauth.success) {
      console.log('Testing Privatkredit API Introspection (Mutations)...')
      
      const endpoint = 'https://www.europace2.de/kreditsmart/kex/vorgaenge'
      
      try {
        const token = await getEuropaceAccessTokenWithScope('privatkredit:vorgang:lesen')
        
        // Introspection of Mutation type
        const graphqlQuery = {
          query: `
            query {
              __schema {
                mutationType {
                  fields {
                    name
                    description
                    args {
                      name
                      type {
                        kind
                        name
                        ofType {
                          kind
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          `
        }
        
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(graphqlQuery),
          cache: 'no-store',
        })

        const text = await res.text()
        
        if (res.ok) {
           try {
             const json = JSON.parse(text)
             const fields = json.data?.__schema?.mutationType?.fields || []
             
             const simplifiedFields = fields.map((f: any) => ({
               name: f.name,
               args: f.args.map((a: any) => a.name)
             }))
             
             results.privatkredit.mutations = simplifiedFields
             console.log('Privatkredit API Mutations:', JSON.stringify(simplifiedFields, null, 2))
           } catch (e) {
             results.privatkredit.mutationError = { raw: text }
           }
        }

      } catch (error) {
        console.error('Error introspecting mutations:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'API connection test completed',
      results,
      recommendations: {
        oauth: results.oauth.success ? '✓ OAuth funktioniert' : '✗ OAuth-Konfiguration prüfen',
        baufinanzierung: results.baufinanzierung.success 
          ? `✓ Baufinanzierung API erreichbar: ${results.baufinanzierung.endpoint}` 
          : '✗ Baufinanzierung API nicht erreichbar - Endpoint oder Scopes prüfen',
        privatkredit: results.privatkredit.success 
          ? `✓ Privatkredit API erreichbar: ${results.privatkredit.endpoint}` 
          : '✗ Privatkredit API nicht erreichbar - Endpoint oder Scopes prüfen',
      }
    })
  } catch (error) {
    console.error('Test connection error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Test failed',
      },
      { status: 500 }
    )
  }
}
