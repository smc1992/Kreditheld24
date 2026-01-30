import 'dotenv/config';
import { createPrivatkreditCase, EuropaceCustomerData } from '../lib/europace';

async function main() {
    console.log('🚀 Starting Europace Creation Verification...');

    // Dummy Customer Data
    const customer: EuropaceCustomerData = {
        // Basic Info
        salutation: 'HERR',
        title: 'Dr.',
        firstName: 'Max',
        lastName: 'Mustermann-Test', // Europace test system often requires specific names or just works with generic ones
        email: `test.user.${Date.now()}@example.com`,
        phone: '03012345678',

        // Address
        address: 'Teststraße 123',

        // Extended Personal Info
        birthDate: new Date('1985-05-15'),
        birthPlace: 'München',
        maritalStatus: 'VERHEIRATET',
        childrenCount: 2,
        nationality: 'DEUTSCHLAND',

        source: 'privatkredit'
    };

    console.log('📝 Payload Customer:', customer);

    try {
        console.log('📡 Sending create request to API...');
        // Use 'ECHT_GESCHAEFT' only if you are SURE. For verification we should probably use Default (TEST_MODUS)
        // The function default is TEST_MODUS.

        // Check if we have credentials
        if (!process.env.EUROPACE_CLIENT_ID) {
            throw new Error('Missing EUROPACE_CLIENT_ID');
        }

        const vorgangsNummer = await createPrivatkreditCase(customer, 'TEST_MODUS');

        console.log('✅ Success!');
        console.log(`🆔 Created Vorgang ID: ${vorgangsNummer}`);
        console.log(`🔗 Link (approx): https://www.europace2.de/vorgang/oeffne/${vorgangsNummer}`);

    } catch (error) {
        console.error('❌ Creation failed:', error);
        // Log full error property if available
        if (error instanceof Error && 'details' in error) {
            console.error('Details:', (error as any).details);
        }
    }
}

main();
