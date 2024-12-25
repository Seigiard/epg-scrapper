import fs from 'fs';
import { generateEpgXml } from './src/generateEpgXml.js';

const xml = await generateEpgXml();

const args = process.argv.slice(2);
const [ file ]= args

try {
    fs.writeFileSync(file, xml, 'utf8');
    console.log('File has been written successfully');
} catch (err) {
    console.error('Error writing file:', err);
}
