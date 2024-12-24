const cheerio = require('cheerio');

function mergeXmlResponses(xmlResponses) {
  // Start with the base XML structure
  let mergedXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  mergedXml += '<!DOCTYPE tv SYSTEM "xmltv.dtd">\n';
  mergedXml += '<tv generator-info-name="TV Program Merger">\n';

  const channels = new Set();
  const programmes = [];

  xmlResponses.forEach(xml => {
    if (!xml) return;

    const $ = cheerio.load(xml, { xmlMode: true });

    // Extract channels
    $('channel').each((_, channel) => {
      channels.add($.xml(channel));
    });

    // Extract programmes
    $('programme').each((_, programme) => {
      programmes.push($.xml(programme));
    });
  });

  // Add channels
  channels.forEach(channel => {
    mergedXml += channel + '\n';
  });

  // Add programmes
  programmes.forEach(programme => {
    mergedXml += programme + '\n';
  });

  mergedXml += '</tv>';
  return mergedXml;
}

exports.mergeXmlResponses = mergeXmlResponses;