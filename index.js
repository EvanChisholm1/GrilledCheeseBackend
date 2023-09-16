import express from "express";
import cors from "cors";
import {
    analyzeBiasFromText,
    analyzeFactualnessFromSource,
    cohereApiCall,
} from "./lib/cohere.js";
import { getText } from "./lib/scraper.js";

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
    const isNews = json.generations[0].text === "YES";
    res.json({
        isNews,
    });
});

app.get("/", async (req, res) => {
    const websiteText = await getText(req.query.url);
    console.log(websiteText);

    // const factualness = await analyzeFactualnessFromSource(req.query.url);
    const [factualness, textBias] = await Promise.all([
        analyzeFactualnessFromSource(req.query.url),
        analyzeBiasFromText(websiteText),
    ]);

    res.json({
        factualness,
        textBias,
    });
});

app.listen(8080, () => console.log("running on port 8080"));
