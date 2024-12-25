const fs = require('fs');
const { generateEpgXml } = require('./src/generateEpgXml.js');

generateEpgXml().then(xml => {
  const args = process.argv.slice(2);
  const [file] = args

  try {
    fs.writeFileSync(file, xml, 'utf8');
    console.log('File has been written successfully');
  } catch (err) {
    console.error('Error writing file:', err);
  }
}).catch(error => {
  console.error('Error generating EPG data:', error.message);
});
