export async function analyzeBiasFromURL(url) {
    const prompt = `based on the publisher of the following source analyze potential typical biases ${url}`;

    const res = await fetch("https://api.cohere.ai/v1/generate", {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization: "Bearer ntHGp6O5icCoLFLJOlFlXyJFrYFDSypGCa8h3qn0",
        },
        body: JSON.stringify({
            prompt: prompt,
            max_tokens: 500,
        }),
    });

    const json = await res.json();

    console.log(json.generations[0].text);
    return json.generations[0].text;
}
