const axios = require('axios');
const { BASE_URLS } = require('../config');

async function fetchChannelXml(channelId) {
  try {
    const response = await axios.get(`${BASE_URLS.programs}?channel_cid=${channelId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching channel ${channelId}:`, error.message);
    return null;
  }
}

exports.fetchChannelXml = fetchChannelXml;