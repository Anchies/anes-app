// Netlify serverless function for 1nes AI
// Node 18+ on Netlify supports fetch natively.

exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    try {
        const { prompt, mode } = JSON.parse(event.body || "{}");

        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing prompt" }),
            };
        }

        const systemPrompt =
            mode === "ideas"
                ? "You are a productivity coach helping users decide what to work on right now."
                : mode === "tasks"
                ? "You break any goal into clear steps with structure and momentum."
                : "You are a senior developer who writes clean code and explains how it works.";

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
        ];

        const apiKey = process.env.OPENAI_API_KEY;
