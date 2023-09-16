const axios = require("axios");
const cheerio = require("cheerio");

let hardCodeSiteUrl = "https://www.cnn.com/2023/09/15/americas/el-chapo-son-extradited-mexico-us-hnk-intl/index.html";

const fetchData = async (siteUrl) => {
  try {
    const result = await axios.get(siteUrl);
    return result.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; 
  }
};

const extractArticleContent = (html) => {
  const $ = cheerio.load(html);
  const articleContent = [];

  $("p").each((index, element) => {
    articleContent.push($(element).text());
  });
  console.log("testes 2");
  console.log(articleContent.join("\n"));
  return articleContent.join("\n");
};

const getResults = async () => {
  try {
    const html = await fetchData(hardCodeSiteUrl);
    const articleText = extractArticleContent(html);
    console.log(html, articleText);
  } catch (error) {
    console.error("Error:", error);
  }
};
getResults();
module.exports.getResults = getResults;