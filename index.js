import express from "express";
import { analyzeBiasFromURL } from "./lib/cohere.js";
const app = express();

app.get("/", async (req, res) => {
    const publisherBias = await analyzeBiasFromURL(req.query.url);
    res.json({
        publisherBias,
    });
});

app.listen(8080, () => console.log("running on port 8080"));
