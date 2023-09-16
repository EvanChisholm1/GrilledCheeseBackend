export async function cohereEmbed(texts) {
    return await fetch("https://api.cohere.ai/v1/embed", {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization: "Bearer EmTLLtMCVmBgx1MXUVl1gzPqkBxQb0E6uaApcqs7",
        },
        body: JSON.stringify({
            texts,
        }),
    });
}

export async function crossReference(target, otherPoints) {
    const texts = otherPoints.map((x) => x.point.text);

    const prompt = `given some articles fact check an article
--- GIVEN ARTICLES ---
${texts.join("\n\n")}    

--- ARTICLE TO CHECK ---
${target.text}
`;

    return await cohereApiCall(prompt);
}

export async function cohereApiCall(prompt, max_tokens = 500, temperature = 0) {
    return await fetch("https://api.cohere.ai/v1/generate", {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization: "Bearer EmTLLtMCVmBgx1MXUVl1gzPqkBxQb0E6uaApcqs7",
        },
        body: JSON.stringify({
            prompt,
            max_tokens,
            temperature,
        }),
    });
}

export async function analyzeFactualnessFromSource(url) {
    // console.log(url.split("/")[2]);
    const source = url.split("/")[2];
    const prompt = `in one or two sentences quickly and concisely give me a decisive analysis of the how factually correct the information is on ${source}`;

    const res = await cohereApiCall(prompt, 500, 0);
    const json = await res.json();

    return json.generations[0].text;
}

export async function analyzeBiasFromText(text) {
    const prompt = `in one sentence, briefly determine the bias of the article. beware of satire. state the bias in ONE SENTENCE. BE CONCISE. BE BRIEF. 

example start:
here is an example article: 
Silicon Valley - With the announcement of Apple's latest smartphone comes a host of new features including a universal USB-C charging port and a pre-cracked screen right out of the box. CEO Tim Cook says the new changes are aimed to make the iPhone more accessible and provide consumers with the conveniences they deserve. Noting that many iPhone users have grown accustomed to using a cracked screen due to the exorbitant cost of repairs, Cook said they would now offer that user experience right out of the box. For those hoping to crack their screens themselves, Apple will offer iPhone 15 Max Plus Solid which includes an intact screen for $2400.

here is an example output of bias: 
We detected that the bias of this article is against Apple since it is using satire to mock the high cost of iPhone repairs. 
example end. 

Please analyze the bias in the same format for the following article: 
${text}`;

    const res = await cohereApiCall(prompt, 500, 0);
    const json = await res.json();

    return json.generations[0].text;
}

// analyzeFactualnessFromSource(
//     "https://www.cnn.com/2023/09/15/americas/el-chapo-son-extradited-mexico-us-hnk-intl/index.html"
// );
// analyzeFactualnessFromSource(
//     "https://www.thetorontoharold.com/news/iphone-15-to-include-already-cracked-screen"
// );
// analyzeFactualnessFromSource(
//     "https://www.theonion.com/a-clue-exclaims-kevin-mccarthy-after-finding-footpri-1850839037"
// );

export async function analyzeBiasFromURL(url) {
    const prompt = `based on the publisher of the following source analyze potential typical biases, be concise ${url}`;

    const res = await cohereApiCall(prompt);
    const json = await res.json();

    console.log(json.generations[0].text);
    return json.generations[0].text;
}

export async function analyzeClickbaitFromTitle(title) {
    const prompt = `decide whether the title of the following article is clickbait or not. Explain your reasoning 

example start:
Article title: ‘A Clue!’ Exclaims Kevin McCarthy After Finding Footprints That Match Biden’s Shoes
output response: We detected that this title is likely to contain clickbait because of its use of satire, because the title is so ridiculous.
example end. 

Now do the same in the same format for the following article title: 
${title}
`;

    const res = await cohereApiCall(prompt);
    const json = await res.json();

    // console.log(json.generations[0].text);
    return json.generations[0].text;
}

// async function analyzeBiasFromText(text) {
//     const prompt = `from the following text analyze potential biases within it \nText: ${text}`;
//     console.log(prompt);
//     // const res = await cohereApiCall(prompt, 100);
//     // const json = await res.json()
// }

// function
