import 'dotenv/config';
import { fetchBaufinanzierungProcesses, fetchPrivatkreditProcessDetails } from '../lib/europace';

async function main() {
    console.log('🚀 Starting Europace Export Verification...');

    try {
        // 1. Fetch all processes using the v3 API (currently named fetchBaufinanzierungProcesses)
        console.log('📡 Fetching processes from v3 API...');
        // We use 'ECHT_GESCHAEFT' as default, but fallback to 'TEST_MODUS' if the user env implies it.
        // However, the lib function defaults to ECHT_GESCHAEFT. Let's try TEST_MODUS first for safety if possible?
        // Actually, let's check what env vars are available.
        // If not specified, we'll just call the function as is.

        // NOTE: The function fetchBaufinanzierungProcesses requires 'baufinanzierung:echtgeschaeft' or test equivalent.

        const processes = await fetchBaufinanzierungProcesses('ECHT_GESCHAEFT');
        console.log(`✅ Fetched ${processes.length} processes.`);

        if (processes.length === 0) {
            console.warn('⚠️ No processes found. Cannot verify content types.');
            return;
        }

        // 2. Analyze the first few processes
        console.log('🔍 Analyzing first 5 processes:');
        const sample = processes.slice(0, 5);

        for (const p of sample) {
            console.log('--- Process ---');
            console.log(`ID: ${p.vorgangsNummer}`);
            // Log potential discriminatory fields
            // @ts-ignore
            console.log(`Product/Sparte: ${p.sparte || p.produkt || p.produktart || 'N/A'}`);
            // @ts-ignore
            console.log('Links:', JSON.stringify(p._links, null, 2));
            console.log('Keys:', Object.keys(p).join(', '));

            // Try to identify if it's a Privatkredit
            // Assuming 'sparte' might be 'RK' or 'RATENKREDIT' or similar.
        }

        // 3. Optional: Try to fetch details for one of them explicitly as Privatkredit
        // This expects the ID to be compatible with the GraphQL API.
        if (processes.length > 0) {
            const firstId = processes[0].vorgangsNummer;
            if (firstId) {
                console.log(`\n🧪 Attempting to fetch details for ID ${firstId} via GraphQL (Privatkredit API)...`);
                try {
                    const details = await fetchPrivatkreditProcessDetails(firstId);
                    console.log('✅ GraphQL fetch success!');
                    console.log('Details:', JSON.stringify(details, null, 2));
                } catch (error) {
                    console.error('❌ GraphQL fetch failed. This might be expected if the ID is a Baufinanzierung case.');
                    console.error(error instanceof Error ? error.message : error);
                }
            }
        }

    } catch (error) {
        console.error('❌ Error during verification:', error);
    }
}

main();
