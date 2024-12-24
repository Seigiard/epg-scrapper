const { CHANNEL_IDS } = require('./src/config');
const { fetchChannelXml } = require('./src/api/programFetcher');
const { fetchChannelList } = require('./src/api/channelFetcher');
const { mergeXmlResponses } = require('./src/xmlMerger');

async function main() {
  try {
    // Fetch channel list
    const channelList = await fetchChannelList(CHANNEL_IDS);
    console.log('Channel List:', channelList);

    // Fetch XML for all channels in parallel
    const xmlPromises = CHANNEL_IDS.map(channelId => fetchChannelXml(channelId));
    const xmlResponses = await Promise.all(xmlPromises);

    // Merge all XML responses
    const mergedXml = mergeXmlResponses(xmlResponses);
    
    // Output the merged XML
    console.log('\nMerged EPG XML:');
    console.log(mergedXml);
  } catch (error) {
    console.error('Error processing TV program:', error.message);
  }
}

main();