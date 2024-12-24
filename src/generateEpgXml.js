const axios = require('axios');
const cheerio = require('cheerio');

const CONFIG = {
  CHANNEL_IDS: [
    "180", "181", "182", "183", "308", "1016", "1017", "1114"
  ],
  BASE_URLS: {
    programs: 'https://services.mujtvprogram.cz/tvprogram2services/services/tvprogrammelist_mobile.php',
    channels: 'https://services.mujtvprogram.cz/tvprogram2services/services/tvchannellist_mobile.php'
  },
  TIMEZONE_OFFSET: '+0200'
}

async function generateEpgXml() {
  try {
    const channelList = await fetchChannelList(CONFIG.CHANNEL_IDS);
    const xmlChannels = xmlParseChannels(channelList)

    const xmlPromises = CONFIG.CHANNEL_IDS.map(channelId => fetchChannelProgramsXml(channelId));
    const xmlResponses = await Promise.all(xmlPromises)
    const xmlPrograms = xmlResponses.map((xml, i) => xmlParsePrograms(CONFIG.CHANNEL_IDS[i], xml));
    return `<?xml version="1.0" encoding="UTF-8"?><tv generator-info-name="TV Program Merger">
      ${xmlChannels}
      ${xmlPrograms}
    </tv>`
  } catch (error) {
    console.error('Error generating EPG:', error.message);
    throw error;
  }
}

async function fetchChannelList(channelIds) {
  try {
    const channelParam = channelIds.join(',');
    const response = await axios.get(`${CONFIG.BASE_URLS.channels}?channel_cid_arr=${channelParam}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching channel list:', error.message);
    return null;
  }
}

async function fetchChannelProgramsXml(channelId) {
  try {
    const response = await axios.get(`${CONFIG.BASE_URLS.programs}?channel_cid=${channelId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching channel ${channelId}:`, error.message);
    return null;
  }
}

function xmlParseChannels(xml) {
  const channels = [];

  const $ = cheerio.load(xml, { xmlMode: true });

  // Extract channels
  $('channel').each((_, channel) => {
    channels.push(tplChannelXml({
      id: $('cid', channel).text(),
      name: $('name:first', channel).text()
    }));
  });

  return channels.join('\n');
}


function xmlParsePrograms(channelId, xml) {
  const programms = [];

  const $ = cheerio.load(xml, { xmlMode: true });

  // Extract channels
  $('programme').each((_, programme) => {
    programms.push(tplProgramXml({
      channelId: channelId,
      start: formatTimestamp($('startDateTimeInSec', programme).text()),
      stop: formatTimestamp($('endDateTimeInSec', programme).text()),
      title: $('name:first', programme).text(),
      desc: $('longDescription', programme).text(),
      date: $('date', programme).text(),
    }));
  });

  return programms.join('\n');
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0') +
    String(date.getHours()).padStart(2, '0') +
    String(date.getMinutes()).padStart(2, '0') +
    String(date.getSeconds()).padStart(2, '0');
}

function tplProgramXml({ channelId, start, stop, title, desc, date }) {
  return `<programme channel="${channelId}" start="${start} ${CONFIG.TIMEZONE_OFFSET}" stop="${stop} ${CONFIG.TIMEZONE_OFFSET}">
    <title>${title}</title><desc>${desc}</desc><date>${date}</date>
  </programme>`
}

function tplChannelXml({ id, name }) {
  return `<channel id="${id}"><display-name lang="Slovakia">${name}</display-name></channel>`
}

module.exports = { generateEpgXml };
