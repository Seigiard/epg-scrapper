const axios = require('axios');
const { BASE_URLS } = require('../config');

async function fetchChannelList(channelIds) {
  try {
    const channelParam = channelIds.join(',');
    const response = await axios.get(`${BASE_URLS.channels}?channel_cid_arr=${channelParam}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching channel list:', error.message);
    return null;
  }
}

exports.fetchChannelList = fetchChannelList;