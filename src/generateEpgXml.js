const { XMLParser, XMLBuilder } = require("fast-xml-parser");

const CONFIG = {
  CHANNEL_NAMES: [
    "Jednotka HD.sk",
    "Dvojka HD.sk",
    "Doma HD.sk",
    "Markíza HD.sk",
    "DAJTO HD.sk",
    ":24 HD.sk",
    // "Markíza KRIMI HD.sk",
    // "Markíza Klasik HD.sk",
  ],
  BASE_URLS: "https://www.open-epg.com/files/slovakia1.xml",
};

async function generateEpgXml() {
  try {
    console.log("Fetching EPG data...");

    const response = await fetch(CONFIG.BASE_URLS);
    const data = await response.text();

    console.log("Parsing EPG data...");

    return filterXml(data);
  } catch (error) {
    console.error("Error generating EPG:", error.message);
    throw error;
  }
}

function filterXml(data) {
  const parserOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  };

  const parser = new XMLParser(parserOptions);
  const parsed = parser.parse(data);

  const channelSet = new Set(CONFIG.CHANNEL_NAMES);

  // Normalize to arrays (XML parser returns object for single element)
  const channels = [parsed.tv.channel].flat();
  const programmes = [parsed.tv.programme].flat();

  // Filter to only configured channels
  parsed.tv.channel = channels.filter((ch) => channelSet.has(ch["@_id"]));
  parsed.tv.programme = programmes.filter((pr) =>
    channelSet.has(pr["@_channel"])
  );

  const builder = new XMLBuilder({
    ...parserOptions,
    format: true,
    suppressEmptyNode: true,
  });

  return builder.build(parsed);
}

module.exports = { generateEpgXml };
