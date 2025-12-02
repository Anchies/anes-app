// 1nes AI - Fully working OpenAI Netlify Function (NEW API)

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { prompt, mode } = JSON.parse(event.body || "{}");

    const systemPrompt =
      mode === "ideas"
        ? "You are a productivity coach helping users decide what to work on."
        : mode === "tasks"
        ? "You break goals into clear, simple, actionable steps."
        : "You are a senior developer who writes and explains code.";

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Missing OPENAI_API_KEY",
        }),
      };
    }

    // ⭐ CORRECT OpenAI Responses API format
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        // NEW FORMAT → "input" is a SINGLE STRING
        input: `${systemPrompt}\nUser: ${prompt}`,
        max_output_tokens: 300,
      }),
    });

    const data = await response.json();

    // ⭐ CORRECT response field
    const reply = data.output_text || "No AI response.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ai: reply }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
