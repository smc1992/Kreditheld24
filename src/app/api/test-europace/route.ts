import { NextResponse } from 'next/server'
import { getEuropaceAccessTokenWithScope } from '../../../../lib/europace'

// Ungeschützte Test-Route (nur für Development!)
export async function GET(request: Request) {
  try {
    const results = {
      oauth: { success: false, error: null, token: null as string | null },
      baufinanzierung: { success: false, error: null as string | null, data: null as any, endpoint: null as string | null },
      privatkredit: { success: false, error: null as string | null, data: null as any, endpoint: null as string | null },
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

    // Test 2: Baufinanzierung API (both TEST_MODUS and ECHT_GESCHAEFT)
    if (results.oauth.success) {
      console.log('Testing Baufinanzierung API...')
      
      const baufiEndpoints = [
        { url: 'https://api.europace2.de/v2/vorgaenge?datenKontext=TEST_MODUS', mode: 'TEST_MODUS' },
        { url: 'https://api.europace2.de/v2/vorgaenge?datenKontext=TEST_MODUS&limit=100', mode: 'TEST_MODUS_100' },
        { url: 'https://api.europace2.de/v2/vorgaenge', mode: 'ECHT_GESCHAEFT' },
        { url: 'https://api.europace2.de/v2/vorgaenge?limit=100', mode: 'ECHT_GESCHAEFT_100' },
      ]

      const allResults: any = { test: null, echt: null }

      for (const { url: endpoint, mode } of baufiEndpoints) {
        try {
          const token = await getEuropaceAccessTokenWithScope('baufinanzierung:vorgang:lesen')
          console.log(`Trying endpoint: ${endpoint} (${mode})`)
          
          // Add X-Partner-ID and X-Organisationseinheit headers
          const headers: Record<string, string> = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-TraceId': `test-${Date.now()}`,
          }
          
          if (process.env.EUROPACE_PERSON_ID) {
            headers['X-Partner-ID'] = process.env.EUROPACE_PERSON_ID
          }
          
          if (process.env.EUROPACE_ORG_ID) {
            headers['X-Organisationseinheit'] = process.env.EUROPACE_ORG_ID
          }
          
          console.log(`Using headers:`, { 
            'X-Partner-ID': headers['X-Partner-ID'],
            'X-Organisationseinheit': headers['X-Organisationseinheit']
          })
          
          const res = await fetch(endpoint, {
            method: 'GET',
            headers,
            cache: 'no-store',
          })

          const responseText = await res.text()
          
          if (res.ok) {
            try {
              const data = JSON.parse(responseText)
              const vorgaengeCount = data?._embedded?.vorgaenge?.length || 0
              
              // Log full response structure for debugging
              console.log(`✓ Baufinanzierung API (${mode}): ${vorgaengeCount} vorgaenge found`)
              console.log(`Response structure:`, JSON.stringify(data, null, 2).substring(0, 500))
              console.log(`Response headers:`, Object.fromEntries(res.headers.entries()))
              
              // Store result with mode key
              const modeKey = mode.toLowerCase().replace(/_/g, '_')
              if (!allResults[modeKey]) {
                allResults[modeKey] = data
              }
            } catch (e) {
              console.log(`Failed to parse response for ${mode}:`, e)
            }
          } else {
            console.log(`✗ Baufinanzierung API (${mode}) failed: ${res.status}`)
            console.log(`Error response:`, responseText.substring(0, 200))
          }
        } catch (error) {
          console.log(`✗ Error trying ${endpoint}:`, error)
        }
      }

      // Set results based on which mode has data
      const testVorgaenge = allResults.test?._embedded?.vorgaenge?.length || 0
      const echtVorgaenge = allResults.echt?._embedded?.vorgaenge?.length || 0
      
      results.baufinanzierung.success = true
      results.baufinanzierung.data = {
        test_modus: allResults.test,
        echt_geschaeft: allResults.echt,
        summary: `TEST_MODUS: ${testVorgaenge} vorgaenge, ECHT_GESCHAEFT: ${echtVorgaenge} vorgaenge`
      }
      results.baufinanzierung.endpoint = 'https://api.europace2.de/v2/vorgaenge (both modes tested)'
    }

    // Test 3: Privatkredit API
    if (results.oauth.success) {
      console.log('Testing Privatkredit API...')
      
      const privatkreditEndpoints = [
        'https://www.europace2.de/kreditsmart/kex/vorgaenge',
      ]

      for (const endpoint of privatkreditEndpoints) {
        try {
          const token = await getEuropaceAccessTokenWithScope('privatkredit:vorgang:lesen')
          console.log(`Trying endpoint: ${endpoint}`)
          
          // GraphQL query for Privatkredit
          const graphqlQuery = {
            query: `
              query {
                vorgaenge {
                  vorgangsnummer
                  antragsteller1 {
                    personendaten {
                      vorname
                      nachname
                      email
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

          const responseText = await res.text()
          
          results.privatkredit.endpoint = endpoint
          results.privatkredit.success = res.ok
          
          if (res.ok) {
            try {
              results.privatkredit.data = JSON.parse(responseText)
              console.log(`✓ Privatkredit API successful at ${endpoint}`)
              console.log('Response preview:', JSON.stringify(results.privatkredit.data).substring(0, 200))
              break
            } catch (e) {
              results.privatkredit.data = responseText
            }
          } else {
            results.privatkredit.error = `HTTP ${res.status}: ${responseText}`
            console.log(`✗ Privatkredit API failed at ${endpoint}: ${res.status}`)
          }
        } catch (error) {
          console.log(`✗ Error trying ${endpoint}:`, error)
          results.privatkredit.error = error instanceof Error ? error.message : 'Unknown error'
        }
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
