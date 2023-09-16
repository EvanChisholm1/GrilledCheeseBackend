import express from "express";
import cors from "cors";
import {
    analyzeBiasFromText,
    analyzeFactualnessFromSource,
    cohereApiCall,
    cohereEmbed,
    crossReference,
} from "./lib/cohere.js";
import { getText } from "./lib/scraper.js";
import { readFileSync } from "fs";
import { knn } from "./lib/knn.js";
const newsEmbeddings = JSON.parse(readFileSync("./embeddings.json"));

const app = express();

app.use(cors("*"));

app.get("/is-news", async (req, res) => {
    const websiteText = await getText(req.query.url);
    // console.log(websiteText);
    const cohereResponse =
        await cohereApiCall(`Does the following text look like a news article? simply answer "YES" or "NO" and do not add any other text.

TEXT:
${websiteText}
`);

    const json = await cohereResponse.json();
    console.log(json);

    console.log(json.generations[0].text);
    const isNews = json.generations[0].text.includes("YES");
    res.json({
        isNews,
    });
});

app.get("/", async (req, res) => {
    const websiteText = await getText(req.query.url);
    // console.log(websiteText);

    const embedRes = await cohereEmbed([websiteText]);
    const currentWebsiteEmbed = (await embedRes.json()).embeddings[0];

    const point = {
        title: req.query.url,
        embedding: currentWebsiteEmbed,
        text: websiteText,
    };

    const mostSimilar = knn(point, newsEmbeddings, 2).filter(
        (x) => x.similarity > 0.5
    );
    console.log(mostSimilar.map((x) => [x.point.title, x.similarity]));
    let crossRef = null;
    if (mostSimilar.length > 0) {
        const crossRes = await crossReference(point, mostSimilar);
        crossRef = (await crossRes.json()).generations[0].text;
    }

    // const factualness = await analyzeFactualnessFromSource(req.query.url);
    const [factualness, textBias] = await Promise.all([
        analyzeFactualnessFromSource(req.query.url),
        analyzeBiasFromText(websiteText),
    ]);

    res.json({
        factualness,
        textBias,
        crossRef,
    });
});

app.listen(8080, () => console.log("running on port 8080"));
