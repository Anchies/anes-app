// 1nes AI Netlify Function - NEW OPENAI API VERSION

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
        ? "You are a productivity coach helping users decide what to work on right now."
        : mode === "tasks"
        ? "You break any goal into clear, simple steps."
        : "You are a senior developer who explains code and generates working examples.";

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
  return {
    statusCode: 500,
    body: JSON.stringify({
      error: "Missing OPENAI_API_KEY",
      debug: "env key not found",
    }),
  };
}

    // NEW OPENAI API ENDPOINT
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        max_output_tokens: 300,
      }),
    });

    const data = await response.json();

    const reply = data?.output_text || "No AI response.";

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
