const { CHANNEL_IDS } = require('../config');
const { fetchChannelXml } = require('../api/programFetcher');
const { fetchChannelList } = require('../api/channelFetcher');
const { mergeXmlResponses } = require('../xmlMerger');

async function generateEpgXml() {
  try {
    const channelList = await fetchChannelList(CHANNEL_IDS);
    const xmlPromises = CHANNEL_IDS.map(channelId => fetchChannelXml(channelId));
    const xmlResponses = await Promise.all(xmlPromises);
    return mergeXmlResponses(xmlResponses);
  } catch (error) {
    console.error('Error generating EPG:', error.message);
    throw error;
  }
}

module.exports = { generateEpgXml };