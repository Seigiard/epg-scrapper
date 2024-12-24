const express = require('express');
const { generateEpgXml } = require('./src/generateEpgXml');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  try {
    const xml = await generateEpgXml();
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating EPG data');
  }
});

app.listen(PORT, () => {
  console.log(`EPG service running on port ${PORT}`);
});
