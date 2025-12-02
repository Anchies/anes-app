// Netlify serverless function for 1nes AI
// Uses native fetch available in Node 18+ runtime

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
      { role: "user", content: prompt },
    ];

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing OPENAI_API_KEY" }),
      };
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 450,
      }),
    });

    const data = await response.json();

    const content =
      data?.choices?.[0]?.message?.content || "No response from AI.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ai: content }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server error",
        details: err.message,
      }),
    };
  }
};
