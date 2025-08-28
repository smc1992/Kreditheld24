import { getPayload } from 'payload';
import config from './src/payload.config.ts';

async function checkHeader() {
  try {
    const payload = await getPayload({ config });
    const header = await payload.findGlobal({ slug: 'header' });
    console.log('Header Navigation Items:');
    console.log(JSON.stringify(header.navItems, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

checkHeader();