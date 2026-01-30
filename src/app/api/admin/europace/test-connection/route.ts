import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getEuropaceAccessTokenWithScope } from '../../../../../../lib/europace'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results = {
      oauth: { success: false, error: null, token: null },
      baufinanzierung: { success: false, error: null, data: null, endpoint: null },
      privatkredit: { success: false, error: null, data: null, endpoint: null },
    }

    // Test 1: OAuth Token abrufen
    console.log('Testing OAuth token retrieval...')
    try {
      const token = await getEuropaceAccessTokenWithScope('baufinanzierung:vorgang:lesen')
      results.oauth.success = true
      results.oauth.token = token.substring(0, 20) + '...' // Nur Anfang zeigen
      console.log('✓ OAuth token retrieved successfully')
    } catch (error) {
      results.oauth.error = error instanceof Error ? error.message : 'Unknown error'
      console.error('✗ OAuth token failed:', error)
    }

    // Test 2: Baufinanzierung API
    if (results.oauth.success) {
      console.log('Testing Baufinanzierung API...')
      
      // Versuche verschiedene mögliche Endpoints
      const baufiEndpoints = [
        'https://baufinanzierung.api.europace.de/v2/vorgaenge',
        'https://baufinanzierung.api.europace.de/vorgaenge',
        'https://api.europace.de/v2/baufinanzierung/vorgaenge',
      ]

      for (const endpoint of baufiEndpoints) {
        try {
          const token = await getEuropaceAccessTokenWithScope('baufinanzierung:vorgang:lesen')
          console.log(`Trying endpoint: ${endpoint}`)
          
          const res = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          })

          const responseText = await res.text()
          
          results.baufinanzierung.endpoint = endpoint
          results.baufinanzierung.success = res.ok
          
          if (res.ok) {
            try {
              results.baufinanzierung.data = JSON.parse(responseText)
              console.log(`✓ Baufinanzierung API successful at ${endpoint}`)
              console.log('Response preview:', JSON.stringify(results.baufinanzierung.data).substring(0, 200))
              break // Erfolgreicher Endpoint gefunden
            } catch (e) {
              results.baufinanzierung.data = responseText
            }
          } else {
            results.baufinanzierung.error = `HTTP ${res.status}: ${responseText}`
            console.log(`✗ Baufinanzierung API failed at ${endpoint}: ${res.status}`)
          }
        } catch (error) {
          console.log(`✗ Error trying ${endpoint}:`, error)
          results.baufinanzierung.error = error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    // Test 3: Privatkredit API
    if (results.oauth.success) {
      console.log('Testing Privatkredit API...')
      
      // Versuche verschiedene mögliche Endpoints
      const privatkreditEndpoints = [
        'https://kreditsmart.api.europace.de/v2/vorgaenge',
        'https://kreditsmart.api.europace.de/vorgaenge',
        'https://api.europace.de/v2/kreditsmart/vorgaenge',
        'https://api.europace.de/v2/privatkredit/vorgaenge',
      ]

      for (const endpoint of privatkreditEndpoints) {
        try {
          const token = await getEuropaceAccessTokenWithScope('privatkredit:vorgang:lesen')
          console.log(`Trying endpoint: ${endpoint}`)
          
          const res = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
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
              break // Erfolgreicher Endpoint gefunden
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
