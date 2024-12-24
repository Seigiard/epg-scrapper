import { generateEpgXml } from './src/generateEpgXml.js';

const xml = await generateEpgXml();
console.log(xml)
