const axios = require("axios");
const cheerio = require("cheerio");

var hardCodeSiteUrl = "https://www.nytimes.com/puzzles/spelling-bee";

const fetchData = async (siteUrl) => {
  const result = await axios.get(siteUrl);
  //console.log(result.data);
  return cheerio.load(result.data);
};

const getResults = async () => {
  var $ = await fetchData(hardCodeSiteUrl);

};

module.exports.getResults = getResults;