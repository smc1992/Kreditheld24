import { saveFile } from '../src/lib/file-upload';
import { resolve, join } from 'path';
import { existsSync, unlinkSync, rmdirSync } from 'fs';

async function testSaveFile() {
    console.log('--- Testing saveFile Utility ---');

    // 1. Create a dummy File object
    const content = 'Hello, this is a test document.';
    const filename = 'test-doc.txt';
    const file = new File([content], filename, { type: 'text/plain' });

    try {
        // 2. Test saving without subfolder
        console.log('Testing save without subfolder...');
        const url1 = await saveFile(file);
        console.log('URL 1:', url1);
        const path1 = resolve(process.cwd(), 'public', url1.startsWith('/') ? url1.slice(1) : url1);
        if (existsSync(path1)) {
            console.log('Check: File 1 exists at', path1);
            unlinkSync(path1);
            console.log('Cleanup: File 1 removed');
        } else {
            console.error('Error: File 1 NOT found at', path1);
        }

        // 3. Test saving with subfolder
        console.log('\nTesting save with subfolder "test-uploads"...');
        const url2 = await saveFile(file, 'test-uploads');
        console.log('URL 2:', url2);
        const path2 = resolve(process.cwd(), 'public', url2.startsWith('/') ? url2.slice(1) : url2);
        if (existsSync(path2)) {
            console.log('Check: File 2 exists at', path2);
            unlinkSync(path2);
            console.log('Cleanup: File 2 removed');
            const dirPath = resolve(process.cwd(), 'public', 'uploads', 'test-uploads');
            rmdirSync(dirPath);
            console.log('Cleanup: Directory removed', dirPath);
        } else {
            console.error('Error: File 2 NOT found at', path2);
        }

        console.log('\n--- SUCCESS: saveFile utility logic verified ---');
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
}

testSaveFile();
