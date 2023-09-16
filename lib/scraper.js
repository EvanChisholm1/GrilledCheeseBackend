// const axios = require("axios");
// const cheerio = require("cheerio");
import axios from "axios";
import cheerio from "cheerio";

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
    // console.log(articleContent.join("\n"));
    return articleContent.join("\n");
};

function extractTitleFromHTML(html) {
    const $ = cheerio.load(html);

    return $("h1").text();
}

export async function getTitle(url) {
    try {
        const html = await fetchData(url);
        const articleTitle = extractTitleFromHTML(html);
        return articleTitle;
    } catch (error) {
        console.error("Error:", error);
    }
}

export const getText = async (url) => {
    try {
        const html = await fetchData(url);
        const articleText = extractArticleContent(html);
        // console.log(html, articleText);
        return articleText;
    } catch (error) {
        console.error("Error:", error);
    }
};
// getResults();
// module.exports.getResults = getResults;
