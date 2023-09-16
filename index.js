import express from "express";
import cors from "cors";
import {
    analyzeBiasFromText,
    analyzeFactualnessFromSource,
} from "./lib/cohere.js";
import { getText } from "./lib/scraper.js";

const app = express();

app.use(cors("*"));
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
