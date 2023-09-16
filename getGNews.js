import news from "gnews";
import { cohereEmbed } from "./lib/cohere.js";
import { writeFile } from "fs/promises";

async function main() {
    const heads = await news.headlines({ n: 1000 });

    const contents = heads.map((x) => `${x.title} ${x.contentSnippet}`);
    const res = await cohereEmbed(contents);
    const embeddings = await res.json();

    const items = embeddings.texts.map((text, i) => ({
        text,
        embedding: embeddings.embeddings[i],
        title: heads[i].title,
    }));
    console.log(items);
    for (const head of heads) {
        console.log(head.title);
    }
    await writeFile("./embeddings.json", JSON.stringify(items));

    // console.log(heads.length);
}

main();
