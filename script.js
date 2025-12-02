let currentMode = "ideas";

const modeButtons = document.querySelectorAll(".mode-btn");
const promptInput = document.getElementById("promptInput");
const runBtn = document.getElementById("runBtn");
const responseBox = document.getElementById("responseBox");

// Switch modes
modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        modeButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentMode = btn.dataset.mode;

        if (currentMode === "ideas") {
            promptInput.placeholder =
                "Example: I want to make more money but don't know what to focus on.";
        } else if (currentMode === "tasks") {
            promptInput.placeholder =
                "Example: Build a portfolio and get my first remote job.";
        } else if (currentMode === "code") {
            promptInput.placeholder =
                "Example: Make a landing page with a hero, features, and CTA in HTML/CSS.";
        }
    });
});

// Handle click
runBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        responseBox.innerHTML =
            "<p class='placeholder'>Type something first so I can help you.</p>";
        return;
    }

    runBtn.disabled = true;
    runBtn.textContent = "Thinking...";
    responseBox.innerHTML = "<p class='placeholder'>Generating a plan...</p>";

    // For now this is fake logic – later we plug a real AI backend here.
    const reply = generateFakeResponse(prompt, currentMode);

    // Simulate delay
    await new Promise((res) => setTimeout(res, 600));

    responseBox.innerHTML = reply;
    runBtn.disabled = false;
    runBtn.textContent = "Ask 1nes AI";
});

// Simple fake responses for v0 frontend
function generateFakeResponse(prompt, mode) {
    if (mode === "ideas") {
        return `
            <p><strong>Mode:</strong> What should I do?</p>
            <p>Based on what you wrote:</p>
            <ul>
                <li><strong>1.</strong> Define a clear goal in one sentence.</li>
                <li><strong>2.</strong> Pick a skill that moves you closer to that goal (coding, design, outreach, etc.).</li>
                <li><strong>3.</strong> Block 2 hours today to work only on that skill – no distractions.</li>
                <li><strong>4.</strong> Create proof of work (project, post, mini-app) instead of just learning.</li>
                <li><strong>5.</strong> Tomorrow, repeat with slightly higher difficulty.</li>
            </ul>
            <p><em>In the real version, this will be AI-generated specifically from your prompt.</em></p>
        `;
    }

    if (mode === "tasks") {
        return `
            <p><strong>Mode:</strong> Break it down</p>
            <p>Goal you gave me:</p>
            <blockquote>${escapeHtml(prompt)}</blockquote>
            <p>Here's a basic breakdown:</p>
            <ol>
                <li>Clarify what “done” looks like (how do you know it's finished?).</li>
                <li>Split it into 3–5 phases (research, setup, build, polish, publish).</li>
                <li>For each phase, write 3 concrete tasks you can do in 30–60 minutes.</li>
                <li>Put the first 3 tasks into your calendar or to-do app.</li>
                <li>Start with the smallest, dumbest task to build momentum.</li>
            </ol>
            <p><em>Later, real AI will generate detailed step-by-step plans with checkboxes.</em></p>
        `;
    }

    if (mode === "code") {
        return `
            <p><strong>Mode:</strong> Code helper</p>
            <p>You asked for help with:</p>
            <blockquote>${escapeHtml(prompt)}</blockquote>
            <p>This v0 can't run real AI yet, but here's how the final product will work:</p>
            <ul>
                <li>You describe the feature you want (e.g. “build pricing cards for my landing page”).</li>
                <li>AI generates production-ready HTML/CSS/JS for you.</li>
                <li>You paste it into your project, or click “copy code”.</li>
                <li>Advanced version: you connect your GitHub repo and it suggests commits.</li>
            </ul>
            <p><em>Next step for us: connect this UI to a backend with an AI API.</em></p>
        `;
    }

    return "<p>Something went wrong, try again.</p>";
}

// helper to avoid HTML injection when echoing user input
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
