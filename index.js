import express from "express";
import { analyzeFactualnessFromSource } from "./lib/cohere.js";
const app = express();

app.get("/", async (req, res) => {
    const factualness = await analyzeFactualnessFromSource(req.query.url);

    res.json({
        factualness,
    });
});

app.listen(8080, () => console.log("running on port 8080"));
